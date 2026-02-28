import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const INJECTION_KIT_PRICE = 3000; // $30.00 in cents
const SHIPPING_PRICE = 3500; // $35.00 in cents

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const squareToken = Deno.env.get("SQUARE_ACCESS_TOKEN")!;
    const squareLocationId = Deno.env.get("SQUARE_LOCATION_ID")!;

    if (!squareToken || !squareLocationId) {
      return new Response(JSON.stringify({ error: "Missing Square credentials" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Auth
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub as string;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Parse body
    const { request_id, card_nonce, use_saved_card, include_injection_kit, delivery_method } = await req.json();
    if (!request_id || (!card_nonce && !use_saved_card)) {
      return new Response(JSON.stringify({ error: "Missing request_id or payment method" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch request
    const { data: requestRow, error: reqError } = await adminClient
      .from("peptide_requests")
      .select("*")
      .eq("id", request_id)
      .single();

    if (reqError || !requestRow) {
      return new Response(JSON.stringify({ error: "Request not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (requestRow.user_id !== userId) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (requestRow.status !== "approved") {
      return new Response(JSON.stringify({ error: "Request is not approved" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get price
    let price = requestRow.price;
    if (!price) {
      const { data: peptide } = await adminClient
        .from("peptides")
        .select("price")
        .eq("id", requestRow.peptide_id)
        .single();
      price = peptide?.price;
    }
    if (!price || price <= 0) {
      return new Response(JSON.stringify({ error: "No price found for this peptide" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Calculate total in cents
    const addKit = include_injection_kit === true || include_injection_kit === "true";
    const addShipping = typeof delivery_method === "string" && delivery_method.toLowerCase() === "shipping";

    let totalCents = Math.round(price * 100);
    if (addKit) totalCents += INJECTION_KIT_PRICE;
    if (addShipping) totalCents += SHIPPING_PRICE;

    const squareBase = "https://connect.squareup.com/v2";
    const squareHeaders = {
      "Square-Version": "2025-01-23",
      Authorization: `Bearer ${squareToken}`,
      "Content-Type": "application/json",
    };

    // Build line items for the order
    const peptideName = requestRow.variation_label
      ? `${requestRow.peptide_name} — ${requestRow.variation_label}`
      : requestRow.peptide_name;

    const lineItems: Array<Record<string, unknown>> = [
      {
        name: peptideName,
        quantity: "1",
        base_price_money: { amount: Math.round(price * 100), currency: "USD" },
      },
    ];
    if (addKit) {
      lineItems.push({
        name: "Injection Kit",
        quantity: "1",
        base_price_money: { amount: INJECTION_KIT_PRICE, currency: "USD" },
      });
    }
    if (addShipping) {
      lineItems.push({
        name: "Overnight Shipping",
        quantity: "1",
        base_price_money: { amount: SHIPPING_PRICE, currency: "USD" },
      });
    }

    // Step 1: Create Square Order
    const orderRes = await fetch(`${squareBase}/orders`, {
      method: "POST",
      headers: squareHeaders,
      body: JSON.stringify({
        idempotency_key: `order-${request_id}-${Date.now()}`,
        order: {
          location_id: squareLocationId,
          line_items: lineItems,
          reference_id: request_id,
        },
      }),
    });
    const orderData = await orderRes.json();
    if (!orderRes.ok || !orderData.order?.id) {
      console.error("Square create order error:", orderData);
      return new Response(JSON.stringify({ error: "Failed to create order", details: orderData.errors }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const orderId = orderData.order.id;

    // Resolve payment source — saved card or new nonce
    const { data: profile } = await adminClient
      .from("profiles")
      .select("square_customer_id, square_card_id")
      .eq("user_id", userId)
      .single();

    let paymentSourceId = card_nonce;
    const squareCustomerId = profile?.square_customer_id;

    if (use_saved_card && profile?.square_card_id) {
      paymentSourceId = profile.square_card_id;
    }

    // Step 2: Process Payment
    const payRes = await fetch(`${squareBase}/payments`, {
      method: "POST",
      headers: squareHeaders,
      body: JSON.stringify({
        idempotency_key: `pay-${request_id}-${Date.now()}`,
        source_id: paymentSourceId,
        amount_money: { amount: totalCents, currency: "USD" },
        order_id: orderId,
        location_id: squareLocationId,
        autocomplete: true,
        note: `Peptide: ${peptideName} | Request: ${request_id}`,
        ...(squareCustomerId ? { customer_id: squareCustomerId } : {}),
      }),
    });
    const payData = await payRes.json();
    if (!payRes.ok || !payData.payment?.id) {
      console.error("Square payment error:", payData);
      const errMsg = payData.errors?.[0]?.detail || "Payment failed";
      return new Response(JSON.stringify({ error: errMsg, details: payData.errors }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 3: Save card on file if new nonce and customer exists
    if (card_nonce && squareCustomerId && !use_saved_card) {
      try {
        const cardRes = await fetch(`${squareBase}/cards`, {
          method: "POST",
          headers: squareHeaders,
          body: JSON.stringify({
            idempotency_key: `card-${request_id}-${Date.now()}`,
            source_id: card_nonce,
            card: { customer_id: squareCustomerId },
          }),
        });
        const cardData = await cardRes.json();
        if (cardRes.ok && cardData.card?.id) {
          await adminClient
            .from("profiles")
            .update({
              square_card_id: cardData.card.id,
              square_card_last4: cardData.card.last_4 || null,
              square_card_brand: cardData.card.card_brand || null,
            })
            .eq("user_id", userId);
          console.log(`Card ${cardData.card.id} saved on file for user ${userId}`);
        }
      } catch (cardErr) {
        console.error("Failed to save card on file (non-fatal):", cardErr);
      }
    }

    // Step 4: Update request to paid
    await adminClient
      .from("peptide_requests")
      .update({
        status: "paid",
        square_order_id: orderId,
        include_injection_kit: addKit,
        delivery_method: addShipping ? "shipping" : "pickup",
        payment_url: null,
      })
      .eq("id", request_id);

    console.log(`Payment ${payData.payment.id} completed for request ${request_id}`);

    // Step 5: Send Slack purchase notification (non-blocking)
    try {
      const { data: patientProfile } = await adminClient
        .from("profiles")
        .select("first_name, last_name")
        .eq("user_id", userId)
        .single();

      // Get peptide cost for profit calculation
      const { data: peptideRow } = await adminClient
        .from("peptides")
        .select("cost")
        .eq("id", requestRow.peptide_id)
        .single();

      const costCents = Math.round((peptideRow?.cost || 0) * 100);

      const slackUrl = `${supabaseUrl}/functions/v1/slack-notify`;
      fetch(slackUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        body: JSON.stringify({
          type: "purchase",
          payload: {
            patient_name: `${patientProfile?.first_name || "Unknown"} ${patientProfile?.last_name || ""}`.trim(),
            peptide_name: peptideName,
            total_cents: totalCents,
            cost_cents: costCents,
            include_kit: addKit,
            delivery_method: addShipping ? "shipping" : "pickup",
            request_id,
          },
        }),
      }).catch((err) => console.error("Slack notify failed (non-fatal):", err));
    } catch (slackErr) {
      console.error("Slack notify setup failed (non-fatal):", slackErr);
    }

    return new Response(JSON.stringify({
      success: true,
      payment_id: payData.payment.id,
      order_id: orderId,
      total_cents: totalCents,
    }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("process-peptide-payment error:", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

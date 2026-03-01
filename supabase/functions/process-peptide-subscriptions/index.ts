import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const INJECTION_KIT_PRICE = 3000; // cents
const SHIPPING_PRICE = 3500; // cents
const COURIER_PRICE = 5000; // cents

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const squareToken = Deno.env.get("SQUARE_ACCESS_TOKEN")!;
    const squareLocationId = Deno.env.get("SQUARE_LOCATION_ID")!;

    const adminClient = createClient(supabaseUrl, serviceKey);
    const squareBase = "https://connect.squareup.com/v2";
    const squareHeaders = {
      "Square-Version": "2025-01-23",
      Authorization: `Bearer ${squareToken}`,
      "Content-Type": "application/json",
    };

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // Find all active subscriptions due today or earlier
    const { data: subs, error: subErr } = await adminClient
      .from("peptide_subscriptions")
      .select("*")
      .eq("status", "active")
      .lte("next_charge_at", today);

    if (subErr) {
      console.error("Error fetching subscriptions:", subErr);
      return new Response(JSON.stringify({ error: subErr.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!subs || subs.length === 0) {
      return new Response(JSON.stringify({ processed: 0, message: "No subscriptions due" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let processed = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const sub of subs) {
      try {
        // Get profile with saved card
        const { data: profile } = await adminClient
          .from("profiles")
          .select("square_customer_id, square_card_id, first_name, last_name")
          .eq("user_id", sub.user_id)
          .single();

        if (!profile?.square_customer_id || !profile?.square_card_id) {
          console.error(`Sub ${sub.id}: No saved card for user ${sub.user_id}`);
          errors.push(`Sub ${sub.id}: No saved card`);
          failed++;
          continue;
        }

        // Check membership is still active
        const { data: membership } = await adminClient
          .from("memberships")
          .select("id, status")
          .eq("user_id", sub.user_id)
          .eq("status", "active")
          .maybeSingle();

        if (!membership) {
          console.log(`Sub ${sub.id}: No active membership, pausing subscription`);
          await adminClient
            .from("peptide_subscriptions")
            .update({ status: "paused" })
            .eq("id", sub.id);
          errors.push(`Sub ${sub.id}: No active membership, paused`);
          failed++;
          continue;
        }

        // Calculate total
        const addKit = sub.include_injection_kit === true;
        const addShipping = sub.delivery_method === "shipping";
        const addCourier = sub.delivery_method === "courier";
        let totalCents = Math.round(sub.price * 100);
        if (addKit) totalCents += INJECTION_KIT_PRICE;
        if (addShipping) totalCents += SHIPPING_PRICE;
        if (addCourier) totalCents += COURIER_PRICE;

        const peptideName = sub.variation_label
          ? `${sub.peptide_name} — ${sub.variation_label}`
          : sub.peptide_name;

        // Build line items
        const lineItems: Array<Record<string, unknown>> = [
          {
            name: `${peptideName} (Monthly Auto-Order)`,
            quantity: "1",
            base_price_money: { amount: Math.round(sub.price * 100), currency: "USD" },
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
        if (addCourier) {
          lineItems.push({
            name: "Courier Delivery",
            quantity: "1",
            base_price_money: { amount: COURIER_PRICE, currency: "USD" },
          });
        }

        // Create Square Order
        const orderRes = await fetch(`${squareBase}/orders`, {
          method: "POST",
          headers: squareHeaders,
          body: JSON.stringify({
            idempotency_key: `auto-order-${sub.id}-${today}`,
            order: {
              location_id: squareLocationId,
              line_items: lineItems,
              reference_id: `peptide-sub-${sub.id}`,
            },
          }),
        });
        const orderData = await orderRes.json();
        if (!orderRes.ok || !orderData.order?.id) {
          console.error(`Sub ${sub.id}: Square order failed`, orderData);
          errors.push(`Sub ${sub.id}: Order creation failed`);
          failed++;
          continue;
        }

        // Process Payment with saved card
        const payRes = await fetch(`${squareBase}/payments`, {
          method: "POST",
          headers: squareHeaders,
          body: JSON.stringify({
            idempotency_key: `auto-pay-${sub.id}-${today}`,
            source_id: profile.square_card_id,
            amount_money: { amount: totalCents, currency: "USD" },
            order_id: orderData.order.id,
            location_id: squareLocationId,
            autocomplete: true,
            customer_id: profile.square_customer_id,
            note: `Auto-order: ${peptideName} | Sub: ${sub.id}`,
          }),
        });
        const payData = await payRes.json();
        if (!payRes.ok || !payData.payment?.id) {
          console.error(`Sub ${sub.id}: Payment failed`, payData);
          errors.push(`Sub ${sub.id}: Payment failed - ${payData.errors?.[0]?.detail || "unknown"}`);
          failed++;
          continue;
        }

        // Create a peptide_request record for tracking
        await adminClient.from("peptide_requests").insert({
          user_id: sub.user_id,
          peptide_id: sub.peptide_id,
          peptide_name: sub.peptide_name,
          variation_label: sub.variation_label,
          price: sub.price,
          status: "paid",
          include_injection_kit: addKit,
          delivery_method: addShipping ? "shipping" : "pickup",
          square_order_id: orderData.order.id,
        });

        // Advance next_charge_at by ~30 days
        const nextCharge = new Date(sub.next_charge_at);
        nextCharge.setDate(nextCharge.getDate() + 30);

        await adminClient
          .from("peptide_subscriptions")
          .update({
            next_charge_at: nextCharge.toISOString().split("T")[0],
            last_charged_at: new Date().toISOString(),
          })
          .eq("id", sub.id);

        // Slack notification (non-blocking)
        const patientName = `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "Unknown";
        fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${serviceKey}` },
          body: JSON.stringify({
            type: "auto_reorder",
            payload: {
              patient_name: patientName,
              peptide_name: peptideName,
              total_cents: totalCents,
              delivery_method: addShipping ? "shipping" : "pickup",
            },
          }),
        }).catch((e) => console.error("Slack error:", e));

        processed++;
        console.log(`Sub ${sub.id}: Charged $${(totalCents / 100).toFixed(2)} for ${peptideName}`);
      } catch (subError) {
        console.error(`Sub ${sub.id} error:`, subError);
        errors.push(`Sub ${sub.id}: ${subError.message}`);
        failed++;
      }
    }

    return new Response(
      JSON.stringify({ processed, failed, errors: errors.length > 0 ? errors : undefined }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("process-peptide-subscriptions error:", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const INJECTION_KIT_PRICE = 3000; // $30.00 in cents
const SHIPPING_PRICE = 3500; // $35.00 in cents
const SHIPPING_SKU = "SHIP-FEDEX-ONP";
const INJECTION_KIT_SKU = "ET-INS-05ML-31G-516-40";

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

    // Get caller identity
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub as string;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const body = await req.json();
    const request_id = body?.request_id as string | undefined;
    const include_injection_kit = body?.include_injection_kit;
    const delivery_method = body?.delivery_method;
    if (!request_id) {
      return new Response(JSON.stringify({ error: "Missing request_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch the request
    const { data: requestRow, error: reqError } = await adminClient
      .from("peptide_requests")
      .select("*")
      .eq("id", request_id)
      .single();

    if (reqError || !requestRow) {
      return new Response(JSON.stringify({ error: "Request not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Ensure the caller owns this request
    if (requestRow.user_id !== userId) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Must be approved
    if (requestRow.status !== "approved") {
      return new Response(JSON.stringify({ error: "Request is not approved" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
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
      return new Response(
        JSON.stringify({ error: "No price found for this peptide" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const SQUARE_ACCESS_TOKEN = Deno.env.get("SQUARE_ACCESS_TOKEN");
    const SQUARE_LOCATION_ID = Deno.env.get("SQUARE_LOCATION_ID");

    if (!SQUARE_ACCESS_TOKEN || !SQUARE_LOCATION_ID) {
      return new Response(
        JSON.stringify({ error: "Missing Square credentials" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Normalize add-ons from payload
    const addKit =
      include_injection_kit === true || include_injection_kit === "true";

    const normalizedDeliveryMethod =
      typeof delivery_method === "string" &&
      delivery_method.toLowerCase() === "shipping"
        ? "shipping"
        : "pickup";
    const addShipping = normalizedDeliveryMethod === "shipping";

    const peptideName = requestRow.variation_label
      ? `${requestRow.peptide_name} — ${requestRow.variation_label}`
      : requestRow.peptide_name;

    const lineItems: Array<Record<string, unknown>> = [
      {
        name: peptideName,
        quantity: "1",
        base_price_money: {
          amount: Math.round(price * 100),
          currency: "USD",
        },
      },
    ];

    if (addKit) {
      lineItems.push({
        name: `Injection Kit (${INJECTION_KIT_SKU})`,
        quantity: "1",
        note: `SKU: ${INJECTION_KIT_SKU}`,
        base_price_money: {
          amount: INJECTION_KIT_PRICE,
          currency: "USD",
        },
      });
    }

    if (addShipping) {
      lineItems.push({
        name: `Overnight Shipping (${SHIPPING_SKU})`,
        quantity: "1",
        note: `SKU: ${SHIPPING_SKU}`,
        base_price_money: {
          amount: SHIPPING_PRICE,
          currency: "USD",
        },
      });
    }

    const payload = {
      idempotency_key: crypto.randomUUID(),
      order: {
        location_id: SQUARE_LOCATION_ID,
        line_items: lineItems,
      },
    };

    const squareRes = await fetch(
      "https://connect.squareup.com/v2/online-checkout/payment-links",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`,
          "Square-Version": "2026-01-22",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const squareData = await squareRes.json();

    if (!squareRes.ok) {
      console.error("Square API error:", JSON.stringify(squareData));
      return new Response(
        JSON.stringify({ error: "Square API error", details: squareData }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const paymentUrl = squareData.payment_link?.url || squareData.payment_link?.long_url;
    const squareOrderId = squareData.related_resources?.orders?.[0]?.id || squareData.payment_link?.order_id || null;

    // Save options and payment link
    const { error: updateError } = await adminClient
      .from("peptide_requests")
      .update({
        payment_url: paymentUrl,
        square_order_id: squareOrderId,
        include_injection_kit: addKit,
        delivery_method: normalizedDeliveryMethod,
      })
      .eq("id", request_id);

    if (updateError) {
      console.error("DB update error:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update request" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        payment_url: paymentUrl,
        square_order_id: squareOrderId,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Unexpected error:", e);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

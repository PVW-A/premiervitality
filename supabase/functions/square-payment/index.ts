// supabase/functions/square-payment/index.ts
// Handles native Square card charge + subscription creation
// Deploy: npx supabase functions deploy square-payment --project-ref acmawliuwcvglwbnypst

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Square plan IDs — create these once in Square Dashboard → Subscriptions → Plans
// Then add them to membershipConfig.ts squarePlanId field
const SQUARE_PLAN_IDS: Record<string, Record<string, string>> = {
  essential: {
    monthly: Deno.env.get("SQUARE_PLAN_ESSENTIAL_MONTHLY") || "",
    annual: Deno.env.get("SQUARE_PLAN_ESSENTIAL_ANNUAL") || "",
  },
  premium: {
    monthly: Deno.env.get("SQUARE_PLAN_PREMIUM_MONTHLY") || "",
    annual: Deno.env.get("SQUARE_PLAN_PREMIUM_ANNUAL") || "",
  },
  elite: {
    monthly: Deno.env.get("SQUARE_PLAN_ELITE_MONTHLY") || "",
    annual: Deno.env.get("SQUARE_PLAN_ELITE_ANNUAL") || "",
  },
};

const SQUARE_BASE = "https://connect.squareup.com/v2";
const squareHeaders = {
  "Square-Version": "2024-01-18",
  "Authorization": `Bearer ${Deno.env.get("SQUARE_ACCESS_TOKEN")}`,
  "Content-Type": "application/json",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { sourceId, tierId, billing, amount, userId, email } = await req.json();

    if (!sourceId || !tierId || !userId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: corsHeaders });
    }

    const idempotencyKey = `${userId}-${tierId}-${Date.now()}`;

    // Step 1: Create or find Square customer
    let squareCustomerId: string;

    const searchRes = await fetch(`${SQUARE_BASE}/customers/search`, {
      method: "POST",
      headers: squareHeaders,
      body: JSON.stringify({
        query: { filter: { email_address: { exact: email } } },
      }),
    });
    const searchData = await searchRes.json();

    if (searchData.customers?.[0]) {
      squareCustomerId = searchData.customers[0].id;
    } else {
      const createRes = await fetch(`${SQUARE_BASE}/customers`, {
        method: "POST",
        headers: squareHeaders,
        body: JSON.stringify({
          idempotency_key: `create-${userId}`,
          email_address: email,
          reference_id: userId,
        }),
      });
      const createData = await createRes.json();
      squareCustomerId = createData.customer.id;
    }

    // Step 2: Save card on file
    const cardRes = await fetch(`${SQUARE_BASE}/cards`, {
      method: "POST",
      headers: squareHeaders,
      body: JSON.stringify({
        idempotency_key: `card-${idempotencyKey}`,
        source_id: sourceId,
        card: { customer_id: squareCustomerId },
      }),
    });
    const cardData = await cardRes.json();
    if (!cardData.card) {
      return new Response(JSON.stringify({ error: cardData.errors?.[0]?.detail || "Card save failed" }), { status: 400, headers: corsHeaders });
    }
    const cardId = cardData.card.id;

    // Step 3: Create subscription (preferred) or one-time charge
    const planId = SQUARE_PLAN_IDS[tierId]?.[billing];
    let subscriptionId: string | null = null;
    let nextBillingDate: string | null = null;

    if (planId) {
      // Create recurring subscription
      const subRes = await fetch(`${SQUARE_BASE}/subscriptions`, {
        method: "POST",
        headers: squareHeaders,
        body: JSON.stringify({
          idempotency_key: `sub-${idempotencyKey}`,
          location_id: Deno.env.get("SQUARE_LOCATION_ID"),
          plan_variation_id: planId,
          customer_id: squareCustomerId,
          card_id: cardId,
          start_date: new Date().toISOString().split("T")[0],
        }),
      });
      const subData = await subRes.json();
      if (subData.subscription) {
        subscriptionId = subData.subscription.id;
        nextBillingDate = subData.subscription.charged_through_date;
      }
    } else {
      // Fallback: one-time charge if plan IDs not yet configured
      const payRes = await fetch(`${SQUARE_BASE}/payments`, {
        method: "POST",
        headers: squareHeaders,
        body: JSON.stringify({
          idempotency_key: `pay-${idempotencyKey}`,
          source_id: cardId,
          customer_id: squareCustomerId,
          amount_money: { amount, currency: "USD" },
          location_id: Deno.env.get("SQUARE_LOCATION_ID"),
          note: `${tierId} membership - ${billing}`,
        }),
      });
      const payData = await payRes.json();
      if (!payData.payment) {
        return new Response(JSON.stringify({ error: payData.errors?.[0]?.detail || "Payment failed" }), { status: 400, headers: corsHeaders });
      }
    }

    return new Response(
      JSON.stringify({ success: true, subscriptionId, nextBillingDate, squareCustomerId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: corsHeaders });
  }
});

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const squareToken = Deno.env.get("SQUARE_ACCESS_TOKEN")!;
    const squareLocationId = Deno.env.get("SQUARE_LOCATION_ID")!;

    const userClient = createClient(supabaseUrl, anonKey, {
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
    const userEmail = claimsData.claims.email as string;

    // Parse request body
    const { tier_id, billing_cycle, card_nonce, address, first_name, last_name, phone, email: contactEmail, dob } = await req.json();

    if (!tier_id || !billing_cycle || !card_nonce) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: tier_id, billing_cycle, card_nonce" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const adminClient = createClient(supabaseUrl, serviceKey);

    // Get the tier to find the correct plan variation ID
    const { data: tier, error: tierError } = await adminClient
      .from("membership_tiers")
      .select("*")
      .eq("id", tier_id)
      .single();

    if (tierError || !tier) {
      return new Response(JSON.stringify({ error: "Tier not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const planVariationId =
      billing_cycle === "annual" ? tier.square_plan_id_annual : tier.square_plan_id;

    if (!planVariationId) {
      return new Response(
        JSON.stringify({ error: "No Square plan configured for this tier/billing cycle" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get user profile
    const { data: profile } = await adminClient
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    const squareBase = "https://connect.squareup.com/v2";
    const squareHeaders = {
      "Square-Version": "2025-01-23",
      Authorization: `Bearer ${squareToken}`,
      "Content-Type": "application/json",
    };

    // --- Step 1: Create or update Square Customer ---
    let squareCustomerId = profile?.square_customer_id;

    const customerBody: Record<string, unknown> = {
      given_name: first_name || profile?.first_name || "",
      family_name: last_name || profile?.last_name || "",
      email_address: contactEmail || userEmail,
      phone_number: phone || profile?.phone || "",
      idempotency_key: `cust-${userId}`,
    };

    if (address) {
      customerBody.address = {
        address_line_1: address.line1 || "",
        locality: address.city || "",
        administrative_district_level_1: address.state || "",
        postal_code: address.zip || "",
        country: "US",
      };
    }

    if (squareCustomerId) {
      // Update existing customer
      await fetch(`${squareBase}/customers/${squareCustomerId}`, {
        method: "PUT",
        headers: squareHeaders,
        body: JSON.stringify(customerBody),
      });
    } else {
      // Create new customer
      const custRes = await fetch(`${squareBase}/customers`, {
        method: "POST",
        headers: squareHeaders,
        body: JSON.stringify(customerBody),
      });
      const custData = await custRes.json();
      if (!custRes.ok || !custData.customer?.id) {
        console.error("Square create customer error:", custData);
        return new Response(
          JSON.stringify({ error: "Failed to create Square customer", details: custData.errors }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      squareCustomerId = custData.customer.id;
    }

    // Save square_customer_id, address, and personal info to profile
    const profileUpdate: Record<string, unknown> = {
      square_customer_id: squareCustomerId,
    };
    if (first_name) profileUpdate.first_name = first_name;
    if (last_name) profileUpdate.last_name = last_name;
    if (phone) profileUpdate.phone = phone;
    if (address) {
      profileUpdate.address_line1 = address.line1 || null;
      profileUpdate.address_city = address.city || null;
      profileUpdate.address_state = address.state || null;
      profileUpdate.address_zip = address.zip || null;
    }
    await adminClient.from("profiles").update(profileUpdate).eq("user_id", userId);

    // --- Step 2: Create Card on File ---
    const cardRes = await fetch(`${squareBase}/cards`, {
      method: "POST",
      headers: squareHeaders,
      body: JSON.stringify({
        idempotency_key: `card-${userId}-${Date.now()}`,
        source_id: card_nonce,
        card: {
          customer_id: squareCustomerId,
        },
      }),
    });
    const cardData = await cardRes.json();
    if (!cardRes.ok || !cardData.card?.id) {
      console.error("Square create card error:", cardData);
      return new Response(
        JSON.stringify({ error: "Failed to save card", details: cardData.errors }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const cardId = cardData.card.id;

    // --- Step 3: Create Subscription ---
    const startDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const subRes = await fetch(`${squareBase}/subscriptions`, {
      method: "POST",
      headers: squareHeaders,
      body: JSON.stringify({
        idempotency_key: `sub-${userId}-${tier_id}-${Date.now()}`,
        location_id: squareLocationId,
        plan_variation_id: planVariationId,
        customer_id: squareCustomerId,
        card_id: cardId,
        start_date: startDate,
      }),
    });
    const subData = await subRes.json();
    if (!subRes.ok || !subData.subscription?.id) {
      console.error("Square create subscription error:", subData);
      return new Response(
        JSON.stringify({ error: "Failed to create subscription", details: subData.errors }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Subscription created: ${subData.subscription.id} for user ${userId}`);

    // Non-blocking Slack notification
    try {
      const patientName = `${first_name || profile?.first_name || ""} ${last_name || profile?.last_name || ""}`.trim() || "Unknown";
      fetch(`${supabaseUrl}/functions/v1/slack-notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${serviceKey}` },
        body: JSON.stringify({
          type: "subscription",
          payload: { patient_name: patientName, tier_name: tier.name, billing_cycle },
        }),
      }).catch((e) => console.error("Slack notify error:", e));
    } catch (e) { console.error("Slack notify error:", e); }

    return new Response(
      JSON.stringify({
        success: true,
        subscription_id: subData.subscription.id,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("create-subscription error:", e);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

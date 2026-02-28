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

    const { new_tier_id } = await req.json();
    if (!new_tier_id) {
      return new Response(JSON.stringify({ error: "Missing new_tier_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, serviceKey);

    // Get current membership
    const { data: membership, error: memErr } = await adminClient
      .from("memberships")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    if (memErr || !membership) {
      return new Response(JSON.stringify({ error: "No active membership found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get new tier
    const { data: newTier, error: tierErr } = await adminClient
      .from("membership_tiers")
      .select("*")
      .eq("id", new_tier_id)
      .single();

    if (tierErr || !newTier) {
      return new Response(JSON.stringify({ error: "Tier not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get current tier to verify upgrade direction
    const { data: currentTier } = await adminClient
      .from("membership_tiers")
      .select("sort_order")
      .eq("id", membership.tier_id)
      .single();

    if (currentTier && newTier.sort_order <= currentTier.sort_order) {
      return new Response(JSON.stringify({ error: "Can only upgrade to a higher tier" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const newPlanVariationId =
      membership.billing_cycle === "annual"
        ? newTier.square_plan_id_annual
        : newTier.square_plan_id;

    if (!newPlanVariationId) {
      return new Response(
        JSON.stringify({ error: "No Square plan configured for this tier" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const squareBase = "https://connect.squareup.com/v2";
    const squareHeaders = {
      "Square-Version": "2025-01-23",
      Authorization: `Bearer ${squareToken}`,
      "Content-Type": "application/json",
    };

    // Get Square customer ID from profile (or create one)
    const { data: profile } = await adminClient
      .from("profiles")
      .select("square_customer_id, first_name, last_name, phone")
      .eq("user_id", userId)
      .single();

    let squareCustomerId = profile?.square_customer_id;

    if (!squareCustomerId && userEmail) {
      // Search Square for an existing customer matching this email
      const searchCustRes = await fetch(`${squareBase}/customers/search`, {
        method: "POST",
        headers: squareHeaders,
        body: JSON.stringify({
          query: {
            filter: {
              email_address: { exact: userEmail },
            },
          },
        }),
      });
      const searchCustData = await searchCustRes.json();
      const matchedCustomer = searchCustData.customers?.[0];

      if (matchedCustomer) {
        squareCustomerId = matchedCustomer.id;
        console.log(`Matched existing Square customer ${squareCustomerId} by email ${userEmail}`);
      }
    }

    if (!squareCustomerId) {
      // No match found — create a new Square customer
      const custRes = await fetch(`${squareBase}/customers`, {
        method: "POST",
        headers: squareHeaders,
        body: JSON.stringify({
          given_name: profile?.first_name || "",
          family_name: profile?.last_name || "",
          email_address: userEmail || "",
          phone_number: profile?.phone || "",
          idempotency_key: `cust-${userId}`,
        }),
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
      console.log(`Created new Square customer ${squareCustomerId} for user ${userId}`);
    }

    // Save the square_customer_id to profile
    await adminClient
      .from("profiles")
      .update({ square_customer_id: squareCustomerId })
      .eq("user_id", userId);

    // Find the active Square subscription for this customer
    const searchRes = await fetch(
      `${squareBase}/subscriptions/search`,
      {
        method: "POST",
        headers: squareHeaders,
        body: JSON.stringify({
          query: {
            filter: {
              customer_ids: [squareCustomerId],
              location_ids: [squareLocationId],
            },
          },
        }),
      }
    );
    const searchData = await searchRes.json();
    const activeSub = searchData.subscriptions?.find(
      (s: { status: string }) => s.status === "ACTIVE"
    );

    let resultSubscriptionId: string;

    if (!activeSub) {
      // Fetch plan variation phases from Square Catalog API
      // Plans created in the Square Dashboard use RELATIVE pricing and require phases
      const catalogRes = await fetch(
        `${squareBase}/catalog/object/${newPlanVariationId}`,
        { headers: squareHeaders }
      );
      const catalogData = await catalogRes.json();
      const planPhases =
        catalogData.object?.subscription_plan_variation_data?.phases || [];

      const subscriptionPhases = planPhases.map(
        (phase: { ordinal: number; cadence: string; uid: string }) => ({
          ordinal: phase.ordinal,
          order_template_id: phase.uid,
        })
      );

      // No existing subscription — create a new one
      const createRes = await fetch(`${squareBase}/subscriptions`, {
        method: "POST",
        headers: squareHeaders,
        body: JSON.stringify({
          idempotency_key: `upgrade-${userId}-${Date.now()}`,
          location_id: squareLocationId,
          customer_id: squareCustomerId,
          plan_variation_id: newPlanVariationId,
          start_date: new Date().toISOString().split("T")[0],
          ...(subscriptionPhases.length > 0 && { phases: subscriptionPhases }),
        }),
      });
      const createData = await createRes.json();

      if (!createRes.ok || !createData.subscription) {
        console.error("Square subscription create error:", createData);
        return new Response(
          JSON.stringify({
            error: "Failed to create subscription with Square",
            details: createData.errors,
          }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      resultSubscriptionId = createData.subscription.id;
      console.log(`Created new Square subscription ${resultSubscriptionId} for user ${userId}`);
    } else {
      // Swap the subscription plan using Square's update endpoint
      const updateRes = await fetch(
        `${squareBase}/subscriptions/${activeSub.id}`,
        {
          method: "PUT",
          headers: squareHeaders,
          body: JSON.stringify({
            subscription: {
              plan_variation_id: newPlanVariationId,
            },
          }),
        }
      );
      const updateData = await updateRes.json();

      if (!updateRes.ok || !updateData.subscription) {
        console.error("Square subscription update error:", updateData);
        return new Response(
          JSON.stringify({
            error: "Failed to update subscription with Square",
            details: updateData.errors,
          }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      resultSubscriptionId = activeSub.id;
    }

    // Update local membership record
    await adminClient
      .from("memberships")
      .update({
        tier_id: new_tier_id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", membership.id);

    // Sync profile info from Square customer record
    try {
      const custDetailRes = await fetch(
        `${squareBase}/customers/${squareCustomerId}`,
        { headers: squareHeaders }
      );
      const custDetailData = await custDetailRes.json();
      const sqCust = custDetailData.customer;
      if (sqCust) {
        const profileSync: Record<string, unknown> = {};
        if (sqCust.given_name) profileSync.first_name = sqCust.given_name;
        if (sqCust.family_name) profileSync.last_name = sqCust.family_name;
        if (sqCust.phone_number) profileSync.phone = sqCust.phone_number;
        if (sqCust.birthday) profileSync.birthday = sqCust.birthday;
        if (sqCust.address) {
          if (sqCust.address.address_line_1) profileSync.address_line1 = sqCust.address.address_line_1;
          if (sqCust.address.locality) profileSync.address_city = sqCust.address.locality;
          if (sqCust.address.administrative_district_level_1) profileSync.address_state = sqCust.address.administrative_district_level_1;
          if (sqCust.address.postal_code) profileSync.address_zip = sqCust.address.postal_code;
        }
        if (Object.keys(profileSync).length > 0) {
          await adminClient
            .from("profiles")
            .update(profileSync)
            .eq("user_id", userId);
          console.log(`Synced Square profile data for user ${userId}:`, Object.keys(profileSync));
        }
      }
    } catch (syncErr) {
      console.error("Non-fatal: failed to sync Square profile data:", syncErr);
    }

    console.log(
      `Subscription ${resultSubscriptionId} upgraded to plan ${newPlanVariationId} for user ${userId}`
    );

    return new Response(
      JSON.stringify({
        success: true,
        subscription_id: resultSubscriptionId,
        new_plan: newPlanVariationId,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("upgrade-subscription error:", e);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

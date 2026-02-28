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

    // Get Square customer ID from profile (or create one)
    const { data: profile } = await adminClient
      .from("profiles")
      .select("square_customer_id, first_name, last_name, phone")
      .eq("user_id", userId)
      .single();

    let squareCustomerId = profile?.square_customer_id;

    if (!squareCustomerId) {
      // Auto-create a Square customer for users who don't have one yet
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

      // Save the new square_customer_id to the profile
      await adminClient
        .from("profiles")
        .update({ square_customer_id: squareCustomerId })
        .eq("user_id", userId);

      console.log(`Created Square customer ${squareCustomerId} for user ${userId}`);
    }

    const squareBase = "https://connect.squareup.com/v2";
    const squareHeaders = {
      "Square-Version": "2025-01-23",
      Authorization: `Bearer ${squareToken}`,
      "Content-Type": "application/json",
    };

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

    if (!activeSub) {
      return new Response(
        JSON.stringify({ error: "No active Square subscription found. Please contact support." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Swap the subscription plan using Square's update endpoint
    // Square handles prorating automatically when changing plan variations
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

    // Update local membership record
    await adminClient
      .from("memberships")
      .update({
        tier_id: new_tier_id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", membership.id);

    console.log(
      `Subscription ${activeSub.id} upgraded to plan ${newPlanVariationId} for user ${userId}`
    );

    return new Response(
      JSON.stringify({
        success: true,
        subscription_id: activeSub.id,
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

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SQUARE_BASE = "https://connect.squareup.com/v2";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;

    // Get Square customer ID from profile
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: profile } = await serviceClient
      .from("profiles")
      .select("square_customer_id, phone")
      .eq("user_id", userId)
      .single();

    if (!profile?.square_customer_id) {
      return new Response(
        JSON.stringify({
          error: "no_loyalty_account",
          message: "No Square customer linked to your account yet. Points will appear after your first order.",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const SQUARE_ACCESS_TOKEN = Deno.env.get("SQUARE_ACCESS_TOKEN");
    if (!SQUARE_ACCESS_TOKEN) throw new Error("SQUARE_ACCESS_TOKEN not configured");

    const squareHeaders = {
      Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      "Square-Version": "2025-04-16",
    };

    // 1. Fetch loyalty program (reward tiers)
    const programRes = await fetch(`${SQUARE_BASE}/loyalty/programs/main`, {
      headers: squareHeaders,
    });
    const programData = await programRes.json();
    if (!programRes.ok) {
      console.error("Square program error:", programData);
      return new Response(
        JSON.stringify({ error: "loyalty_not_configured", message: "Loyalty program not found." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const program = programData.program;

    // 2. Search for loyalty account by phone number or customer ID
    let loyaltyAccount = null;

    // Try searching by customer ID first
    const searchRes = await fetch(`${SQUARE_BASE}/loyalty/accounts/search`, {
      method: "POST",
      headers: squareHeaders,
      body: JSON.stringify({
        query: {
          customer_ids: [profile.square_customer_id],
        },
      }),
    });
    const searchData = await searchRes.json();

    if (searchData.loyalty_accounts && searchData.loyalty_accounts.length > 0) {
      loyaltyAccount = searchData.loyalty_accounts[0];
    }

    if (!loyaltyAccount) {
      return new Response(
        JSON.stringify({
          error: "no_loyalty_account",
          message: "You don't have a loyalty account yet. Points will appear after your first qualifying purchase.",
          program: {
            reward_tiers: (program.reward_tiers || []).map((t: any) => ({
              id: t.id,
              name: t.name,
              points: t.points,
              discount: t.definition?.discount_type === "FIXED_PERCENTAGE"
                ? `${t.definition?.percentage_discount}%`
                : t.definition?.fixed_discount_money
                  ? `$${(t.definition.fixed_discount_money.amount / 100).toFixed(2)}`
                  : t.name,
            })),
          },
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Fetch loyalty events (history)
    const eventsRes = await fetch(`${SQUARE_BASE}/loyalty/events/search`, {
      method: "POST",
      headers: squareHeaders,
      body: JSON.stringify({
        query: {
          filter: {
            loyalty_account_filter: {
              loyalty_account_id: loyaltyAccount.id,
            },
          },
        },
        limit: 30,
      }),
    });
    const eventsData = await eventsRes.json();

    // Format response
    const rewardTiers = (program.reward_tiers || []).map((t: any) => ({
      id: t.id,
      name: t.name,
      points: t.points,
      discount: t.definition?.discount_type === "FIXED_PERCENTAGE"
        ? `${t.definition?.percentage_discount}%`
        : t.definition?.fixed_discount_money
          ? `$${(t.definition.fixed_discount_money.amount / 100).toFixed(2)}`
          : t.name,
    }));

    const events = (eventsData.events || []).map((e: any) => ({
      id: e.id,
      type: e.type,
      created_at: e.created_at,
      points: e.accumulate_points?.points
        || e.adjust_points?.points
        || e.redeem_reward?.points
        || e.expire_points?.points
        || e.create_reward?.points
        || e.delete_reward?.points
        || 0,
      source: e.source,
    }));

    return new Response(
      JSON.stringify({
        account: {
          id: loyaltyAccount.id,
          balance: loyaltyAccount.balance,
          lifetime_points: loyaltyAccount.lifetime_points,
          enrolled_at: loyaltyAccount.created_at,
        },
        program: {
          id: program.id,
          reward_tiers: rewardTiers.sort((a: any, b: any) => a.points - b.points),
        },
        events,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("loyalty error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

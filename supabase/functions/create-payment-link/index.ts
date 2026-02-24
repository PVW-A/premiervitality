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
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify caller is admin
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

    // Use service role client for DB operations
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Check admin role
    const { data: isAdmin } = await adminClient.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });

    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { request_id } = await req.json();
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

    // Get price — from request row first, then fall back to peptides table
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
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Build Square payment link
    const SQUARE_ACCESS_TOKEN = Deno.env.get("SQUARE_ACCESS_TOKEN")!;
    const SQUARE_LOCATION_ID = Deno.env.get("SQUARE_LOCATION_ID")!;

    const peptideName = requestRow.variation_label
      ? `${requestRow.peptide_name} — ${requestRow.variation_label}`
      : requestRow.peptide_name;

    const payload = {
      idempotency_key: crypto.randomUUID(),
      quick_pay: {
        name: peptideName,
        price_money: {
          amount: Math.round(price * 100),
          currency: "USD",
        },
        location_id: SQUARE_LOCATION_ID,
      },
    };

    const squareBaseUrl = Deno.env.get("SQUARE_ENVIRONMENT") === "production"
      ? "https://connect.squareup.com"
      : "https://connect.squareupsandbox.com";

    const squareRes = await fetch(
      `${squareBaseUrl}/v2/online-checkout/payment-links`,
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
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const paymentUrl =
      squareData.payment_link?.url || squareData.payment_link?.long_url;
    const squareOrderId = squareData.related_resources?.orders?.[0]?.id || squareData.payment_link?.order_id || null;

    // Update the request with payment link and approved status
    const { error: updateError } = await adminClient
      .from("peptide_requests")
      .update({
        status: "approved",
        payment_url: paymentUrl,
        square_order_id: squareOrderId,
      })
      .eq("id", request_id);

    if (updateError) {
      console.error("DB update error:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update request" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        payment_url: paymentUrl,
        square_order_id: squareOrderId,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error("Unexpected error:", e);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(e) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

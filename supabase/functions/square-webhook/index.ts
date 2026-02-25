import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.224.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Verify Square webhook signature
async function verifySignature(
  body: string,
  signatureHeader: string,
  signatureKey: string,
  notificationUrl: string
): Promise<boolean> {
  // Square signs: notificationUrl + body
  const payload = notificationUrl + body;
  const key = new TextEncoder().encode(signatureKey);
  const data = new TextEncoder().encode(payload);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, data);
  const expectedHash = btoa(String.fromCharCode(...new Uint8Array(sig)));

  return expectedHash === signatureHeader;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signatureKey = Deno.env.get("SQUARE_WEBHOOK_SIGNATURE_KEY");
    if (!signatureKey) {
      console.error("Missing SQUARE_WEBHOOK_SIGNATURE_KEY");
      return new Response("Server config error", { status: 500 });
    }

    const body = await req.text();
    const signature = req.headers.get("x-square-hmacsha256-signature") || "";

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const notificationUrl = `${supabaseUrl}/functions/v1/square-webhook`;

    const valid = await verifySignature(body, signature, signatureKey, notificationUrl);
    if (!valid) {
      console.error("Invalid webhook signature");
      return new Response("Invalid signature", { status: 403 });
    }

    const event = JSON.parse(body);
    const eventType = event.type as string;
    console.log("Square webhook event:", eventType);

    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Handle subscription events
    if (eventType.startsWith("subscription.")) {
      const subscription = event.data?.object?.subscription || event.data?.object;
      if (!subscription) {
        console.error("No subscription data in event");
        return new Response("OK", { status: 200 });
      }

      const squareCustomerId = subscription.customer_id;
      const planVariationId = subscription.plan_variation_id;
      const status = subscription.status; // ACTIVE, CANCELED, PAUSED, DEACTIVATED, PENDING

      console.log(`Subscription ${eventType}: customer=${squareCustomerId}, plan=${planVariationId}, status=${status}`);

      // Map Square status to our status
      let membershipStatus: string;
      switch (status) {
        case "ACTIVE":
          membershipStatus = "active";
          break;
        case "CANCELED":
        case "DEACTIVATED":
          membershipStatus = "cancelled";
          break;
        case "PAUSED":
          membershipStatus = "paused";
          break;
        case "PENDING":
          membershipStatus = "pending";
          break;
        default:
          membershipStatus = "inactive";
      }

      // Look up the user by square_customer_id in profiles
      const { data: profile } = await adminClient
        .from("profiles")
        .select("user_id")
        .eq("square_customer_id", squareCustomerId)
        .single();

      if (!profile) {
        console.error(`No profile found for Square customer ${squareCustomerId}`);
        // Still return 200 so Square doesn't retry
        return new Response("OK", { status: 200 });
      }

      const userId = profile.user_id;

      // Look up the tier by square_plan_id (monthly) or square_plan_id_annual
      let { data: tier } = await adminClient
        .from("membership_tiers")
        .select("id")
        .eq("square_plan_id", planVariationId)
        .single();

      if (!tier) {
        // Check annual column
        const { data: annualTier } = await adminClient
          .from("membership_tiers")
          .select("id")
          .eq("square_plan_id_annual", planVariationId)
          .single();
        tier = annualTier;
      }

      if (!tier) {
        console.error(`No tier found for plan variation ${planVariationId}`);
        return new Response("OK", { status: 200 });
      }

      if (eventType === "subscription.created") {
        // Upsert membership
        const { error } = await adminClient.from("memberships").upsert(
          {
            user_id: userId,
            tier_id: tier.id,
            status: membershipStatus,
            started_at: subscription.start_date || new Date().toISOString(),
            billing_cycle: subscription.cadence === "ANNUAL" ? "annual" : "monthly",
          },
          { onConflict: "user_id" }
        );
        if (error) console.error("Upsert membership error:", error);
      } else if (eventType === "subscription.updated") {
        const { error } = await adminClient
          .from("memberships")
          .update({
            tier_id: tier.id,
            status: membershipStatus,
            updated_at: new Date().toISOString(),
            cancelled_at: membershipStatus === "cancelled" ? new Date().toISOString() : null,
          })
          .eq("user_id", userId);
        if (error) console.error("Update membership error:", error);
      }
    }

    return new Response("OK", { status: 200 });
  } catch (e) {
    console.error("Webhook error:", e);
    return new Response("Internal error", { status: 500 });
  }
});

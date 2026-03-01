import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/slack/api";

async function findChannelId(channelName: string): Promise<string> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
  const SLACK_API_KEY = Deno.env.get("SLACK_API_KEY")!;
  const name = channelName.replace(/^#/, "");

  let cursor = "";
  do {
    const url = `${GATEWAY_URL}/conversations.list?types=public_channel&limit=200${cursor ? `&cursor=${cursor}` : ""}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": SLACK_API_KEY,
      },
    });
    const data = await res.json();
    if (!data.ok) throw new Error(`conversations.list failed: ${JSON.stringify(data)}`);
    const match = data.channels?.find((c: any) => c.name === name);
    if (match) return match.id;
    cursor = data.response_metadata?.next_cursor || "";
  } while (cursor);

  throw new Error(`Channel "${channelName}" not found`);
}

async function slackPost(channel: string, text: string, blocks?: unknown[]) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

  const SLACK_API_KEY = Deno.env.get("SLACK_API_KEY");
  if (!SLACK_API_KEY) throw new Error("SLACK_API_KEY is not configured");

  const channelId = await findChannelId(channel);

  // Auto-join channel if needed
  await fetch(`${GATEWAY_URL}/conversations.join`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": SLACK_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ channel: channelId }),
  });

  const body: Record<string, unknown> = { channel: channelId, text };
  if (blocks) body.blocks = blocks;

  const res = await fetch(`${GATEWAY_URL}/chat.postMessage`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": SLACK_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok || !data.ok) {
    throw new Error(`Slack chat.postMessage failed [${res.status}]: ${JSON.stringify(data)}`);
  }
  return data;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, payload } = await req.json();

    // ─── TYPE 1: Purchase notification ───
    if (type === "purchase") {
      const {
        patient_name,
        peptide_name,
        total_cents,
        cost_cents,
        include_kit,
        delivery_method,
        request_id,
      } = payload;

      const revenue = (total_cents / 100).toFixed(2);
      const cost = ((cost_cents || 0) / 100).toFixed(2);
      const profit = ((total_cents - (cost_cents || 0)) / 100).toFixed(2);

      const lines = [
        `💰 *New Peptide Order*`,
        `*Patient:* ${patient_name}`,
        `*Item:* ${peptide_name}`,
        include_kit ? `• Injection Kit included` : null,
        `*Delivery:* ${delivery_method === "shipping" ? "Overnight Shipping" : delivery_method === "courier" ? "Courier Delivery" : "Local Pickup"}`,
        `*Revenue:* $${revenue}  |  *Cost:* $${cost}  |  *Profit:* $${profit}`,
        `_Request ID: ${request_id}_`,
      ].filter(Boolean).join("\n");

      await slackPost("#orders", lines);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── TYPE 2: New signup notification ───
    if (type === "signup") {
      const { email, first_name, last_name } = payload;
      const name = `${first_name || ""} ${last_name || ""}`.trim() || "Unknown";
      const lines = [
        `🆕 *New Patient Signup*`,
        `*Name:* ${name}`,
        `*Email:* ${email}`,
        `_${new Date().toLocaleString("en-US", { timeZone: "America/Denver" })}_`,
      ].join("\n");

      await slackPost("#orders", lines);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── TYPE 3: New subscription notification ───
    if (type === "subscription") {
      const { patient_name, tier_name, billing_cycle } = payload;
      const lines = [
        `🎉 *New Subscription*`,
        `*Patient:* ${patient_name}`,
        `*Plan:* ${tier_name} (${billing_cycle})`,
        `_${new Date().toLocaleString("en-US", { timeZone: "America/Denver" })}_`,
      ].join("\n");

      await slackPost("#orders", lines);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── TYPE 4: Subscription upgrade notification ───
    if (type === "upgrade") {
      const { patient_name, old_tier, new_tier } = payload;
      const lines = [
        `⬆️ *Subscription Upgrade*`,
        `*Patient:* ${patient_name}`,
        `*From:* ${old_tier} → *To:* ${new_tier}`,
        `_${new Date().toLocaleString("en-US", { timeZone: "America/Denver" })}_`,
      ].join("\n");

      await slackPost("#orders", lines);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── TYPE 5: Auto-reorder notification ───
    if (type === "auto_reorder") {
      const { patient_name, peptide_name, total_cents, delivery_method } = payload;
      const total = (total_cents / 100).toFixed(2);
      const lines = [
        `🔄 *Monthly Auto-Order Charged*`,
        `*Patient:* ${patient_name}`,
        `*Item:* ${peptide_name}`,
        `*Total:* $${total}`,
        `*Delivery:* ${delivery_method === "shipping" ? "Overnight Shipping" : "Local Pickup"}`,
        `_${new Date().toLocaleString("en-US", { timeZone: "America/Denver" })}_`,
      ].join("\n");

      await slackPost("#orders", lines);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── TYPE 6: Weekly Monday order summary ───
    if (type === "weekly_summary") {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const admin = createClient(supabaseUrl, serviceRoleKey);

      // Get all paid requests from last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: requests, error } = await admin
        .from("peptide_requests")
        .select("*")
        .eq("status", "paid")
        .gte("updated_at", sevenDaysAgo.toISOString())
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Error fetching weekly requests:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Fetch profiles for all user_ids
      const userIds = [...new Set((requests || []).map((r: any) => r.user_id))];
      const { data: profiles } = userIds.length > 0
        ? await admin.from("profiles").select("user_id, first_name, last_name").in("user_id", userIds)
        : { data: [] };
      const profileMap: Record<string, { first_name: string; last_name: string }> = {};
      (profiles || []).forEach((p: any) => { profileMap[p.user_id] = p; });

      if (!requests || requests.length === 0) {
        await slackPost("#orders", "📋 *Monday Order Summary*\n\nNo new paid orders this week.");
        return new Response(JSON.stringify({ success: true, count: 0 }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Group by patient
      const grouped: Record<string, { name: string; items: string[] }> = {};
      for (const r of requests) {
        const profile = profileMap[r.user_id];
        const name = `${profile?.first_name || "Unknown"} ${profile?.last_name || ""}`.trim();
        if (!grouped[r.user_id]) {
          grouped[r.user_id] = { name, items: [] };
        }
        let item = r.variation_label
          ? `${r.peptide_name} — ${r.variation_label}`
          : r.peptide_name;
        if (r.include_injection_kit) item += " + Injection Kit";
        item += ` (${r.delivery_method === "shipping" ? "Ship" : "Pickup"})`;
        grouped[r.user_id].items.push(item);
      }

      const lines = [
        `📋 *Monday Order Summary — Week of ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}*`,
        `*${requests.length} order(s) to fulfill:*`,
        "",
      ];

      for (const entry of Object.values(grouped)) {
        lines.push(`*${entry.name}*`);
        entry.items.forEach((item) => lines.push(`  • ${item}`));
        lines.push("");
      }

      lines.push("_Place supplier orders today!_");

      await slackPost("#orders", lines.join("\n"));

      return new Response(JSON.stringify({ success: true, count: requests.length }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown type" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("slack-notify error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

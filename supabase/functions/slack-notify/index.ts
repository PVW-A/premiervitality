import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/slack/api";

async function slackPost(channel: string, text: string, blocks?: unknown[]) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

  const SLACK_API_KEY = Deno.env.get("SLACK_API_KEY");
  if (!SLACK_API_KEY) throw new Error("SLACK_API_KEY is not configured");

  const body: Record<string, unknown> = { channel, text };
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
  if (!res.ok) {
    throw new Error(`Slack API call failed [${res.status}]: ${JSON.stringify(data)}`);
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
        `*Delivery:* ${delivery_method === "shipping" ? "Overnight Shipping" : "Local Pickup"}`,
        `*Revenue:* $${revenue}  |  *Cost:* $${cost}  |  *Profit:* $${profit}`,
        `_Request ID: ${request_id}_`,
      ].filter(Boolean).join("\n");

      await slackPost("#orders", lines);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ─── TYPE 2: Weekly Monday order summary ───
    if (type === "weekly_summary") {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const admin = createClient(supabaseUrl, serviceRoleKey);

      // Get all paid requests from last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: requests, error } = await admin
        .from("peptide_requests")
        .select("*, profiles!inner(first_name, last_name)")
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

      if (!requests || requests.length === 0) {
        await slackPost("#orders", "📋 *Monday Order Summary*\n\nNo new paid orders this week.");
        return new Response(JSON.stringify({ success: true, count: 0 }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Group by patient
      const grouped: Record<string, { name: string; items: string[] }> = {};
      for (const r of requests) {
        const profile = (r as any).profiles;
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

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all unique base peptides
    const { data: peptides } = await supabase.from("peptides").select("id, name, category, description, benefits, candidates");
    if (!peptides || peptides.length === 0) throw new Error("No peptides found");

    // Group by base name
    const groups = new Map<string, { ids: string[]; category: string | null; name: string }>();
    for (const p of peptides) {
      const base = p.name.includes(" — ") ? p.name.split(" — ")[0] : p.name;
      if (!groups.has(base)) {
        groups.set(base, { ids: [], category: p.category, name: base });
      }
      groups.get(base)!.ids.push(p.id);
    }

    const baseNames = Array.from(groups.values());
    const results: { name: string; status: string }[] = [];

    // Process in batches of 10
    for (let i = 0; i < baseNames.length; i += 10) {
      const batch = baseNames.slice(i, i + 10);
      const peptideList = batch.map(b => `- ${b.name} (Category: ${b.category || "Unknown"})`).join("\n");

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          tools: [{
            type: "function",
            function: {
              name: "update_peptides",
              description: "Update peptide descriptions, benefits, and ideal candidates",
              parameters: {
                type: "object",
                properties: {
                  peptides: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "Exact base peptide name" },
                        description: { type: "string", description: "1-2 sentence clinical description of what this compound does, its mechanism of action. Written in an elevated, medical-luxury tone." },
                        benefits: { type: "string", description: "Comma-separated list of 3-5 key clinical benefits. Use refined medical language." },
                        candidates: { type: "string", description: "Comma-separated list of 2-4 ideal patient profiles. Written elegantly." },
                      },
                      required: ["name", "description", "benefits", "candidates"],
                    },
                  },
                },
                required: ["peptides"],
              },
            },
          }],
          tool_choice: { type: "function", function: { name: "update_peptides" } },
          messages: [
            {
              role: "system",
              content: `You are a medical copywriter for an ultra-premium peptide therapy clinic. Write in a refined, elevated tone—think concierge medicine meets luxury wellness. Be clinically accurate but accessible. Never use casual language. Every description should feel exclusive and authoritative.

For descriptions: Write 1-2 elegant sentences about the compound's mechanism and therapeutic purpose.
For benefits: List 3-5 specific clinical benefits, comma-separated. Use precise medical terminology.
For candidates: List 2-4 ideal patient profiles, comma-separated. Frame them aspirationally (e.g., "Executives seeking sustained cognitive clarity" not "People with brain fog").`,
            },
            {
              role: "user",
              content: `Generate clinical descriptions, benefits, and ideal candidate profiles for these peptides:\n\n${peptideList}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        console.error("AI error:", response.status, await response.text());
        results.push(...batch.map(b => ({ name: b.name, status: "ai_error" })));
        continue;
      }

      const data = await response.json();
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall) {
        results.push(...batch.map(b => ({ name: b.name, status: "no_tool_call" })));
        continue;
      }

      const parsed = JSON.parse(toolCall.function.arguments);
      
      for (const item of parsed.peptides) {
        const group = groups.get(item.name);
        if (!group) {
          results.push({ name: item.name, status: "not_found" });
          continue;
        }

        const { error } = await supabase
          .from("peptides")
          .update({
            description: item.description,
            benefits: item.benefits,
            candidates: item.candidates,
          })
          .in("id", group.ids);

        results.push({ name: item.name, status: error ? `error: ${error.message}` : "updated" });
      }
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

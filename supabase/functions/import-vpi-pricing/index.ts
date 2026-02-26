import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const apiKey = Deno.env.get("LOVABLE_API_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { rawText, batchIndex = 0 } = await req.json();

    // Get all existing peptides
    const { data: existing } = await supabase
      .from("peptides")
      .select("id, name, price, cost, category, administration, unit");

    const existingList = existing || [];

    const prompt = `You are a pharmacy data matching expert. 

EXISTING PEPTIDES DATABASE (${existingList.length} items):
${JSON.stringify(existingList.map(p => ({ id: p.id, name: p.name, price: p.price, cost: p.cost })), null, 1)}

VPI COMPOUNDING PHARMACY PRICING SHEET (raw text, prices are our COST):
${rawText}

TASK:
1. Parse ALL products from the VPI pricing sheet with their clinic pricing (this is our COST, what we pay the pharmacy)
2. Match VPI products to existing peptides. Name formats differ:
   - DB: "Semaglutide + B12 — 1000 mcg/mL · 2 mL"
   - VPI: "Cyanocobalamin (Vit B12) (1000mcg) + Semaglutide (1000mcg) per mL -- SQ Injectable [2mL]"
3. For matches: add to "updates" with {id, cost}
4. For new products: add to "inserts" with {name, cost, category, administration, unit}

SKIP: syringes, needles, alcohol pads, sharps containers, shipping items, bacteriostatic water/saline

For inserts, use these formats:
- name: "ProductName — Dose · Size" (e.g. "Ketamine — 50 mg/mL · 7.5 mL")
- category: Recovery & Healing | Anti-Aging & Performance | Weight Management | Cognitive & Mood | Immune Support | Sexual Well-Being | Skin & Hair | Hormone Restoration | Dermatology | Hair Restore | IV/IM Therapy | Other
- administration: Subcutaneous Injectable | Nasal Spray | Oral Capsule | Topical Cream | Troche | IV Injectable | Lyophilized Powder | Topical Solution | Topical Foam | Topical Ointment | Oral Suspension | Ophthalmic Solution | Vaginal Suppository | Tablet
- unit: mL | capsules | ea
- cost: number (no $)

Output ONLY valid JSON: {"updates": [...], "inserts": [...]}
Be thorough - process EVERY product from the pricing sheet.`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.05,
        max_tokens: 130000,
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      throw new Error(`AI call failed [${aiRes.status}]: ${errText}`);
    }

    const aiData = await aiRes.json();
    let content = aiData.choices?.[0]?.message?.content || "";
    
    // Extract JSON from possible markdown code blocks
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) content = jsonMatch[1];
    content = content.trim();
    
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse AI response:", content.substring(0, 500));
      throw new Error("AI returned invalid JSON");
    }
    
    const { updates = [], inserts = [] } = parsed;

    // Apply updates
    let updatedCount = 0;
    const updateErrors: string[] = [];
    for (const u of updates) {
      if (u.id && u.cost != null) {
        const { error } = await supabase
          .from("peptides")
          .update({ cost: u.cost })
          .eq("id", u.id);
        if (!error) updatedCount++;
        else updateErrors.push(`${u.id}: ${error.message}`);
      }
    }

    // Apply inserts
    let insertedCount = 0;
    const insertErrors: string[] = [];
    if (inserts.length > 0) {
      for (let i = 0; i < inserts.length; i += 50) {
        const batch = inserts.slice(i, i + 50).map((p: any) => ({
          name: p.name,
          cost: p.cost,
          category: p.category || "Other",
          administration: p.administration || null,
          unit: p.unit || "ea",
          price: null,
        }));
        const { data, error } = await supabase.from("peptides").insert(batch).select("id");
        if (!error && data) insertedCount += data.length;
        else insertErrors.push(error?.message || "unknown");
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        updated: updatedCount,
        inserted: insertedCount,
        totalUpdatesRequested: updates.length,
        totalInsertsRequested: inserts.length,
        updateErrors: updateErrors.slice(0, 5),
        insertErrors: insertErrors.slice(0, 5),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

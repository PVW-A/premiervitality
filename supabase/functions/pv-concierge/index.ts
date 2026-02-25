import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are PV Concierge, the private patient assistant for Premier Vitality — a physician-led peptide therapy practice founded by Dr. James Loo.

## Your Role
You are a knowledgeable, warm, and professional guide who helps visitors and patients understand peptide therapies, explore the Premier Vitality catalog, and connect with the clinical team when appropriate.

## Voice & Tone
- Speak like a knowledgeable concierge at a private medical practice, not a chatbot
- Confident but never condescending
- Use clear, accessible language — avoid excessive medical jargon unless the patient uses it first
- Keep responses concise (2-4 sentences for simple questions, more for educational topics)
- Use markdown formatting sparingly: bold for peptide names, bullet lists for benefits

## What You CAN Do
- Explain what peptides are and how they work generally
- Describe specific peptides from the Premier Vitality catalog (benefits, ideal candidates, administration routes)
- Compare peptides within the same category (e.g., "BPC-157 nasal vs injectable")
- Explain administration routes (subcutaneous injection, nasal spray, oral capsules, topical cream)
- Discuss general categories: Weight Management, Anti-Aging, Recovery, Cognitive, Sexual Health, Immune Support, Hair/Skin
- Guide patients toward booking a consultation

## What You MUST NOT Do
- NEVER provide dosing recommendations — always say "Dosing is personalized based on your labs and health profile"
- NEVER diagnose or suggest a peptide will treat/cure a specific condition
- NEVER discuss specific pricing — say "Pricing varies by formulation. Our team can walk you through options during a consultation"
- NEVER provide medical advice about drug interactions, contraindications, or side effects
- NEVER discuss adverse effects — immediately redirect to the clinical team
- NEVER provide reconstitution instructions, mixing ratios, dilution guidance, or any preparation instructions for peptides. If asked, say: "For safety and compliance, all peptide preparation is handled by our licensed pharmacy partners. Our clinical team can walk you through everything during your consultation."
- NEVER provide information that could enable self-administration without clinical supervision

## CRITICAL: Emergency Safety Protocol
If a user describes or mentions ANY of the following, IMMEDIATELY respond with emergency guidance BEFORE anything else:
- Severe allergic reaction, anaphylaxis, difficulty breathing, throat swelling
- Chest pain, heart palpitations, irregular heartbeat
- Seizures, loss of consciousness, fainting
- Severe swelling, hives covering large areas of the body
- Any life-threatening or extreme adverse reaction to a peptide or any substance

Your response MUST be: "**If you are experiencing a medical emergency, please call 911 immediately or go to your nearest emergency room.** Your safety is our highest priority. Once you are safe, please contact our clinical team so we can review your case and adjust your care plan."

Do NOT provide any other guidance, peptide information, or attempt to troubleshoot the reaction. Emergency referral comes first, always.

## Escalation Triggers
When any of these occur, include a clear CTA to book a consultation:
1. Dosing questions → "Dosing is personalized to your labs and health profile. I'd recommend scheduling a consultation with our clinical team."
2. Safety or side effect concerns → "That's an important question best addressed by our clinical team directly. Would you like to schedule a consultation?"
3. Pricing or ordering → "I'd love to help you explore our membership options. Would you like to schedule a quick call with our team?"
4. The patient explicitly asks to talk to someone → "Absolutely. You can book a consultation at https://calendly.com/premiervitality or text us at (phone number)."
5. After 3+ exchanges on the same specific peptide → Gently suggest booking a consultation for personalized guidance
6. Reconstitution or preparation questions → "For safety and compliance, all peptide preparation is handled by our licensed pharmacy partners. Our clinical team can walk you through everything during your consultation."

## Consultation CTA
When escalating, use: "You can schedule a free consultation at https://calendly.com/premiervitality or reach our team directly."

## Important Context
- Premier Vitality requires labs before prescribing any peptide therapy
- All peptides are compounded by licensed 503B pharmacies
- This is a membership-based practice with three tiers (Essential, Premium, Elite)
- Dr. James Loo is the founding physician

## Peptide Catalog Data
The following peptides are available through Premier Vitality. Use this data to answer questions accurately:

`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Fetch peptide catalog for grounding
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: peptides } = await supabase
      .from("peptides")
      .select("name, category, description, benefits, candidates, administration, unit")
      .order("name");

    // Build peptide context string
    let peptideContext = "";
    if (peptides && peptides.length > 0) {
      // Group by base name to reduce token usage
      const grouped = new Map<string, typeof peptides>();
      for (const p of peptides) {
        const baseName = p.name.split(" — ")[0].trim();
        if (!grouped.has(baseName)) grouped.set(baseName, []);
        grouped.get(baseName)!.push(p);
      }

      for (const [baseName, variants] of grouped) {
        const first = variants[0];
        peptideContext += `\n### ${baseName}\n`;
        if (first.category) peptideContext += `Category: ${first.category}\n`;
        if (first.description) peptideContext += `Description: ${first.description}\n`;
        if (first.benefits) peptideContext += `Benefits: ${first.benefits}\n`;
        if (first.candidates) peptideContext += `Ideal candidates: ${first.candidates}\n`;
        if (variants.length > 1) {
          peptideContext += `Available formulations: ${variants.map(v => {
            const label = v.name.includes(" — ") ? v.name.split(" — ")[1] : v.name;
            return `${label} (${v.administration || "various"})`;
          }).join(", ")}\n`;
        } else if (first.administration) {
          peptideContext += `Administration: ${first.administration}\n`;
        }
      }
    }

    const fullSystemPrompt = SYSTEM_PROMPT + peptideContext;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: fullSystemPrompt },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Our concierge is experiencing high demand. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("pv-concierge error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

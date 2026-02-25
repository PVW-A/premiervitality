import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const KNOWN_MARKERS: Record<string, { category: string; unit: string; low: number; high: number }> = {
  "Testosterone (Total)": { category: "Hormones", unit: "ng/dL", low: 300, high: 1000 },
  "Free Testosterone": { category: "Hormones", unit: "ng/dL", low: 9, high: 30 },
  "Estradiol (E2)": { category: "Hormones", unit: "pg/mL", low: 20, high: 50 },
  "IGF-1": { category: "Hormones", unit: "ng/mL", low: 100, high: 300 },
  "DHEA-S": { category: "Hormones", unit: "µg/dL", low: 100, high: 400 },
  "Fasting Glucose": { category: "Metabolic Panel", unit: "mg/dL", low: 70, high: 99 },
  "HbA1c": { category: "Metabolic Panel", unit: "%", low: 4.0, high: 5.7 },
  "Insulin (Fasting)": { category: "Metabolic Panel", unit: "µIU/mL", low: 2, high: 25 },
  "TSH": { category: "Thyroid", unit: "mIU/L", low: 0.4, high: 4.0 },
  "Free T3": { category: "Thyroid", unit: "pg/mL", low: 2.3, high: 4.2 },
  "Free T4": { category: "Thyroid", unit: "ng/dL", low: 0.8, high: 1.8 },
  "hs-CRP": { category: "Inflammation", unit: "mg/L", low: 0, high: 1.0 },
  "Homocysteine": { category: "Inflammation", unit: "µmol/L", low: 5, high: 15 },
  "ESR": { category: "Inflammation", unit: "mm/hr", low: 0, high: 20 },
  "ALT": { category: "Liver & Kidney", unit: "U/L", low: 7, high: 56 },
  "AST": { category: "Liver & Kidney", unit: "U/L", low: 10, high: 40 },
  "Creatinine": { category: "Liver & Kidney", unit: "mg/dL", low: 0.7, high: 1.3 },
  "BUN": { category: "Liver & Kidney", unit: "mg/dL", low: 7, high: 20 },
  "Vitamin D (25-OH)": { category: "Cognitive & Neuro", unit: "ng/mL", low: 40, high: 80 },
  "Vitamin B12": { category: "Cognitive & Neuro", unit: "pg/mL", low: 200, high: 900 },
  "Folate": { category: "Cognitive & Neuro", unit: "ng/mL", low: 2.7, high: 17 },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { upload_id } = await req.json();
    if (!upload_id) throw new Error("upload_id required");

    // Get the upload record
    const { data: upload, error: uploadErr } = await supabase
      .from("bloodwork_uploads")
      .select("*")
      .eq("id", upload_id)
      .single();

    if (uploadErr || !upload) throw new Error("Upload not found");

    // Download the file from storage
    const { data: fileData, error: fileErr } = await supabase.storage
      .from("bloodwork")
      .download(upload.file_path);

    if (fileErr || !fileData) throw new Error("Could not download file");

    // Convert to base64 (chunk to avoid stack overflow on large files)
    const arrayBuffer = await fileData.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = "";
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    const base64 = btoa(binary);

    // Determine MIME type
    const ext = upload.file_name.split(".").pop()?.toLowerCase();
    const mimeMap: Record<string, string> = {
      pdf: "application/pdf",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
    };
    const mimeType = mimeMap[ext || ""] || "application/octet-stream";

    // Build the marker list for the prompt
    const markerNames = Object.keys(KNOWN_MARKERS).join(", ");

    // Call Gemini vision to extract biomarkers
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        tools: [{
          type: "function",
          function: {
            name: "extract_biomarkers",
            description: "Extract biomarker lab values from a bloodwork document",
            parameters: {
              type: "object",
              properties: {
                lab_date: { type: "string", description: "Date of the lab work in YYYY-MM-DD format. If multiple dates, use the most recent." },
                markers: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string", description: "The EXACT marker name from the known list provided." },
                      value: { type: "number", description: "The numeric lab value." },
                    },
                    required: ["name", "value"],
                  },
                },
              },
              required: ["lab_date", "markers"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "extract_biomarkers" } },
        messages: [
          {
            role: "system",
            content: `You are a medical lab result parser. Extract biomarker values from the uploaded bloodwork document. Only extract markers that match these EXACT names: ${markerNames}. Map common lab names to our standard names (e.g. "Total Testosterone" → "Testosterone (Total)", "Glucose" → "Fasting Glucose", "Hemoglobin A1c" → "HbA1c", "C-Reactive Protein" → "hs-CRP", "Vit D" → "Vitamin D (25-OH)", "T3 Free" → "Free T3", "T4 Free" → "Free T4"). Only include markers you can confidently identify with a numeric value. For the lab date, look for "Date Collected", "Specimen Date", or similar.`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Extract all biomarker values from this bloodwork document. Return only markers you can confidently identify.",
              },
              {
                type: "image_url",
                image_url: { url: `data:${mimeType};base64,${base64}` },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI error:", response.status, errText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      throw new Error(`AI error ${response.status}`);
    }

    const aiData = await response.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("AI did not return structured data");

    const parsed = JSON.parse(toolCall.function.arguments);
    const labDate = parsed.lab_date || new Date().toISOString().split("T")[0];
    const extracted = parsed.markers || [];

    // Insert biomarker results
    const insertRows = [];
    for (const item of extracted) {
      const config = KNOWN_MARKERS[item.name];
      if (!config) continue;

      const status =
        item.value < config.low ? "below" :
        item.value > config.high ? "above" : "in_range";

      insertRows.push({
        user_id: upload.user_id,
        marker_name: item.name,
        category: config.category,
        value: item.value,
        unit: config.unit,
        reference_low: config.low,
        reference_high: config.high,
        status,
        lab_date: labDate,
      });
    }

    if (insertRows.length > 0) {
      const { error: insertErr } = await supabase
        .from("biomarker_results")
        .insert(insertRows);

      if (insertErr) {
        console.error("Insert error:", insertErr);
        throw new Error("Failed to save biomarker results");
      }
    }

    // Update upload status
    await supabase
      .from("bloodwork_uploads")
      .update({
        status: "reviewed",
        admin_notes: `AI extracted ${insertRows.length} biomarker(s) from your lab results.`,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", upload_id);

    return new Response(JSON.stringify({
      success: true,
      markers_found: insertRows.length,
      lab_date: labDate,
      markers: insertRows.map(r => ({ name: r.marker_name, value: r.value, status: r.status })),
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("parse-bloodwork error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

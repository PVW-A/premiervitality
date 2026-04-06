import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
    if (!ANTHROPIC_API_KEY)
      throw new Error("ANTHROPIC_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { report_id } = await req.json();
    if (!report_id) throw new Error("report_id required");

    // Get the report record
    const { data: report, error: reportErr } = await supabase
      .from("health_reports")
      .select("*")
      .eq("id", report_id)
      .single();

    if (reportErr || !report) throw new Error("Report not found");

    // Download the file from storage
    const { data: fileData, error: fileErr } = await supabase.storage
      .from("bloodwork")
      .download(report.file_path);

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
    const ext = report.file_name?.split(".").pop()?.toLowerCase() || "";
    const mimeMap: Record<string, string> = {
      pdf: "application/pdf",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
    };
    const mimeType = mimeMap[ext] || "application/octet-stream";

    // Build content array — use document type for PDFs, image_url for images
    const fileContent =
      mimeType === "application/pdf"
        ? {
            type: "document" as const,
            source: {
              type: "base64" as const,
              media_type: "application/pdf" as const,
              data: base64,
            },
          }
        : {
            type: "image" as const,
            source: {
              type: "base64" as const,
              media_type: mimeType as "image/jpeg" | "image/png" | "image/webp",
              data: base64,
            },
          };

    // Call Anthropic API
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: `You are a clinical lab result analyzer for Premier Vitality & Wellness, a physician-directed peptide therapy clinic.

Analyze the uploaded bloodwork document and extract ALL biomarker values you can identify. Then compute:
1. A Vitality Score (0-100) based on how many markers are in optimal range vs borderline vs out-of-range
2. An estimated biological age based on the biomarker profile (use the overall health indicators to estimate)

For each biomarker, determine its status:
- "optimal": within the ideal functional medicine range
- "borderline": within standard reference range but not optimal
- "low": below reference range
- "high": above reference range

Return ONLY valid JSON with this exact structure, no markdown, no code fences:
{
  "vitality_score": <number 0-100>,
  "biological_age": <number>,
  "biomarkers": [
    {
      "name": "<marker name>",
      "value": <numeric value>,
      "unit": "<unit>",
      "reference_range": "<low - high>",
      "status": "optimal" | "borderline" | "low" | "high"
    }
  ],
  "summary": "<2-3 sentence plain language summary of overall health picture>"
}

Important:
- Extract EVERY biomarker you can identify from the document
- Map common lab names to standard names (e.g. "Hemoglobin A1c" → "HbA1c", "Total Cholesterol" → "Total Cholesterol")
- Use functional/optimal ranges, not just standard lab ranges
- Be conservative with the vitality score — 80+ should require most markers in optimal range
- For biological age, consider inflammatory markers, metabolic health, hormone levels, and organ function
- If you cannot parse the document or find no markers, return: {"vitality_score": null, "biological_age": null, "biomarkers": [], "summary": "Unable to extract biomarker data from this document. Please upload a clearer image or PDF of your lab results."}`,
        messages: [
          {
            role: "user",
            content: [
              fileContent,
              {
                type: "text",
                text: "Analyze this bloodwork lab report. Extract all biomarkers and return the JSON analysis.",
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", response.status, errText);

      if (response.status === 429) {
        await supabase
          .from("health_reports")
          .update({ status: "error" })
          .eq("id", report_id);
        return new Response(
          JSON.stringify({ error: "Rate limited, please try again shortly." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      throw new Error(`Anthropic API error ${response.status}`);
    }

    const aiData = await response.json();
    const textBlock = aiData.content?.find(
      (b: { type: string }) => b.type === "text"
    );
    if (!textBlock?.text) throw new Error("No text response from AI");

    // Parse JSON — strip markdown fences if present
    let jsonText = textBlock.text.trim();
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(jsonText);

    // Update the health report with results
    const { error: updateErr } = await supabase
      .from("health_reports")
      .update({
        status: parsed.vitality_score !== null ? "completed" : "error",
        raw_analysis: parsed,
        vitality_score: parsed.vitality_score,
        biological_age: parsed.biological_age,
        summary: parsed.summary,
        biomarkers: parsed.biomarkers || [],
      })
      .eq("id", report_id);

    if (updateErr) {
      console.error("Update error:", updateErr);
      throw new Error("Failed to save analysis results");
    }

    return new Response(
      JSON.stringify({
        success: true,
        vitality_score: parsed.vitality_score,
        biological_age: parsed.biological_age,
        biomarkers_found: parsed.biomarkers?.length || 0,
        summary: parsed.summary,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error("analyze-bloodwork error:", e);

    // Try to mark report as error
    try {
      const { report_id } = await req.clone().json().catch(() => ({}));
      if (report_id) {
        const supabase = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );
        await supabase
          .from("health_reports")
          .update({ status: "error" })
          .eq("id", report_id);
      }
    } catch {
      // ignore cleanup errors
    }

    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

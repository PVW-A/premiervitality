import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PDFDocument, rgb, StandardFonts } from "https://cdn.skypack.dev/pdf-lib@1.17.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// --- Helper: wrap long text into lines that fit within maxWidth ---
function wrapText(
  text: string,
  font: any,
  fontSize: number,
  maxWidth: number
): string[] {
  if (!text) return [""];
  const paragraphs = text.split("\n");
  const lines: string[] = [];
  for (const paragraph of paragraphs) {
    const words = paragraph.split(" ");
    let currentLine = "";
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const width = font.widthOfTextAtSize(testLine, fontSize);
      if (width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);
  }
  return lines;
}

// --- Helper: draw a section heading ---
function drawSectionHeading(
  page: any,
  text: string,
  y: number,
  boldFont: any,
  fontSize: number
) {
  page.drawText(text, { x: 50, y, font: boldFont, size: fontSize, color: rgb(0, 0, 0) });
  page.drawLine({
    start: { x: 50, y: y - 4 },
    end: { x: 545, y: y - 4 },
    thickness: 0.5,
    color: rgb(0.7, 0.7, 0.7),
  });
}

// --- Helper: draw a label + value row, returns new Y position ---
function drawField(
  page: any,
  label: string,
  value: string | null | undefined,
  y: number,
  boldFont: any,
  regularFont: any,
  fontSize: number,
  maxWidth: number
): number {
  const safeValue = value ?? "N/A";
  page.drawText(`${label}:`, { x: 50, y, font: boldFont, size: fontSize, color: rgb(0, 0, 0) });
  const labelWidth = boldFont.widthOfTextAtSize(`${label}: `, fontSize);
  const valueX = 50 + labelWidth + 4;
  const availableWidth = maxWidth - labelWidth - 4;
  const lines = wrapText(safeValue, regularFont, fontSize, availableWidth > 100 ? availableWidth : maxWidth - 20);
  for (let i = 0; i < lines.length; i++) {
    page.drawText(lines[i], {
      x: i === 0 ? valueX : 60,
      y: y - i * (fontSize + 4),
      font: regularFont,
      size: fontSize,
      color: rgb(0, 0, 0),
    });
  }
  return y - lines.length * (fontSize + 4) - 6;
}

// --- Helper: ensure we have enough space on the page, add new page if not ---
function ensureSpace(
  pdfDoc: any,
  currentPage: any,
  y: number,
  needed: number,
  regularFont: any,
  boldFont: any
): { page: any; y: number } {
  if (y - needed < 60) {
    const newPage = pdfDoc.addPage([595.28, 841.89]);
    return { page: newPage, y: 790 };
  }
  return { page: currentPage, y };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { intakeId } = await req.json();

    if (!intakeId) {
      return new Response(
        JSON.stringify({ error: "intakeId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // --- 1. Fetch intake record ---
    const { data: record, error: fetchError } = await supabase
      .from("patient_intake")
      .select("*")
      .eq("id", intakeId)
      .single();

    if (fetchError || !record) {
      console.error("Failed to fetch intake record:", fetchError);
      return new Response(
        JSON.stringify({ error: "Intake record not found", details: fetchError?.message }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --- 2. Generate PDF ---
    let pdfBytes: Uint8Array | null = null;
    let pdfUrl: string | null = null;
    const fileName = `${(record.last_name || "unknown").toLowerCase()}_${(record.first_name || "unknown").toLowerCase()}_${record.submission_date || new Date().toISOString().split("T")[0]}.pdf`;

    try {
      const pdfDoc = await PDFDocument.create();
      const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pageWidth = 595.28;
      const pageHeight = 841.89;
      const goldColor = rgb(0.67, 0.56, 0.37);
      const maxContentWidth = 495;
      const bodySize = 10;
      const headingSize = 13;
      const subheadingSize = 11;

      // ------------------------------------------
      // PAGE 1 - Header + Personal Info
      // ------------------------------------------
      const page1 = pdfDoc.addPage([pageWidth, pageHeight]);
      let y = pageHeight - 50;

      // Header
      const headerText = "PREMIER VITALITY AND WELLNESS LLC";
      const headerWidth = helveticaBold.widthOfTextAtSize(headerText, 18);
      page1.drawText(headerText, {
        x: (pageWidth - headerWidth) / 2,
        y,
        font: helveticaBold,
        size: 18,
        color: goldColor,
      });
      y -= 24;

      const subtitleText = "Patient Intake Form";
      const subtitleWidth = helvetica.widthOfTextAtSize(subtitleText, 14);
      page1.drawText(subtitleText, {
        x: (pageWidth - subtitleWidth) / 2,
        y,
        font: helvetica,
        size: 14,
        color: rgb(0.3, 0.3, 0.3),
      });
      y -= 20;

      // Horizontal line
      page1.drawLine({
        start: { x: 50, y },
        end: { x: 545, y },
        thickness: 1,
        color: goldColor,
      });
      y -= 30;

      // Personal Information
      drawSectionHeading(page1, "Personal Information", y, helveticaBold, headingSize);
      y -= 24;

      y = drawField(page1, "Name", `${record.first_name || ""} ${record.last_name || ""}`.trim(), y, helveticaBold, helvetica, bodySize, maxContentWidth);
      y = drawField(page1, "Date of Birth", record.date_of_birth, y, helveticaBold, helvetica, bodySize, maxContentWidth);
      y = drawField(page1, "Sex", record.sex, y, helveticaBold, helvetica, bodySize, maxContentWidth);
      y = drawField(page1, "Phone", record.phone, y, helveticaBold, helvetica, bodySize, maxContentWidth);
      y = drawField(page1, "Email", record.email, y, helveticaBold, helvetica, bodySize, maxContentWidth);

      const addressParts = [record.address, record.city, record.state, record.zip].filter(Boolean);
      const fullAddress = addressParts.length > 0 ? addressParts.join(", ") : null;
      y = drawField(page1, "Address", fullAddress, y, helveticaBold, helvetica, bodySize, maxContentWidth);

      y -= 16;
      drawSectionHeading(page1, "Emergency Contact", y, helveticaBold, headingSize);
      y -= 24;

      y = drawField(page1, "Name", record.emergency_contact_name, y, helveticaBold, helvetica, bodySize, maxContentWidth);
      y = drawField(page1, "Relationship", record.emergency_contact_relationship, y, helveticaBold, helvetica, bodySize, maxContentWidth);
      y = drawField(page1, "Phone", record.emergency_contact_phone, y, helveticaBold, helvetica, bodySize, maxContentWidth);

      // ------------------------------------------
      // PAGE 2 - Medical History
      // ------------------------------------------
      let page2 = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - 50;

      drawSectionHeading(page2, "Medical History", y, helveticaBold, headingSize);
      y -= 24;

      y = drawField(page2, "Current Medications", record.current_medications, y, helveticaBold, helvetica, bodySize, maxContentWidth);

      let result = ensureSpace(pdfDoc, page2, y, 40, helvetica, helveticaBold);
      page2 = result.page; y = result.y;
      y = drawField(page2, "Allergies", record.allergies, y, helveticaBold, helvetica, bodySize, maxContentWidth);

      result = ensureSpace(pdfDoc, page2, y, 40, helvetica, helveticaBold);
      page2 = result.page; y = result.y;
      y = drawField(page2, "Reason for Visit", record.reason_for_visit, y, helveticaBold, helvetica, bodySize, maxContentWidth);

      result = ensureSpace(pdfDoc, page2, y, 40, helvetica, helveticaBold);
      page2 = result.page; y = result.y;
      y = drawField(page2, "Current Symptoms", record.current_symptoms, y, helveticaBold, helvetica, bodySize, maxContentWidth);

      result = ensureSpace(pdfDoc, page2, y, 40, helvetica, helveticaBold);
      page2 = result.page; y = result.y;

      // Health conditions
      const conditions = record.health_conditions;
      if (conditions && (Array.isArray(conditions) ? conditions.length > 0 : true)) {
        const conditionsStr = Array.isArray(conditions) ? conditions.join(", ") : String(conditions);
        y = drawField(page2, "Health Conditions", conditionsStr, y, helveticaBold, helvetica, bodySize, maxContentWidth);
      } else {
        y = drawField(page2, "Health Conditions", "None reported", y, helveticaBold, helvetica, bodySize, maxContentWidth);
      }

      result = ensureSpace(pdfDoc, page2, y, 40, helvetica, helveticaBold);
      page2 = result.page; y = result.y;
      y = drawField(page2, "Prior Surgeries", record.prior_surgeries ?? "N/A", y, helveticaBold, helvetica, bodySize, maxContentWidth);

      result = ensureSpace(pdfDoc, page2, y, 20, helvetica, helveticaBold);
      page2 = result.page; y = result.y;
      y = drawField(page2, "History of Blood Clots", record.blood_clots ? "Yes" : "No", y, helveticaBold, helvetica, bodySize, maxContentWidth);

      result = ensureSpace(pdfDoc, page2, y, 20, helvetica, helveticaBold);
      page2 = result.page; y = result.y;
      y = drawField(page2, "Prior Hormone Therapy", record.hormone_therapy ? "Yes" : "No", y, helveticaBold, helvetica, bodySize, maxContentWidth);

      // ------------------------------------------
      // PAGE 3 - Lifestyle
      // ------------------------------------------
      let page3 = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - 50;

      drawSectionHeading(page3, "Lifestyle", y, helveticaBold, headingSize);
      y -= 24;

      y = drawField(page3, "Exercise Frequency", record.exercise_frequency, y, helveticaBold, helvetica, bodySize, maxContentWidth);
      y = drawField(page3, "Sleep Quality", record.sleep_quality, y, helveticaBold, helvetica, bodySize, maxContentWidth);
      y = drawField(page3, "Stress Level", record.stress_level, y, helveticaBold, helvetica, bodySize, maxContentWidth);
      y = drawField(page3, "Tobacco Use", record.tobacco_use ? "Yes" : "No", y, helveticaBold, helvetica, bodySize, maxContentWidth);
      y = drawField(page3, "Alcohol Use", record.alcohol_use ?? "N/A", y, helveticaBold, helvetica, bodySize, maxContentWidth);

      result = ensureSpace(pdfDoc, page3, y, 40, helvetica, helveticaBold);
      page3 = result.page; y = result.y;
      y = drawField(page3, "Wellness Goals", record.wellness_goals, y, helveticaBold, helvetica, bodySize, maxContentWidth);

      result = ensureSpace(pdfDoc, page3, y, 40, helvetica, helveticaBold);
      page3 = result.page; y = result.y;
      y = drawField(page3, "Additional Notes", record.additional_notes, y, helveticaBold, helvetica, bodySize, maxContentWidth);

      // ------------------------------------------
      // PAGE 4 - Consent & Signature
      // ------------------------------------------
      let page4 = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - 50;

      drawSectionHeading(page4, "Consent & Agreements", y, helveticaBold, headingSize);
      y -= 28;

      // Consent sections
      const consentItems = [
        { title: "Self-Pay Financial Agreement", field: record.consent_financial },
        { title: "Informed Consent for Medical Services", field: record.consent_medical },
        { title: "HIPAA Notice of Privacy Practices", field: record.consent_hipaa },
      ];

      for (const item of consentItems) {
        result = ensureSpace(pdfDoc, page4, y, 30, helvetica, helveticaBold);
        page4 = result.page; y = result.y;

        page4.drawText(item.title, {
          x: 50,
          y,
          font: helveticaBold,
          size: subheadingSize,
          color: rgb(0, 0, 0),
        });
        y -= 16;

        const agreed = item.field ? "Yes" : "No";
        page4.drawText(`AGREED: ${agreed}`, {
          x: 60,
          y,
          font: helvetica,
          size: bodySize,
          color: rgb(0, 0, 0),
        });
        y -= 22;
      }

      // Submission date
      y -= 8;
      result = ensureSpace(pdfDoc, page4, y, 20, helvetica, helveticaBold);
      page4 = result.page; y = result.y;

      const submissionDate = record.submission_date || record.created_at || new Date().toISOString();
      y = drawField(page4, "Submission Date", submissionDate, y, helveticaBold, helvetica, bodySize, maxContentWidth);

      // Signature image
      y -= 16;
      result = ensureSpace(pdfDoc, page4, y, 120, helvetica, helveticaBold);
      page4 = result.page; y = result.y;

      page4.drawText("Patient Signature:", {
        x: 50,
        y,
        font: helveticaBold,
        size: subheadingSize,
        color: rgb(0, 0, 0),
      });
      y -= 10;

      if (record.signature) {
        try {
          let sigData = record.signature as string;
          // Strip data URI prefix if present
          if (sigData.startsWith("data:")) {
            sigData = sigData.split(",")[1];
          }
          // Decode base64
          const sigBinaryStr = atob(sigData);
          const sigBytes = new Uint8Array(sigBinaryStr.length);
          for (let i = 0; i < sigBinaryStr.length; i++) {
            sigBytes[i] = sigBinaryStr.charCodeAt(i);
          }
          const sigImage = await pdfDoc.embedPng(sigBytes);
          const sigDims = sigImage.scale(0.5);
          const maxSigWidth = 250;
          const maxSigHeight = 80;
          let drawWidth = sigDims.width;
          let drawHeight = sigDims.height;
          if (drawWidth > maxSigWidth) {
            const ratio = maxSigWidth / drawWidth;
            drawWidth = maxSigWidth;
            drawHeight = drawHeight * ratio;
          }
          if (drawHeight > maxSigHeight) {
            const ratio = maxSigHeight / drawHeight;
            drawHeight = maxSigHeight;
            drawWidth = drawWidth * ratio;
          }
          page4.drawImage(sigImage, {
            x: 60,
            y: y - drawHeight,
            width: drawWidth,
            height: drawHeight,
          });
          y -= drawHeight + 10;
        } catch (sigErr) {
          console.error("Failed to embed signature image:", sigErr);
          page4.drawText("[Signature on file - could not embed image]", {
            x: 60,
            y: y - 14,
            font: helvetica,
            size: bodySize,
            color: rgb(0.5, 0.5, 0.5),
          });
          y -= 24;
        }
      } else {
        page4.drawText("[No signature provided]", {
          x: 60,
          y: y - 14,
          font: helvetica,
          size: bodySize,
          color: rgb(0.5, 0.5, 0.5),
        });
        y -= 24;
      }

      // Footer
      const timestamp = new Date().toISOString();
      const footerText = `Premier Vitality and Wellness LLC | Generated ${timestamp}`;
      const footerWidth = helvetica.widthOfTextAtSize(footerText, 8);
      page4.drawText(footerText, {
        x: (pageWidth - footerWidth) / 2,
        y: 30,
        font: helvetica,
        size: 8,
        color: rgb(0.5, 0.5, 0.5),
      });

      pdfBytes = await pdfDoc.save();
      console.log(`PDF generated: ${pdfBytes.length} bytes`);
    } catch (pdfError) {
      console.error("PDF generation failed:", pdfError);
      // pdfBytes stays null - we'll still try to send emails without attachment
    }

    // --- 3. Upload PDF to Storage ---
    if (pdfBytes) {
      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("patient-intake-pdfs")
          .upload(fileName, pdfBytes, {
            contentType: "application/pdf",
            upsert: true,
          });

        if (uploadError) {
          console.error("Storage upload failed:", uploadError);
        } else {
          console.log("PDF uploaded:", uploadData?.path);
          const { data: urlData } = supabase.storage
            .from("patient-intake-pdfs")
            .getPublicUrl(fileName);

          pdfUrl = urlData?.publicUrl || null;

          if (pdfUrl) {
            const { error: updateError } = await supabase
              .from("patient_intake")
              .update({ pdf_url: pdfUrl })
              .eq("id", intakeId);

            if (updateError) {
              console.error("Failed to update pdf_url on record:", updateError);
            } else {
              console.log("Record updated with pdf_url:", pdfUrl);
            }
          }
        }
      } catch (storageErr) {
        console.error("Storage operation failed:", storageErr);
      }
    }

    // --- 4. Send emails via Resend ---
    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not configured, skipping emails");
    } else {
      // Build attachment array (only if we have PDF bytes)
      const attachments = pdfBytes
        ? [
            {
              filename: fileName,
              content: btoa(String.fromCharCode(...pdfBytes)),
            },
          ]
        : [];

      // --- Patient Confirmation Email ---
      const patientFirstName = record.first_name || "Patient";
      const patientEmailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr><td style="text-align:center;padding-bottom:24px;">
          <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-weight:300;font-size:28px;color:hsl(220,26%,14%);margin:0;">
            Premier Vitality and Wellness LLC
          </h1>
        </td></tr>
        <tr><td style="background:hsl(40,18%,92%);border-radius:8px;padding:40px 32px;">
          <p style="font-size:15px;line-height:1.7;color:hsl(220,26%,14%);margin:0 0 16px;">
            Dear ${patientFirstName},
          </p>
          <p style="font-size:14px;line-height:1.7;color:hsl(218,12%,45%);margin:0 0 16px;">
            Thank you for completing your patient intake forms with Premier Vitality and Wellness LLC.
          </p>
          <p style="font-size:14px;line-height:1.7;color:hsl(218,12%,45%);margin:0 0 16px;">
            Your forms have been received and our clinical team will review them promptly.
          </p>
          <p style="font-size:14px;line-height:1.7;color:hsl(218,12%,45%);margin:0 0 16px;">
            A copy of your signed forms is attached to this email for your records.
          </p>
          <p style="font-size:14px;line-height:1.7;color:hsl(218,12%,45%);margin:0 0 0;">
            If you have any questions, please contact us at
            <a href="mailto:admin@premiervitalityandwellness.com" style="color:hsl(39,38%,45%);">admin@premiervitalityandwellness.com</a>.
          </p>
        </td></tr>
        <tr><td style="text-align:center;padding-top:24px;">
          <p style="font-size:11px;color:hsl(218,12%,45%);margin:0;">
            Premier Vitality and Wellness LLC &middot; Chandler, AZ
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

      if (record.email) {
        try {
          const patientEmailRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Premier Vitality and Wellness LLC <admin@premiervitalityandwellness.com>",
              to: [record.email],
              subject:
                "Your Premier Vitality and Wellness LLC Forms Have Been Received",
              html: patientEmailHtml,
              ...(attachments.length > 0 ? { attachments } : {}),
            }),
          });

          const patientEmailData = await patientEmailRes.json();
          if (!patientEmailRes.ok) {
            console.error("Patient email send failed:", patientEmailData);
          } else {
            console.log("Patient confirmation email sent:", patientEmailData.id);
          }
        } catch (emailErr) {
          console.error("Patient email error:", emailErr);
        }
      } else {
        console.warn("No patient email on record, skipping patient confirmation");
      }

      // --- Admin Notification Email ---
      const adminEmailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr><td style="text-align:center;padding-bottom:24px;">
          <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-weight:300;font-size:24px;color:hsl(220,26%,14%);margin:0;">
            New Patient Intake Submission
          </h1>
        </td></tr>
        <tr><td style="background:hsl(40,18%,92%);border-radius:8px;padding:32px;">
          <p style="font-size:14px;line-height:1.7;color:hsl(220,26%,14%);margin:0 0 20px;">
            New patient intake submission received.
          </p>
          <table cellpadding="0" cellspacing="0" style="width:100%;">
            <tr>
              <td style="font-size:13px;color:hsl(218,12%,45%);padding:6px 0;font-weight:bold;width:140px;">Patient Name</td>
              <td style="font-size:13px;color:hsl(220,26%,14%);padding:6px 0;">${record.first_name || ""} ${record.last_name || ""}</td>
            </tr>
            <tr>
              <td style="font-size:13px;color:hsl(218,12%,45%);padding:6px 0;font-weight:bold;">Date of Birth</td>
              <td style="font-size:13px;color:hsl(220,26%,14%);padding:6px 0;">${record.date_of_birth || "N/A"}</td>
            </tr>
            <tr>
              <td style="font-size:13px;color:hsl(218,12%,45%);padding:6px 0;font-weight:bold;">Phone</td>
              <td style="font-size:13px;color:hsl(220,26%,14%);padding:6px 0;">${record.phone || "N/A"}</td>
            </tr>
            <tr>
              <td style="font-size:13px;color:hsl(218,12%,45%);padding:6px 0;font-weight:bold;">Email</td>
              <td style="font-size:13px;color:hsl(220,26%,14%);padding:6px 0;">${record.email || "N/A"}</td>
            </tr>
            <tr>
              <td style="font-size:13px;color:hsl(218,12%,45%);padding:6px 0;font-weight:bold;">Reason for Visit</td>
              <td style="font-size:13px;color:hsl(220,26%,14%);padding:6px 0;">${record.reason_for_visit || "N/A"}</td>
            </tr>
          </table>
          <p style="font-size:13px;line-height:1.7;color:hsl(218,12%,45%);margin:20px 0 0;">
            Full PDF attached.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

      try {
        const adminEmailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "PVW Intake System <admin@premiervitalityandwellness.com>",
            to: ["admin@premiervitalityandwellness.com"],
            subject: `New Patient Intake - ${record.first_name || ""} ${record.last_name || ""}`,
            html: adminEmailHtml,
            ...(attachments.length > 0 ? { attachments } : {}),
          }),
        });

        const adminEmailData = await adminEmailRes.json();
        if (!adminEmailRes.ok) {
          console.error("Admin email send failed:", adminEmailData);
        } else {
          console.log("Admin notification email sent:", adminEmailData.id);
        }
      } catch (emailErr) {
        console.error("Admin email error:", emailErr);
      }
    }

    // --- 5. Return success ---
    return new Response(
      JSON.stringify({
        success: true,
        pdf_url: pdfUrl,
        intake_id: intakeId,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error("process-intake error:", e);
    return new Response(
      JSON.stringify({ error: e.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

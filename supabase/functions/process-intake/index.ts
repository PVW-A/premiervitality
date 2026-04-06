import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/* ─── Agreement texts (must match IntakeForm.tsx) ─── */

const FINANCIAL_AGREEMENT_TEXT = `Receipt of health care services from Premier Vitality and Wellness LLC and a Premier Vitality and Wellness LLC Provider constitutes an ongoing agreement to these Terms and Conditions of Payment. Premier Vitality and Wellness LLC does not accept managed care plans, Medicare, Medicaid, or other government health care programs, or other third-party payors. All services rendered by Premier Vitality and Wellness LLC are provided on a self-pay basis. Payment in full is due at the time services are rendered unless other arrangements have been made in advance and approved in writing by Premier Vitality and Wellness LLC.

By signing this agreement, you acknowledge and agree that you are personally responsible for all charges incurred for services provided by Premier Vitality and Wellness LLC, regardless of any insurance coverage or third-party payment arrangements you may have. You agree not to submit any claims to Medicare, Medicaid, or any other government health care program for reimbursement of services rendered by Premier Vitality and Wellness LLC.

Accepted forms of payment include credit card, debit card, ACH bank transfer, and other approved electronic payment methods. Cash payments are not accepted. You authorize Premier Vitality and Wellness LLC to store your payment information securely on file and to charge the card or account on file for any outstanding balances, recurring membership fees, subscription charges, or approved treatment costs as they become due. You will receive notice prior to any recurring charge.

All fees for services, treatments, memberships, and products are non-refundable. Once payment has been processed, no refunds will be issued for any reason, including but not limited to dissatisfaction with treatment outcomes, early termination of membership, unused services or products, or failure to attend scheduled appointments. Missed appointments or appointments cancelled with less than 24 hours notice may be subject to a cancellation fee.

Premier Vitality and Wellness LLC reserves the right to modify its fee schedule at any time. You will be notified of any fee changes prior to your next scheduled service or billing cycle. Continued use of Premier Vitality and Wellness LLC services after notification of fee changes constitutes acceptance of the updated fees.

In the event of a billing dispute, you agree to notify Premier Vitality and Wellness LLC in writing within thirty (30) days of the charge in question. Failure to dispute a charge within this timeframe constitutes acceptance of the charge.

BINDING ARBITRATION: Any dispute, claim, or controversy arising out of or relating to this agreement, the services provided by Premier Vitality and Wellness LLC, or the relationship between you and Premier Vitality and Wellness LLC, shall be resolved exclusively through binding arbitration administered by the American Arbitration Association in accordance with its Commercial Arbitration Rules. The arbitration shall take place in the state where Premier Vitality and Wellness LLC maintains its principal place of business. The arbitrator's decision shall be final and binding and may be entered as a judgment in any court of competent jurisdiction. By agreeing to arbitration, you waive your right to participate in a class action lawsuit or class-wide arbitration. Each party shall bear its own costs and attorneys' fees in connection with the arbitration, unless the arbitrator determines otherwise.

This agreement shall be governed by and construed in accordance with the laws of the state in which Premier Vitality and Wellness LLC is organized. If any provision of this agreement is found to be unenforceable, the remaining provisions shall continue in full force and effect.`;

const INFORMED_CONSENT_TEXT = `INFORMED CONSENT FOR MEDICAL SERVICES (IN-PERSON AND TELEHEALTH)

I, the undersigned patient, hereby voluntarily consent to receive medical services, including but not limited to evaluation, examination, diagnostic testing, consultation, and treatment from Premier Vitality and Wellness LLC and its authorized healthcare providers. I understand that the practice of medicine is not an exact science and that diagnosis and treatment may involve risks of injury or even death. I acknowledge that no guarantees have been made to me regarding the outcome of any examination, treatment, or procedure.

SCOPE OF SERVICES: Premier Vitality and Wellness LLC provides physician-directed wellness and optimization services, including but not limited to peptide therapy, hormone optimization, biomarker analysis, nutritional counseling, and related medical services. I understand that these services are elective in nature and are not intended to replace my primary care physician or emergency medical services.

TELEHEALTH SERVICES: I consent to receiving medical services via telemedicine (telehealth) technology, which may include video conferencing, telephone consultation, secure messaging, and remote patient monitoring. I understand that telehealth involves the electronic communication of my personal medical information to healthcare providers. I understand the following regarding telehealth services: (a) The laws that protect the confidentiality of my medical information also apply to telehealth interactions; (b) I have the right to withhold or withdraw my consent to telehealth services at any time without affecting my right to future care or treatment; (c) There are potential risks to telehealth, including but not limited to: interruptions, unauthorized access, and technical difficulties. I understand that either my provider or I may discontinue the telehealth consultation if it is felt that the connection is not adequate for the situation; (d) My healthcare provider may determine that the telehealth services are not appropriate for some or all of my treatment needs and may require an in-person visit; (e) I am responsible for ensuring a private, secure environment on my end during telehealth consultations.

TREATMENT RISKS: I understand that medical treatments, including peptide therapy and hormone optimization, carry inherent risks including but not limited to: adverse reactions, allergic responses, injection site reactions, changes in mood or energy levels, and other side effects that may be known or unknown. My provider will discuss specific risks related to my individual treatment plan. I acknowledge that I have had the opportunity to ask questions about proposed treatments and that my questions have been answered to my satisfaction.

PATIENT RESPONSIBILITIES: I agree to provide complete and accurate medical history, report any changes in my health status, follow treatment instructions as directed, attend scheduled follow-up appointments, and promptly report any adverse reactions or concerns. I understand that failure to comply with treatment protocols may affect outcomes and safety.

I have read this informed consent document in its entirety. I understand the information provided, and I voluntarily consent to receive medical services from Premier Vitality and Wellness LLC. I understand that I may revoke this consent at any time by providing written notice to Premier Vitality and Wellness LLC.`;

const HIPAA_NOTICE_TEXT = `NOTICE OF PRIVACY PRACTICES — PREMIER VITALITY AND WELLNESS LLC

THIS NOTICE DESCRIBES HOW MEDICAL INFORMATION ABOUT YOU MAY BE USED AND DISCLOSED AND HOW YOU CAN GET ACCESS TO THIS INFORMATION. PLEASE REVIEW IT CAREFULLY.

Premier Vitality and Wellness LLC is required by law to maintain the privacy of your protected health information (PHI), to provide you with this Notice of our legal duties and privacy practices with respect to your PHI, and to abide by the terms of this Notice currently in effect. "Protected health information" means individually identifiable health information, including demographic information, collected from you or created or received by a health care provider, health plan, your employer, or a health care clearinghouse that relates to: (i) your past, present, or future physical or mental health or condition; (ii) the provision of health care to you; or (iii) the past, present, or future payment for the provision of health care to you.

USES AND DISCLOSURES OF YOUR PHI: Premier Vitality and Wellness LLC may use or disclose your PHI for the following purposes: (1) Treatment — We may use and disclose your PHI to provide, coordinate, or manage your health care and related services, including consultations between health care providers regarding your treatment and referrals for treatment. (2) Payment — We may use and disclose your PHI to obtain payment for health care services provided to you, including billing and collection activities and utilization review. (3) Health Care Operations — We may use and disclose your PHI for our health care operations, which include quality assessment, credentialing, training, licensing, and other administrative activities. (4) As Required by Law — We may use or disclose your PHI when required to do so by applicable federal, state, or local law.

YOUR RIGHTS REGARDING YOUR PHI: You have the following rights with respect to your PHI: (a) Right to Access — You have the right to inspect and obtain a copy of your PHI maintained by Premier Vitality and Wellness LLC, with limited exceptions. You must submit your request in writing. We may charge a reasonable fee for providing copies. (b) Right to Amend — You have the right to request an amendment to your PHI if you believe the information is incorrect or incomplete. Requests must be made in writing and include a reason for the amendment. We may deny your request under certain circumstances. (c) Right to an Accounting of Disclosures — You have the right to request a list of certain disclosures of your PHI made by Premier Vitality and Wellness LLC. (d) Right to Request Restrictions — You have the right to request restrictions on certain uses and disclosures of your PHI. We are not required to agree to your request unless the disclosure is to a health plan for payment or health care operations purposes and the PHI pertains to a service for which you have paid in full out of pocket. (e) Right to Request Confidential Communications — You have the right to request that we communicate with you about health matters through a particular means or at a certain location. (f) Right to a Paper Copy of This Notice — You have the right to obtain a paper copy of this Notice at any time, even if you have agreed to receive it electronically.

CHANGES TO THIS NOTICE: Premier Vitality and Wellness LLC reserves the right to change the terms of this Notice and to make new provisions effective for all PHI we maintain. If we make material changes, we will make the revised Notice available upon request and will post it in our office.

COMPLAINTS: If you believe your privacy rights have been violated, you may file a complaint with Premier Vitality and Wellness LLC or with the Secretary of the United States Department of Health and Human Services. You will not be penalized or retaliated against for filing a complaint.

CONTACT INFORMATION: To exercise any of your rights, obtain a copy of this Notice, or file a complaint, please contact: Premier Vitality and Wellness LLC, Privacy Officer, at the address or phone number listed on our website.

Effective Date: This Notice is effective as of January 1, 2025.`;

/* ─── PDF Helpers ─── */

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN_LEFT = 50;
const MARGIN_RIGHT = 545;
const CONTENT_W = MARGIN_RIGHT - MARGIN_LEFT;
const FOOTER_Y = 40;
const TOP_Y = PAGE_H - 50;
const GOLD = rgb(0.788, 0.663, 0.431); // #C9A96E
const BLACK = rgb(0, 0, 0);
const GRAY = rgb(0.45, 0.45, 0.45);
const LIGHT_GRAY = rgb(0.75, 0.75, 0.75);
const BODY_SIZE = 9.5;
const HEADING_SIZE = 13;
const AGREEMENT_SIZE = 8;
const LINE_H = BODY_SIZE + 4;
const AGREEMENT_LINE_H = AGREEMENT_SIZE + 3;

function wrapText(text: string, font: any, fontSize: number, maxWidth: number): string[] {
  if (!text || typeof text !== "string") return [""];
  const paragraphs = text.split("\n");
  const lines: string[] = [];
  for (const paragraph of paragraphs) {
    if (paragraph.trim() === "") { lines.push(""); continue; }
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

// Track all pages for footer/page-number pass
interface PageState {
  page: any;
  y: number;
}

function newPage(pdfDoc: any, pages: any[]): PageState {
  const page = pdfDoc.addPage([PAGE_W, PAGE_H]);
  pages.push(page);
  return { page, y: TOP_Y };
}

function ensureSpace(pdfDoc: any, state: PageState, needed: number, pages: any[]): PageState {
  if (state.y - needed < FOOTER_Y + 20) {
    return newPage(pdfDoc, pages);
  }
  return state;
}

function drawGoldHeading(state: PageState, text: string, boldFont: any): number {
  state.page.drawText(text, {
    x: MARGIN_LEFT, y: state.y, font: boldFont, size: HEADING_SIZE, color: GOLD,
  });
  state.page.drawLine({
    start: { x: MARGIN_LEFT, y: state.y - 5 },
    end: { x: MARGIN_RIGHT, y: state.y - 5 },
    thickness: 0.75, color: GOLD,
  });
  return state.y - 22;
}

function drawField(state: PageState, label: string, value: string | null | undefined, boldFont: any, regularFont: any): number {
  const safeValue = value ?? "N/A";
  state.page.drawText(`${label}:`, { x: MARGIN_LEFT, y: state.y, font: boldFont, size: BODY_SIZE, color: GRAY });
  const labelW = boldFont.widthOfTextAtSize(`${label}: `, BODY_SIZE);
  const valueX = MARGIN_LEFT + labelW + 4;
  const avail = CONTENT_W - labelW - 4;
  const lines = wrapText(safeValue, regularFont, BODY_SIZE, avail > 100 ? avail : CONTENT_W - 10);
  for (let i = 0; i < lines.length; i++) {
    state.page.drawText(lines[i], {
      x: i === 0 ? valueX : MARGIN_LEFT + 10,
      y: state.y - i * LINE_H,
      font: regularFont, size: BODY_SIZE, color: BLACK,
    });
  }
  return state.y - lines.length * LINE_H - 4;
}

function drawAgreementText(pdfDoc: any, state: PageState, title: string, agreed: boolean, text: string, boldFont: any, regularFont: any, pages: any[]): PageState {
  // Title
  state = ensureSpace(pdfDoc, state, 40, pages);
  state.page.drawText(title, { x: MARGIN_LEFT, y: state.y, font: boldFont, size: 10.5, color: GOLD });
  state.y -= 14;
  const statusText = agreed ? "AGREED" : "NOT AGREED";
  const statusColor = agreed ? rgb(0.2, 0.6, 0.3) : rgb(0.7, 0.2, 0.2);
  state.page.drawText(`Status: ${statusText}`, { x: MARGIN_LEFT, y: state.y, font: boldFont, size: BODY_SIZE, color: statusColor });
  state.y -= 14;

  // Full agreement text
  const lines = wrapText(text, regularFont, AGREEMENT_SIZE, CONTENT_W);
  for (const line of lines) {
    state = ensureSpace(pdfDoc, state, AGREEMENT_LINE_H + 2, pages);
    if (line === "") {
      state.y -= AGREEMENT_LINE_H * 0.5;
      continue;
    }
    state.page.drawText(line, {
      x: MARGIN_LEFT, y: state.y, font: regularFont, size: AGREEMENT_SIZE, color: GRAY,
    });
    state.y -= AGREEMENT_LINE_H;
  }
  state.y -= 10;
  return state;
}

function addFootersAndPageNumbers(pages: any[], regularFont: any) {
  const totalPages = pages.length;
  const footerText = "Premier Vitality & Wellness  |  Confidential Patient Record";
  for (let i = 0; i < totalPages; i++) {
    const page = pages[i];
    // Footer text
    const fw = regularFont.widthOfTextAtSize(footerText, 7.5);
    page.drawText(footerText, {
      x: (PAGE_W - fw) / 2, y: FOOTER_Y - 10,
      font: regularFont, size: 7.5, color: LIGHT_GRAY,
    });
    // Page number
    const pn = `Page ${i + 1} of ${totalPages}`;
    const pw = regularFont.widthOfTextAtSize(pn, 7.5);
    page.drawText(pn, {
      x: PAGE_W - 50 - pw, y: FOOTER_Y - 10,
      font: regularFont, size: 7.5, color: LIGHT_GRAY,
    });
    // Thin gold line above footer
    page.drawLine({
      start: { x: MARGIN_LEFT, y: FOOTER_Y },
      end: { x: MARGIN_RIGHT, y: FOOTER_Y },
      thickness: 0.5, color: GOLD,
    });
  }
}

/* ─── Main Handler ─── */

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

    // --- 2. Generate branded PDF ---
    let pdfBytes: Uint8Array | null = null;
    let pdfUrl: string | null = null;
    const submissionDate = record.submission_date || new Date().toISOString().split("T")[0];
    const fileName = `${(record.last_name || "unknown").toLowerCase()}_${(record.first_name || "unknown").toLowerCase()}_${submissionDate}.pdf`;

    try {
      const pdfDoc = await PDFDocument.create();
      const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const pages: any[] = [];
      let state = newPage(pdfDoc, pages);

      // ── BRANDED HEADER ──
      const headerText = "PREMIER VITALITY & WELLNESS";
      const headerW = helveticaBold.widthOfTextAtSize(headerText, 20);
      state.page.drawText(headerText, {
        x: (PAGE_W - headerW) / 2, y: state.y,
        font: helveticaBold, size: 20, color: GOLD,
      });
      state.y -= 20;

      const subtitleText = "Patient Intake Form";
      const subtitleW = helvetica.widthOfTextAtSize(subtitleText, 11);
      state.page.drawText(subtitleText, {
        x: (PAGE_W - subtitleW) / 2, y: state.y,
        font: helvetica, size: 11, color: GRAY,
      });
      state.y -= 18;

      // Gold divider
      state.page.drawLine({
        start: { x: MARGIN_LEFT, y: state.y },
        end: { x: MARGIN_RIGHT, y: state.y },
        thickness: 1.5, color: GOLD,
      });
      state.y -= 18;

      // Patient name + date block
      const patientName = `${record.first_name || ""} ${record.last_name || ""}`.trim() || "N/A";
      state.page.drawText(patientName, {
        x: MARGIN_LEFT, y: state.y,
        font: helveticaBold, size: 14, color: BLACK,
      });
      const dateText = `Submitted: ${submissionDate}`;
      const dateW = helvetica.widthOfTextAtSize(dateText, 9);
      state.page.drawText(dateText, {
        x: MARGIN_RIGHT - dateW, y: state.y + 2,
        font: helvetica, size: 9, color: GRAY,
      });
      state.y -= 28;

      // ── PERSONAL INFORMATION ──
      state.y = drawGoldHeading(state, "Personal Information", helveticaBold);

      state.y = drawField(state, "Full Name", patientName, helveticaBold, helvetica);
      state.y = drawField(state, "Date of Birth", record.date_of_birth, helveticaBold, helvetica);
      state.y = drawField(state, "Sex", record.sex, helveticaBold, helvetica);
      state.y = drawField(state, "Phone", record.phone, helveticaBold, helvetica);
      state.y = drawField(state, "Email", record.email, helveticaBold, helvetica);

      const addressParts = [record.address, record.city, record.state, record.zip].filter(Boolean);
      const fullAddress = addressParts.length > 0 ? addressParts.join(", ") : null;
      state.y = drawField(state, "Address", fullAddress, helveticaBold, helvetica);

      state.y -= 12;
      state = ensureSpace(pdfDoc, state, 60, pages);

      // ── EMERGENCY CONTACT ──
      state.y = drawGoldHeading(state, "Emergency Contact", helveticaBold);
      state.y = drawField(state, "Name", record.emergency_contact_name, helveticaBold, helvetica);
      state.y = drawField(state, "Phone", record.emergency_contact_phone, helveticaBold, helvetica);

      state.y -= 12;
      state = ensureSpace(pdfDoc, state, 60, pages);

      // ── MEDICAL HISTORY ──
      state.y = drawGoldHeading(state, "Medical History", helveticaBold);

      state = ensureSpace(pdfDoc, state, 30, pages);
      state.y = drawField(state, "Current Medications", record.current_medications, helveticaBold, helvetica);
      state = ensureSpace(pdfDoc, state, 30, pages);
      state.y = drawField(state, "Allergies", record.allergies, helveticaBold, helvetica);
      state = ensureSpace(pdfDoc, state, 30, pages);
      state.y = drawField(state, "Reason for Visit", record.reason_for_visit, helveticaBold, helvetica);
      state = ensureSpace(pdfDoc, state, 30, pages);
      state.y = drawField(state, "Current Symptoms", record.current_symptoms, helveticaBold, helvetica);

      state = ensureSpace(pdfDoc, state, 30, pages);
      const conditions = record.health_conditions;
      const condStr = conditions && (Array.isArray(conditions) ? conditions.length > 0 : true)
        ? (Array.isArray(conditions) ? conditions.join(", ") : String(conditions))
        : "None reported";
      state.y = drawField(state, "Health Conditions", condStr, helveticaBold, helvetica);

      state = ensureSpace(pdfDoc, state, 20, pages);
      state.y = drawField(state, "Prior Surgeries", record.prior_surgeries ? "Yes" : "No", helveticaBold, helvetica);
      if (record.prior_surgeries && record.prior_surgeries_description) {
        state = ensureSpace(pdfDoc, state, 20, pages);
        state.y = drawField(state, "Surgery Details", record.prior_surgeries_description, helveticaBold, helvetica);
      }
      state = ensureSpace(pdfDoc, state, 20, pages);
      state.y = drawField(state, "History of Blood Clots", record.blood_clots ? "Yes" : "No", helveticaBold, helvetica);
      state = ensureSpace(pdfDoc, state, 20, pages);
      state.y = drawField(state, "Prior Hormone Therapy", record.hormone_therapy ? "Yes" : "No", helveticaBold, helvetica);

      state.y -= 12;
      state = ensureSpace(pdfDoc, state, 60, pages);

      // ── LIFESTYLE ──
      state.y = drawGoldHeading(state, "Lifestyle", helveticaBold);

      state.y = drawField(state, "Exercise Frequency", record.exercise_frequency, helveticaBold, helvetica);
      state.y = drawField(state, "Sleep Quality", record.sleep_quality, helveticaBold, helvetica);
      state.y = drawField(state, "Stress Level", String(record.stress_level ?? "N/A"), helveticaBold, helvetica);
      state.y = drawField(state, "Tobacco Use", record.tobacco_use ? "Yes" : "No", helveticaBold, helvetica);
      state.y = drawField(state, "Alcohol Use", record.alcohol_use ?? "N/A", helveticaBold, helvetica);

      state = ensureSpace(pdfDoc, state, 30, pages);
      state.y = drawField(state, "Wellness Goals", record.wellness_goals, helveticaBold, helvetica);
      state = ensureSpace(pdfDoc, state, 30, pages);
      state.y = drawField(state, "Additional Notes", record.additional_notes, helveticaBold, helvetica);

      state.y -= 12;
      state = ensureSpace(pdfDoc, state, 60, pages);

      // ── CONSENT & AGREEMENTS ──
      state.y = drawGoldHeading(state, "Consent & Agreements", helveticaBold);
      state.y -= 4;

      state = drawAgreementText(pdfDoc, state, "Self-Pay Financial Agreement", !!record.consent_self_pay, FINANCIAL_AGREEMENT_TEXT, helveticaBold, helvetica, pages);
      state = drawAgreementText(pdfDoc, state, "Informed Consent for Medical Services", !!record.consent_medical_services, INFORMED_CONSENT_TEXT, helveticaBold, helvetica, pages);
      state = drawAgreementText(pdfDoc, state, "HIPAA Notice of Privacy Practices", !!record.consent_hipaa, HIPAA_NOTICE_TEXT, helveticaBold, helvetica, pages);

      // ── SIGNATURE ──
      state = ensureSpace(pdfDoc, state, 120, pages);
      state.y -= 8;
      state.page.drawText("Patient Signature", { x: MARGIN_LEFT, y: state.y, font: helveticaBold, size: 10.5, color: GOLD });
      state.y -= 14;

      state.page.drawText(`Date: ${submissionDate}`, { x: MARGIN_LEFT, y: state.y, font: helvetica, size: BODY_SIZE, color: GRAY });
      state.y -= 16;

      if (record.signature) {
        try {
          let sigData = record.signature as string;
          if (sigData.startsWith("data:")) sigData = sigData.split(",")[1];
          const sigBinaryStr = atob(sigData);
          const sigBytes = new Uint8Array(sigBinaryStr.length);
          for (let i = 0; i < sigBinaryStr.length; i++) sigBytes[i] = sigBinaryStr.charCodeAt(i);
          const sigImage = await pdfDoc.embedPng(sigBytes);
          const sigDims = sigImage.scale(0.5);
          let drawWidth = sigDims.width;
          let drawHeight = sigDims.height;
          const maxSigWidth = 250;
          const maxSigHeight = 80;
          if (drawWidth > maxSigWidth) { const r = maxSigWidth / drawWidth; drawWidth = maxSigWidth; drawHeight *= r; }
          if (drawHeight > maxSigHeight) { const r = maxSigHeight / drawHeight; drawHeight = maxSigHeight; drawWidth *= r; }
          state.page.drawImage(sigImage, { x: MARGIN_LEFT + 10, y: state.y - drawHeight, width: drawWidth, height: drawHeight });
          state.y -= drawHeight + 10;
        } catch (sigErr) {
          console.error("Failed to embed signature image:", sigErr);
          state.page.drawText("[Signature on file]", { x: MARGIN_LEFT + 10, y: state.y - 14, font: helvetica, size: BODY_SIZE, color: GRAY });
          state.y -= 24;
        }
      } else {
        state.page.drawText("[No signature provided]", { x: MARGIN_LEFT + 10, y: state.y - 14, font: helvetica, size: BODY_SIZE, color: GRAY });
        state.y -= 24;
      }

      // ── FOOTERS & PAGE NUMBERS (all pages) ──
      addFootersAndPageNumbers(pages, helvetica);

      pdfBytes = await pdfDoc.save();
      console.log(`PDF generated: ${pdfBytes.length} bytes, ${pages.length} pages`);
    } catch (pdfError) {
      console.error("PDF generation failed:", pdfError);
    }

    // --- 3. Upload PDF to Storage ---
    if (pdfBytes) {
      try {
        // Upload to admin bucket (existing)
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("patient-intake-pdfs")
          .upload(fileName, pdfBytes, { contentType: "application/pdf", upsert: true });

        if (uploadError) {
          console.error("Storage upload failed:", uploadError);
        } else {
          console.log("PDF uploaded to admin bucket:", uploadData?.path);
          const { data: urlData } = supabase.storage.from("patient-intake-pdfs").getPublicUrl(fileName);
          pdfUrl = urlData?.publicUrl || null;
          if (pdfUrl) {
            await supabase.from("patient_intake").update({ pdf_url: pdfUrl }).eq("id", intakeId);
          }
        }

        // --- 3b. Save to patient's Documents folder ---
        // Look up user_id from email
        const patientEmail = record.email;
        if (patientEmail) {
          const { data: userData } = await supabase.auth.admin.listUsers();
          const matchedUser = userData?.users?.find(
            (u: any) => u.email?.toLowerCase() === patientEmail.toLowerCase()
          );

          if (matchedUser) {
            const userId = matchedUser.id;
            const docPath = `${userId}/intake-form-${submissionDate}.pdf`;

            const { error: docUploadErr } = await supabase.storage
              .from("patient-documents")
              .upload(docPath, pdfBytes, { contentType: "application/pdf", upsert: true });

            if (docUploadErr) {
              console.error("Patient documents upload failed:", docUploadErr);
            } else {
              console.log("PDF saved to patient-documents:", docPath);

              // Insert document record
              const { error: docInsertErr } = await supabase
                .from("patient_documents")
                .insert({
                  user_id: userId,
                  name: "Patient Intake Form",
                  type: "intake_form",
                  file_path: docPath,
                  file_size: pdfBytes.length,
                  visible_to_patient: true,
                  uploaded_at: new Date().toISOString(),
                });

              if (docInsertErr) {
                console.error("Patient document record insert failed:", docInsertErr);
              } else {
                console.log("Patient document record created for user:", userId);
              }
            }
          } else {
            console.log("No matching user found for email:", patientEmail, "— document will be available once they register.");
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
      const attachments = pdfBytes
        ? [{ filename: fileName, content: btoa(String.fromCharCode(...pdfBytes)) }]
        : [];

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
            Premier Vitality & Wellness
          </h1>
        </td></tr>
        <tr><td style="background:hsl(40,18%,92%);border-radius:8px;padding:40px 32px;">
          <p style="font-size:15px;line-height:1.7;color:hsl(220,26%,14%);margin:0 0 16px;">Dear ${patientFirstName},</p>
          <p style="font-size:14px;line-height:1.7;color:hsl(218,12%,45%);margin:0 0 16px;">Thank you for completing your patient intake forms with Premier Vitality & Wellness.</p>
          <p style="font-size:14px;line-height:1.7;color:hsl(218,12%,45%);margin:0 0 16px;">Your forms have been received and our clinical team will review them promptly.</p>
          <p style="font-size:14px;line-height:1.7;color:hsl(218,12%,45%);margin:0 0 16px;">A copy of your signed forms is attached to this email and available in your Patient Portal under Documents.</p>
          <p style="font-size:14px;line-height:1.7;color:hsl(218,12%,45%);margin:0 0 0;">If you have any questions, please contact us at <a href="mailto:admin@premiervitalityandwellness.com" style="color:hsl(39,38%,45%);">admin@premiervitalityandwellness.com</a>.</p>
        </td></tr>
        <tr><td style="text-align:center;padding-top:24px;">
          <p style="font-size:11px;color:hsl(218,12%,45%);margin:0;">Premier Vitality & Wellness &middot; Chandler, AZ</p>
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
            headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              from: "Premier Vitality & Wellness <admin@premiervitalityandwellness.com>",
              to: [record.email],
              subject: "Your Premier Vitality & Wellness Forms Have Been Received",
              html: patientEmailHtml,
              ...(attachments.length > 0 ? { attachments } : {}),
            }),
          });
          const data = await patientEmailRes.json();
          if (!patientEmailRes.ok) console.error("Patient email send failed:", data);
          else console.log("Patient confirmation email sent:", data.id);
        } catch (emailErr) {
          console.error("Patient email error:", emailErr);
        }
      }

      // Admin notification
      const adminEmailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
        <tr><td style="text-align:center;padding-bottom:24px;">
          <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-weight:300;font-size:24px;color:hsl(220,26%,14%);margin:0;">New Patient Intake Submission</h1>
        </td></tr>
        <tr><td style="background:hsl(40,18%,92%);border-radius:8px;padding:32px;">
          <p style="font-size:14px;line-height:1.7;color:hsl(220,26%,14%);margin:0 0 20px;">New patient intake submission received.</p>
          <table cellpadding="0" cellspacing="0" style="width:100%;">
            <tr><td style="font-size:13px;color:hsl(218,12%,45%);padding:6px 0;font-weight:bold;width:140px;">Patient Name</td><td style="font-size:13px;color:hsl(220,26%,14%);padding:6px 0;">${record.first_name || ""} ${record.last_name || ""}</td></tr>
            <tr><td style="font-size:13px;color:hsl(218,12%,45%);padding:6px 0;font-weight:bold;">Date of Birth</td><td style="font-size:13px;color:hsl(220,26%,14%);padding:6px 0;">${record.date_of_birth || "N/A"}</td></tr>
            <tr><td style="font-size:13px;color:hsl(218,12%,45%);padding:6px 0;font-weight:bold;">Phone</td><td style="font-size:13px;color:hsl(220,26%,14%);padding:6px 0;">${record.phone || "N/A"}</td></tr>
            <tr><td style="font-size:13px;color:hsl(218,12%,45%);padding:6px 0;font-weight:bold;">Email</td><td style="font-size:13px;color:hsl(220,26%,14%);padding:6px 0;">${record.email || "N/A"}</td></tr>
            <tr><td style="font-size:13px;color:hsl(218,12%,45%);padding:6px 0;font-weight:bold;">Reason for Visit</td><td style="font-size:13px;color:hsl(220,26%,14%);padding:6px 0;">${record.reason_for_visit || "N/A"}</td></tr>
          </table>
          <p style="font-size:13px;line-height:1.7;color:hsl(218,12%,45%);margin:20px 0 0;">Full PDF attached.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

      try {
        const adminEmailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: "PVW Intake System <admin@premiervitalityandwellness.com>",
            to: ["admin@premiervitalityandwellness.com"],
            subject: `New Patient Intake - ${record.first_name || ""} ${record.last_name || ""}`,
            html: adminEmailHtml,
            ...(attachments.length > 0 ? { attachments } : {}),
          }),
        });
        const data = await adminEmailRes.json();
        if (!adminEmailRes.ok) console.error("Admin email send failed:", data);
        else console.log("Admin notification email sent:", data.id);
      } catch (emailErr) {
        console.error("Admin email error:", emailErr);
      }
    }

    // --- 5. Return success ---
    return new Response(
      JSON.stringify({ success: true, pdf_url: pdfUrl, intake_id: intakeId }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("process-intake error:", e);
    return new Response(
      JSON.stringify({ error: e.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

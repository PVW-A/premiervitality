import { useState, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface IntakeFormData {
  // Page 1 — Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  emergencyContactName: string;
  emergencyContactPhone: string;

  // Page 2 — Medical History
  currentMedications: string;
  knownAllergies: string;
  reasonForVisit: string;
  currentSymptoms: string;
  healthConditions: string[];
  healthConditionsOther: string;
  priorSurgeries: string;
  priorSurgeriesDescription: string;
  bloodClots: string;
  priorHormoneTherapy: string;

  // Page 3 — Lifestyle
  exerciseFrequency: string;
  sleepQuality: string;
  stressLevel: number;
  tobaccoUse: string;
  alcoholUse: string;
  healthGoals: string;
  additionalInfo: string;

  // Page 4 — Consent
  consentFinancial: boolean;
  consentMedical: boolean;
  consentHipaa: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC",
];

const STATE_NAMES: Record<string, string> = {
  AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",
  CO:"Colorado",CT:"Connecticut",DE:"Delaware",FL:"Florida",GA:"Georgia",
  HI:"Hawaii",ID:"Idaho",IL:"Illinois",IN:"Indiana",IA:"Iowa",
  KS:"Kansas",KY:"Kentucky",LA:"Louisiana",ME:"Maine",MD:"Maryland",
  MA:"Massachusetts",MI:"Michigan",MN:"Minnesota",MS:"Mississippi",
  MO:"Missouri",MT:"Montana",NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",
  NJ:"New Jersey",NM:"New Mexico",NY:"New York",NC:"North Carolina",
  ND:"North Dakota",OH:"Ohio",OK:"Oklahoma",OR:"Oregon",PA:"Pennsylvania",
  RI:"Rhode Island",SC:"South Carolina",SD:"South Dakota",TN:"Tennessee",
  TX:"Texas",UT:"Utah",VT:"Vermont",VA:"Virginia",WA:"Washington",
  WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming",DC:"District of Columbia",
};

const HEALTH_CONDITIONS = [
  "Diabetes",
  "Hypertension",
  "Heart Disease",
  "Thyroid Disorder",
  "Cancer",
  "Autoimmune Condition",
  "Kidney Disease",
  "Liver Disease",
  "None of the above",
  "Other",
];

const INITIAL_FORM_DATA: IntakeFormData = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  sex: "",
  phone: "",
  email: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  currentMedications: "",
  knownAllergies: "",
  reasonForVisit: "",
  currentSymptoms: "",
  healthConditions: [],
  healthConditionsOther: "",
  priorSurgeries: "",
  priorSurgeriesDescription: "",
  bloodClots: "",
  priorHormoneTherapy: "",
  exerciseFrequency: "",
  sleepQuality: "",
  stressLevel: 5,
  tobaccoUse: "",
  alcoholUse: "",
  healthGoals: "",
  additionalInfo: "",
  consentFinancial: false,
  consentMedical: false,
  consentHipaa: false,
};

/* ------------------------------------------------------------------ */
/*  Legal text constants                                               */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const IntakeForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const source = searchParams.get("source") || "website";
  const { toast } = useToast();
  const signatureRef = useRef<SignatureCanvas | null>(null);

  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState<IntakeFormData>({ ...INITIAL_FORM_DATA });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  /* ---- helpers ---- */

  const set = useCallback(
    (field: keyof IntakeFormData, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    []
  );

  const toggleCondition = useCallback(
    (condition: string) => {
      setFormData((prev) => {
        let next: string[];
        if (condition === "None of the above") {
          next = prev.healthConditions.includes(condition) ? [] : ["None of the above"];
        } else {
          next = prev.healthConditions.includes(condition)
            ? prev.healthConditions.filter((c) => c !== condition)
            : [...prev.healthConditions.filter((c) => c !== "None of the above"), condition];
        }
        return { ...prev, healthConditions: next };
      });
      setErrors((prev) => {
        const next = { ...prev };
        delete next["healthConditions"];
        return next;
      });
    },
    []
  );

  const resetForm = useCallback(() => {
    setFormData({ ...INITIAL_FORM_DATA });
    setErrors({});
    setPage(1);
    if (signatureRef.current) signatureRef.current.clear();
  }, []);

  /* ---- validation ---- */

  const validatePage = (p: number): boolean => {
    const e: FormErrors = {};

    if (p === 1) {
      if (!formData.firstName.trim()) e.firstName = "First name is required.";
      if (!formData.lastName.trim()) e.lastName = "Last name is required.";
      if (!formData.dateOfBirth) e.dateOfBirth = "Date of birth is required.";
      if (!formData.sex) e.sex = "Sex is required.";
      if (!formData.phone.trim()) e.phone = "Phone number is required.";
      if (!formData.email.trim()) e.email = "Email is required.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Enter a valid email address.";
      if (!formData.street.trim()) e.street = "Street address is required.";
      if (!formData.city.trim()) e.city = "City is required.";
      if (!formData.state) e.state = "State is required.";
      if (!formData.zip.trim()) e.zip = "ZIP code is required.";
      if (!formData.emergencyContactName.trim()) e.emergencyContactName = "Emergency contact name is required.";
      if (!formData.emergencyContactPhone.trim()) e.emergencyContactPhone = "Emergency contact phone is required.";
    }

    if (p === 2) {
      if (!formData.reasonForVisit.trim()) e.reasonForVisit = "Reason for visit is required.";
      if (!formData.currentSymptoms.trim()) e.currentSymptoms = "Current symptoms or concerns is required.";
      if (formData.healthConditions.length === 0) e.healthConditions = "Select at least one option.";
      if (formData.healthConditions.includes("Other") && !formData.healthConditionsOther.trim())
        e.healthConditionsOther = "Please describe your condition.";
      if (!formData.priorSurgeries) e.priorSurgeries = "Please select yes or no.";
      if (formData.priorSurgeries === "yes" && !formData.priorSurgeriesDescription.trim())
        e.priorSurgeriesDescription = "Please describe prior surgeries or hospitalizations.";
      if (!formData.bloodClots) e.bloodClots = "Please select yes or no.";
      if (!formData.priorHormoneTherapy) e.priorHormoneTherapy = "Please select yes or no.";
    }

    if (p === 3) {
      if (!formData.exerciseFrequency) e.exerciseFrequency = "Exercise frequency is required.";
      if (!formData.sleepQuality) e.sleepQuality = "Sleep quality is required.";
      if (!formData.tobaccoUse) e.tobaccoUse = "Tobacco/nicotine use is required.";
      if (!formData.alcoholUse) e.alcoholUse = "Alcohol use is required.";
      if (!formData.healthGoals.trim()) e.healthGoals = "Health and wellness goals is required.";
    }

    if (p === 4) {
      if (!formData.consentFinancial) e.consentFinancial = "You must agree to the Self-Pay Financial Agreement.";
      if (!formData.consentMedical) e.consentMedical = "You must consent to medical services.";
      if (!formData.consentHipaa) e.consentHipaa = "You must acknowledge the HIPAA Notice.";
      if (signatureRef.current && signatureRef.current.isEmpty()) e.signature = "Signature is required.";
    }

    setErrors(e);

    if (Object.keys(e).length > 0) {
      const firstKey = Object.keys(e)[0];
      const el = document.getElementById(`field-${firstKey}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    return true;
  };

  /* ---- navigation ---- */

  const goNext = () => {
    if (!validatePage(page)) return;
    setPage((p) => Math.min(p + 1, 4));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setPage((p) => Math.max(p - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ---- submit ---- */

  const handleSubmit = async () => {
    if (!validatePage(4)) return;
    setSubmitting(true);

    try {
      const signatureBase64 = signatureRef.current
        ? signatureRef.current.getTrimmedCanvas().toDataURL("image/png")
        : "";

      const address = [formData.street.trim(), formData.city.trim(), formData.state, formData.zip.trim()].filter(Boolean).join(", ");

      const payload = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        date_of_birth: formData.dateOfBirth,
        sex: formData.sex,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address,
        emergency_contact_name: formData.emergencyContactName.trim(),
        emergency_contact_phone: formData.emergencyContactPhone.trim(),
        current_medications: formData.currentMedications.trim() || null,
        known_allergies: formData.knownAllergies.trim() || null,
        reason_for_visit: formData.reasonForVisit.trim(),
        current_symptoms: formData.currentSymptoms.trim(),
        health_conditions: formData.healthConditions,
        prior_surgeries: formData.priorSurgeries === "yes",
        prior_surgeries_description: formData.priorSurgeriesDescription.trim() || null,
        blood_clots: formData.bloodClots === "yes",
        prior_hormone_therapy: formData.priorHormoneTherapy === "yes",
        exercise_frequency: formData.exerciseFrequency,
        sleep_quality: formData.sleepQuality,
        stress_level: formData.stressLevel,
        tobacco_use: formData.tobaccoUse,
        alcohol_use: formData.alcoholUse,
        wellness_goals: formData.healthGoals.trim(),
        additional_notes: formData.additionalInfo.trim() || null,
        consent_self_pay: formData.consentFinancial,
        consent_medical_services: formData.consentMedical,
        consent_hipaa: formData.consentHipaa,
        signature: signatureBase64,
        submission_date: new Date().toISOString().split("T")[0],
      };

      const { data: insertData, error } = await supabase
        .from("patient_intake" as any)
        .insert(payload as any)
        .select("id")
        .single();

      if (error) throw error;

      // Trigger PDF generation + email delivery (non-blocking)
      if (insertData?.id) {
        supabase.functions.invoke("process-intake", {
          body: { intakeId: insertData.id },
        }).catch((e) => console.error("process-intake error:", e));
      }

      toast({ title: "Form submitted successfully." });
      navigate("/intake/thank-you", { state: { source } });
    } catch (err: any) {
      console.error("Intake form submission error:", err);
      toast({
        title: "Submission failed",
        description: err?.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* ---- shared sub-components ---- */

  const FieldError = ({ field }: { field: string }) =>
    errors[field] ? (
      <p className="text-red-600 text-xs mt-1">{errors[field]}</p>
    ) : null;

  const inputBase =
    "w-full min-w-0 box-border bg-[#F5F5F5] border border-[#E0E0E0] text-black px-3 py-3 text-sm outline-none focus:border-black transition min-h-[44px]";
  const labelBase = "block text-xs font-semibold uppercase tracking-wide text-black mb-1";
  const radioBase =
    "inline-flex items-center justify-center border border-[#E0E0E0] bg-[#F5F5F5] text-black text-sm px-4 py-3 cursor-pointer select-none transition min-h-[44px]";
  const radioChecked = "border-black bg-black text-white";
  const sectionHeading = "text-sm font-bold uppercase tracking-widest text-black mb-4 mt-8";

  /* ================================================================ */
  /*  PAGE 1 — Personal Information                                   */
  /* ================================================================ */

  const renderPage1 = () => (
    <div>
      <h2 className={sectionHeading} style={{ marginTop: 0 }}>
        Personal Information
      </h2>

      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 mb-4 items-start">
        <div id="field-firstName">
          <label className={labelBase}>First Name *</label>
          <input
            type="text"
            className={inputBase}
            value={formData.firstName}
            onChange={(e) => set("firstName", e.target.value)}
          />
          <FieldError field="firstName" />
        </div>
        <div id="field-lastName">
          <label className={labelBase}>Last Name *</label>
          <input
            type="text"
            className={inputBase}
            value={formData.lastName}
            onChange={(e) => set("lastName", e.target.value)}
          />
          <FieldError field="lastName" />
        </div>
      </div>

      {/* DOB / Sex */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-6 mb-4 items-start">
        <div id="field-dateOfBirth" className="min-w-0">
          <label className={labelBase}>Date of Birth *</label>
          <input
            type="date"
            className={inputBase}
            value={formData.dateOfBirth}
            onChange={(e) => set("dateOfBirth", e.target.value)}
            min="1900-01-01"
            max="2099-12-31"
          />
          <FieldError field="dateOfBirth" />
        </div>
        <div id="field-sex" className="min-w-0">
          <label className={labelBase}>Sex *</label>
          <div className="flex gap-2">
            {["Male", "Female", "Other"].map((opt) => (
              <button
                key={opt}
                type="button"
                className={`${radioBase} flex-1 ${formData.sex === opt ? radioChecked : ""}`}
                onClick={() => set("sex", opt)}
              >
                {opt}
              </button>
            ))}
          </div>
          <FieldError field="sex" />
        </div>
      </div>

      {/* Phone / Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 mb-4 items-start">
        <div id="field-phone">
          <label className={labelBase}>Phone *</label>
          <input
            type="tel"
            className={inputBase}
            value={formData.phone}
            maxLength={10}
            onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))}
          />
          <FieldError field="phone" />
        </div>
        <div id="field-email">
          <label className={labelBase}>Email *</label>
          <input
            type="email"
            className={inputBase}
            value={formData.email}
            onChange={(e) => set("email", e.target.value)}
          />
          <FieldError field="email" />
        </div>
      </div>

      {/* Address */}
      <h2 className={sectionHeading}>Address</h2>

      <div className="mb-4" id="field-street">
        <label className={labelBase}>Street *</label>
        <input
          type="text"
          className={inputBase}
          value={formData.street}
          onChange={(e) => set("street", e.target.value)}
        />
        <FieldError field="street" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        <div className="col-span-2 sm:col-span-1" id="field-city">
          <label className={labelBase}>City *</label>
          <input
            type="text"
            className={inputBase}
            value={formData.city}
            onChange={(e) => set("city", e.target.value)}
          />
          <FieldError field="city" />
        </div>
        <div id="field-state">
          <label className={labelBase}>State *</label>
          <select
            className={`${inputBase} appearance-none`}
            value={formData.state}
            onChange={(e) => set("state", e.target.value)}
          >
            <option value="">--</option>
            {US_STATES.map((s) => (
              <option key={s} value={s}>
                {s} - {STATE_NAMES[s]}
              </option>
            ))}
          </select>
          <FieldError field="state" />
        </div>
        <div id="field-zip">
          <label className={labelBase}>ZIP *</label>
          <input
            type="text"
            className={inputBase}
            value={formData.zip}
            maxLength={5}
            onChange={(e) => set("zip", e.target.value.replace(/\D/g, ""))}
          />
          <FieldError field="zip" />
        </div>
      </div>

      {/* Emergency Contact */}
      <h2 className={sectionHeading}>Emergency Contact</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 mb-4 items-start">
        <div id="field-emergencyContactName">
          <label className={labelBase}>Contact Name *</label>
          <input
            type="text"
            className={inputBase}
            value={formData.emergencyContactName}
            onChange={(e) => set("emergencyContactName", e.target.value)}
          />
          <FieldError field="emergencyContactName" />
        </div>
        <div id="field-emergencyContactPhone">
          <label className={labelBase}>Contact Phone *</label>
          <input
            type="tel"
            className={inputBase}
            value={formData.emergencyContactPhone}
            maxLength={10}
            onChange={(e) => set("emergencyContactPhone", e.target.value.replace(/\D/g, ""))}
          />
          <FieldError field="emergencyContactPhone" />
        </div>
      </div>
    </div>
  );

  /* ================================================================ */
  /*  PAGE 2 — Medical History                                        */
  /* ================================================================ */

  const renderPage2 = () => (
    <div>
      <h2 className={sectionHeading} style={{ marginTop: 0 }}>
        Medical History
      </h2>

      <div className="mb-4">
        <label className={labelBase}>Current Medications</label>
        <textarea
          className={`${inputBase} min-h-[80px]`}
          value={formData.currentMedications}
          onChange={(e) => set("currentMedications", e.target.value)}
          placeholder="List all current medications, supplements, and dosages..."
        />
      </div>

      <div className="mb-4">
        <label className={labelBase}>Known Allergies</label>
        <textarea
          className={`${inputBase} min-h-[80px]`}
          value={formData.knownAllergies}
          onChange={(e) => set("knownAllergies", e.target.value)}
          placeholder="List any known drug, food, or environmental allergies..."
        />
      </div>

      <div className="mb-4" id="field-reasonForVisit">
        <label className={labelBase}>Reason for Visit *</label>
        <textarea
          className={`${inputBase} min-h-[80px]`}
          value={formData.reasonForVisit}
          onChange={(e) => set("reasonForVisit", e.target.value)}
          placeholder="Why are you seeking care at Premier Vitality and Wellness?"
        />
        <FieldError field="reasonForVisit" />
      </div>

      <div className="mb-4" id="field-currentSymptoms">
        <label className={labelBase}>Current Symptoms or Concerns *</label>
        <textarea
          className={`${inputBase} min-h-[80px]`}
          value={formData.currentSymptoms}
          onChange={(e) => set("currentSymptoms", e.target.value)}
          placeholder="Describe any symptoms, concerns, or goals..."
        />
        <FieldError field="currentSymptoms" />
      </div>

      {/* Health conditions checkboxes */}
      <div className="mb-4" id="field-healthConditions">
        <label className={labelBase}>Current Health Conditions *</label>
        <p className="text-xs text-gray-500 mb-2">Select all that apply.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-start">
          {HEALTH_CONDITIONS.map((condition) => (
            <label
              key={condition}
              className={`flex items-center gap-3 border px-3 py-3 cursor-pointer select-none min-h-[44px] transition ${
                formData.healthConditions.includes(condition)
                  ? "border-black bg-black text-white"
                  : "border-[#E0E0E0] bg-[#F5F5F5] text-black"
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={formData.healthConditions.includes(condition)}
                onChange={() => toggleCondition(condition)}
              />
              <span className="text-sm">{condition}</span>
            </label>
          ))}
        </div>
        <FieldError field="healthConditions" />
      </div>

      {formData.healthConditions.includes("Other") && (
        <div className="mb-4" id="field-healthConditionsOther">
          <label className={labelBase}>Please Describe *</label>
          <textarea
            className={`${inputBase} min-h-[60px]`}
            value={formData.healthConditionsOther}
            onChange={(e) => set("healthConditionsOther", e.target.value)}
          />
          <FieldError field="healthConditionsOther" />
        </div>
      )}

      {/* Toggle questions */}
      <div className="mb-4" id="field-priorSurgeries">
        <label className={labelBase}>Prior Surgeries or Hospitalizations in Last 5 Years *</label>
        <div className="flex gap-2">
          {["yes", "no"].map((opt) => (
            <button
              key={opt}
              type="button"
              className={`${radioBase} flex-1 ${formData.priorSurgeries === opt ? radioChecked : ""}`}
              onClick={() => set("priorSurgeries", opt)}
            >
              {opt === "yes" ? "Yes" : "No"}
            </button>
          ))}
        </div>
        <FieldError field="priorSurgeries" />
      </div>

      {formData.priorSurgeries === "yes" && (
        <div className="mb-4" id="field-priorSurgeriesDescription">
          <label className={labelBase}>Please Describe *</label>
          <textarea
            className={`${inputBase} min-h-[60px]`}
            value={formData.priorSurgeriesDescription}
            onChange={(e) => set("priorSurgeriesDescription", e.target.value)}
          />
          <FieldError field="priorSurgeriesDescription" />
        </div>
      )}

      <div className="mb-4" id="field-bloodClots">
        <label className={labelBase}>Blood Clots or Clotting Disorder *</label>
        <div className="flex gap-2">
          {["yes", "no"].map((opt) => (
            <button
              key={opt}
              type="button"
              className={`${radioBase} flex-1 ${formData.bloodClots === opt ? radioChecked : ""}`}
              onClick={() => set("bloodClots", opt)}
            >
              {opt === "yes" ? "Yes" : "No"}
            </button>
          ))}
        </div>
        <FieldError field="bloodClots" />
      </div>

      <div className="mb-4" id="field-priorHormoneTherapy">
        <label className={labelBase}>Prior Hormone Therapy *</label>
        <div className="flex gap-2">
          {["yes", "no"].map((opt) => (
            <button
              key={opt}
              type="button"
              className={`${radioBase} flex-1 ${formData.priorHormoneTherapy === opt ? radioChecked : ""}`}
              onClick={() => set("priorHormoneTherapy", opt)}
            >
              {opt === "yes" ? "Yes" : "No"}
            </button>
          ))}
        </div>
        <FieldError field="priorHormoneTherapy" />
      </div>
    </div>
  );

  /* ================================================================ */
  /*  PAGE 3 — Lifestyle                                              */
  /* ================================================================ */

  const renderPage3 = () => (
    <div>
      <h2 className={sectionHeading} style={{ marginTop: 0 }}>
        Lifestyle
      </h2>

      <div className="mb-4" id="field-exerciseFrequency">
        <label className={labelBase}>Exercise Frequency *</label>
        <div className="flex flex-wrap gap-2">
          {["Daily", "3-5x per week", "1-2x per week", "Rarely", "Never"].map((opt) => (
            <button
              key={opt}
              type="button"
              className={`${radioBase} ${formData.exerciseFrequency === opt ? radioChecked : ""}`}
              onClick={() => set("exerciseFrequency", opt)}
            >
              {opt}
            </button>
          ))}
        </div>
        <FieldError field="exerciseFrequency" />
      </div>

      <div className="mb-4" id="field-sleepQuality">
        <label className={labelBase}>Sleep Quality *</label>
        <div className="flex flex-wrap gap-2">
          {["Excellent", "Good", "Fair", "Poor"].map((opt) => (
            <button
              key={opt}
              type="button"
              className={`${radioBase} flex-1 min-w-[80px] ${formData.sleepQuality === opt ? radioChecked : ""}`}
              onClick={() => set("sleepQuality", opt)}
            >
              {opt}
            </button>
          ))}
        </div>
        <FieldError field="sleepQuality" />
      </div>

      <div className="mb-4" id="field-stressLevel">
        <label className={labelBase}>
          Stress Level * <span className="ml-2 text-base font-normal">({formData.stressLevel}/10)</span>
        </label>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">1</span>
          <input
            type="range"
            min={1}
            max={10}
            value={formData.stressLevel}
            onChange={(e) => set("stressLevel", Number(e.target.value))}
            className="flex-1 h-2 accent-black"
            style={{ minHeight: 44 }}
          />
          <span className="text-xs text-gray-500">10</span>
        </div>
      </div>

      <div className="mb-4" id="field-tobaccoUse">
        <label className={labelBase}>Tobacco / Nicotine Use *</label>
        <div className="flex gap-2">
          {["Yes", "No", "Former"].map((opt) => (
            <button
              key={opt}
              type="button"
              className={`${radioBase} flex-1 ${formData.tobaccoUse === opt ? radioChecked : ""}`}
              onClick={() => set("tobaccoUse", opt)}
            >
              {opt}
            </button>
          ))}
        </div>
        <FieldError field="tobaccoUse" />
      </div>

      <div className="mb-4" id="field-alcoholUse">
        <label className={labelBase}>Alcohol Use *</label>
        <div className="flex gap-2">
          {["Never", "Occasionally", "Regularly"].map((opt) => (
            <button
              key={opt}
              type="button"
              className={`${radioBase} flex-1 ${formData.alcoholUse === opt ? radioChecked : ""}`}
              onClick={() => set("alcoholUse", opt)}
            >
              {opt}
            </button>
          ))}
        </div>
        <FieldError field="alcoholUse" />
      </div>

      <div className="mb-4" id="field-healthGoals">
        <label className={labelBase}>Primary Health and Wellness Goals *</label>
        <textarea
          className={`${inputBase} min-h-[80px]`}
          value={formData.healthGoals}
          onChange={(e) => set("healthGoals", e.target.value)}
          placeholder="What are you hoping to achieve?"
        />
        <FieldError field="healthGoals" />
      </div>

      <div className="mb-4">
        <label className={labelBase}>Anything Else Your Provider Should Know</label>
        <textarea
          className={`${inputBase} min-h-[80px]`}
          value={formData.additionalInfo}
          onChange={(e) => set("additionalInfo", e.target.value)}
          placeholder="Optional — any additional information..."
        />
      </div>
    </div>
  );

  /* ================================================================ */
  /*  PAGE 4 — Consent & Agreements                                   */
  /* ================================================================ */

  const canSubmit =
    formData.consentFinancial &&
    formData.consentMedical &&
    formData.consentHipaa &&
    signatureRef.current &&
    !signatureRef.current.isEmpty();

  const renderPage4 = () => {
    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return (
      <div>
        <h2 className={sectionHeading} style={{ marginTop: 0 }}>
          Patient Agreements &amp; Consent
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Please read each section carefully and check the box before signing.
        </p>

        {/* Section 1 — Financial */}
        <div className="mb-8" id="field-consentFinancial">
          <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-2">
            Section 1 — Self-Pay Financial Agreement
          </h3>
          <div className="border border-[#E0E0E0] p-4 max-h-[200px] md:max-h-[300px] overflow-y-auto bg-[#FAFAFA] mb-3">
            <p className="text-xs text-black whitespace-pre-line leading-relaxed">
              {FINANCIAL_AGREEMENT_TEXT}
            </p>
          </div>
          <label className="flex items-start gap-3 cursor-pointer select-none min-h-[44px]">
            <input
              type="checkbox"
              className="mt-1 w-5 h-5 min-w-[20px] accent-black"
              checked={formData.consentFinancial}
              onChange={(e) => set("consentFinancial", e.target.checked)}
            />
            <span className="text-xs text-black leading-snug">
              I have read, understand, and agree to the Self-Pay Financial Agreement above, including the
              no-refund policy, payment authorization, and binding arbitration clause.
            </span>
          </label>
          <FieldError field="consentFinancial" />
        </div>

        {/* Section 2 — Informed Consent */}
        <div className="mb-8" id="field-consentMedical">
          <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-2">
            Section 2 — Informed Consent for Medical Services (In-Person and Telehealth)
          </h3>
          <div className="border border-[#E0E0E0] p-4 max-h-[200px] md:max-h-[300px] overflow-y-auto bg-[#FAFAFA] mb-3">
            <p className="text-xs text-black whitespace-pre-line leading-relaxed">
              {INFORMED_CONSENT_TEXT}
            </p>
          </div>
          <label className="flex items-start gap-3 cursor-pointer select-none min-h-[44px]">
            <input
              type="checkbox"
              className="mt-1 w-5 h-5 min-w-[20px] accent-black"
              checked={formData.consentMedical}
              onChange={(e) => set("consentMedical", e.target.checked)}
            />
            <span className="text-xs text-black leading-snug">
              I have read and consent to receive medical services from Premier Vitality and Wellness LLC,
              including in-person and telemedicine visits, as described above.
            </span>
          </label>
          <FieldError field="consentMedical" />
        </div>

        {/* Section 3 — HIPAA */}
        <div className="mb-8" id="field-consentHipaa">
          <h3 className="text-xs font-bold uppercase tracking-widest text-black mb-2">
            Section 3 — HIPAA Notice of Privacy Practices
          </h3>
          <div className="border border-[#E0E0E0] p-4 max-h-[200px] md:max-h-[300px] overflow-y-auto bg-[#FAFAFA] mb-3">
            <p className="text-xs text-black whitespace-pre-line leading-relaxed">
              {HIPAA_NOTICE_TEXT}
            </p>
          </div>
          <label className="flex items-start gap-3 cursor-pointer select-none min-h-[44px]">
            <input
              type="checkbox"
              className="mt-1 w-5 h-5 min-w-[20px] accent-black"
              checked={formData.consentHipaa}
              onChange={(e) => set("consentHipaa", e.target.checked)}
            />
            <span className="text-xs text-black leading-snug">
              I acknowledge receipt of the Premier Vitality and Wellness LLC Notice of Privacy Practices and
              understand my rights regarding my protected health information.
            </span>
          </label>
          <FieldError field="consentHipaa" />
        </div>

        {/* Date */}
        <div className="mb-6">
          <label className={labelBase}>Date</label>
          <input type="text" className={inputBase} value={today} readOnly />
        </div>

        {/* Signature */}
        <div className="mb-6" id="field-signature">
          <label className={labelBase}>Signature *</label>
          <p className="text-xs text-gray-500 mb-2">
            Use your finger, stylus, or mouse to sign below.
          </p>
          <div className="border border-[#E0E0E0] bg-white" style={{ touchAction: "none" }}>
            <SignatureCanvas
              ref={signatureRef}
              penColor="black"
              canvasProps={{
                className: "w-full",
                style: { width: "100%", height: 200 },
              }}
            />
          </div>
          <button
            type="button"
            className="mt-2 text-xs underline text-gray-600 hover:text-black min-h-[44px] px-2"
            onClick={() => signatureRef.current?.clear()}
          >
            Clear Signature
          </button>
          <FieldError field="signature" />
        </div>

        {/* Submit */}
        <button
          type="button"
          disabled={submitting}
          onClick={handleSubmit}
          className="w-full bg-black text-white font-semibold text-sm uppercase tracking-widest py-4 min-h-[44px] hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting..." : "Submit Intake Form"}
        </button>
      </div>
    );
  };

  /* ================================================================ */
  /*  RENDER                                                          */
  /* ================================================================ */

  const progressPercent = (page / 4) * 100;

  return (
    <div
      className="bg-white text-black"
      style={{ fontFamily: "'Manrope', sans-serif", minHeight: "100dvh", overflowY: "auto" }}
    >
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-[#E0E0E0]">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <img
            src="/logo-emblem.svg"
            alt="Premier Vitality and Wellness LLC"
            className="h-10"
          />
          <div className="text-xs font-semibold uppercase tracking-wide text-black">
            Patient Intake Form
          </div>
          <button
            type="button"
            onClick={resetForm}
            className="text-xs underline text-gray-500 hover:text-black min-h-[44px] px-2"
          >
            Reset Form
          </button>
        </div>

        {/* Progress bar */}
        <div className="max-w-2xl mx-auto px-4 pb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">
              Page {page} of 4
            </span>
            <span className="text-xs text-gray-500">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#E0E0E0]">
            <div
              className="h-full bg-black transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form body */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {page === 1 && renderPage1()}
        {page === 2 && renderPage2()}
        {page === 3 && renderPage3()}
        {page === 4 && renderPage4()}

        {/* Navigation */}
        {page < 4 && (
          <div className="flex gap-3 mt-8">
            <button
              type="button"
              disabled={page === 1}
              onClick={goBack}
              className="flex-1 border border-black text-black font-semibold text-sm uppercase tracking-widest py-3 min-h-[44px] hover:bg-gray-100 transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              type="button"
              onClick={goNext}
              className="flex-1 bg-black text-white font-semibold text-sm uppercase tracking-widest py-3 min-h-[44px] hover:bg-gray-900 transition"
            >
              Next
            </button>
          </div>
        )}

        {page === 4 && (
          <div className="mt-4">
            <button
              type="button"
              onClick={goBack}
              className="w-full border border-black text-black font-semibold text-sm uppercase tracking-widest py-3 min-h-[44px] hover:bg-gray-100 transition"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntakeForm;

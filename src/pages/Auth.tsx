import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import LegalModal from "@/components/LegalModal";
import { useAuth } from "@/hooks/useAuth";
import { getDeviceFingerprint, getDeviceName } from "@/lib/deviceFingerprint";
import { sanitizeName, sanitizePhone, sanitizeEmail } from "@/lib/sanitize";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [legalModal, setLegalModal] = useState<"terms" | "disclaimer" | "privacy" | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 2FA state
  const [needs2FA, setNeeds2FA] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [maskedPhone, setMaskedPhone] = useState("");
  const [pendingSession, setPendingSession] = useState<any>(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    if (user && !needs2FA) navigate("/portal");
  }, [user, navigate, needs2FA]);

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "signup") setIsLogin(false);
    const prefillEmail = searchParams.get("email");
    if (prefillEmail) setEmail(prefillEmail);
  }, [searchParams]);

  const check2FA = async (userId: string, session: any) => {
    const fingerprint = getDeviceFingerprint();
    try {
      const res = await supabase.functions.invoke("send-2fa-code", {
        body: { userId, deviceFingerprint: fingerprint },
      });

      if (res.error) throw res.error;
      const data = res.data;

      if (data.trusted) {
        // Device is trusted or 2FA not applicable, proceed
        return false;
      }

      // Need 2FA
      setMaskedPhone(data.maskedPhone);
      setPendingSession(session);
      setNeeds2FA(true);
      return true;
    } catch (err: any) {
      console.error("2FA check failed, allowing login:", err);
      return false;
    }
  };

  const handleVerify2FA = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await supabase.functions.invoke("verify-2fa-code", {
        body: {
          code: verificationCode,
          deviceFingerprint: getDeviceFingerprint(),
          deviceName: getDeviceName(),
        },
      });

      if (res.error) throw res.error;

      if (res.data.valid) {
        setNeeds2FA(false);
        // Check admin role
        const { data: isAdmin } = await supabase.rpc("has_role", {
          _user_id: pendingSession.user.id,
          _role: "admin",
        });
        navigate(isAdmin ? "/admin" : "/portal");
      } else {
        setError("Invalid or expired code. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Verification failed");
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();

    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      if (data.user && data.session) {
        const needs = await check2FA(data.user.id, data.session);
        if (!needs) {
          const { data: isAdmin } = await supabase.rpc("has_role", {
            _user_id: data.user.id,
            _role: "admin",
          });
          navigate(isAdmin ? "/admin" : "/portal");
        }
      }
    } else {
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: { first_name: firstName, last_name: lastName, phone, sms_consent: agreed },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) {
        setError(error.message);
      } else {
        // Record terms acceptance timestamp
        if (signUpData?.user?.id) {
          await supabase.from("profiles").update({ terms_accepted_at: new Date().toISOString() }).eq("user_id", signUpData.user.id);
          // Non-blocking Slack signup notification
          supabase.functions.invoke("slack-notify", {
            body: { type: "signup", payload: { email, first_name: firstName, last_name: lastName } },
          }).catch((e) => console.error("Slack signup notify error:", e));
        }
        setMessage("Check your email to confirm your account.");
        navigate("/portal");
      }
    }
    setLoading(false);
  };

  const inputClass = "h-11 text-sm text-white placeholder:text-[#6E7180] focus:ring-1 focus:ring-[#AB8F5F] focus:border-[#AB8F5F] transition-colors";
  const inputStyle: React.CSSProperties = { background: "#0a0a0a", border: "1px solid #40424D" };

  // 2FA verification screen
  if (needs2FA) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 md:px-6" style={{ background: "radial-gradient(ellipse 80% 70% at 50% 40%, #1E1E24 0%, #000000 70%)" }}>
        <div className="w-full max-w-sm p-8 rounded-lg" style={{ background: "rgba(30,30,36,0.8)", border: "1px solid #40424D", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}>
          <div className="flex flex-col items-center mb-10">
            <img src="/logo-emblem.svg" alt="Premier Vitality & Wellness" className="h-12 w-auto mb-4" style={{ filter: "brightness(0) saturate(100%) invert(72%) sepia(28%) saturate(600%) hue-rotate(5deg)" }} />
            <h1 className="text-2xl font-light tracking-wide text-white">
              Verify Your Identity
            </h1>
            <p className="text-xs tracking-[0.2em] uppercase text-[#9DA2B3] mt-2 text-center">
              We sent a code to {maskedPhone}
            </p>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs tracking-wider uppercase text-[#9DA2B3]">
                Verification Code
              </Label>
              <Input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className={`${inputClass} text-center text-lg tracking-[0.5em]`}
                style={inputStyle}
              />
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <button
              onClick={handleVerify2FA}
              disabled={loading || verificationCode.length !== 6}
              className="w-full h-11 text-xs tracking-[0.2em] uppercase text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#AB8F5F]/10"
              style={{ border: "1px solid rgba(171,143,95,0.4)" }}
            >
              {loading ? "Verifying..." : "Verify"}
            </button>

            <button
              onClick={() => {
                setNeeds2FA(false);
                setPendingSession(null);
                supabase.auth.signOut();
              }}
              className="text-xs tracking-wider uppercase text-[#6E7180] hover:text-white transition-colors block mx-auto"
            >
              Cancel &amp; sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 md:px-6 py-16" style={{ background: "radial-gradient(ellipse 80% 70% at 50% 40%, #1E1E24 0%, #000000 70%)" }}>
      <div className="w-full max-w-sm p-8 rounded-lg" style={{ background: "rgba(30,30,36,0.8)", border: "1px solid #40424D", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}>
        <div className="flex flex-col items-center mb-10">
          <img src="/logo-emblem.svg" alt="Premier Vitality & Wellness" className="h-12 w-auto mb-4" style={{ filter: "brightness(0) saturate(100%) invert(72%) sepia(28%) saturate(600%) hue-rotate(5deg)" }} />
          <h1 className="text-2xl font-light tracking-wide text-white">
            Patient Portal
          </h1>
          <p className="text-xs tracking-[0.2em] uppercase text-[#9DA2B3] mt-2">
            {isLogin ? "Sign in to your account" : "Create your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs tracking-wider uppercase text-[#9DA2B3]">First Name</Label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(sanitizeName(e.target.value))}
                    maxLength={100}
                    required={!isLogin}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs tracking-wider uppercase text-[#9DA2B3]">Last Name</Label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(sanitizeName(e.target.value))}
                    maxLength={100}
                    required={!isLogin}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs tracking-wider uppercase text-[#9DA2B3]">Phone Number</Label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(sanitizePhone(e.target.value))}
                  placeholder="+1 (555) 123-4567"
                  required={!isLogin}
                  className={inputClass}
                  style={inputStyle}
                />
                <p className="text-[10px] text-[#6E7180]">
                  Required for two-factor authentication &amp; account security.
                </p>
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label className="text-xs tracking-wider uppercase text-[#9DA2B3]">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(sanitizeEmail(e.target.value))}
              maxLength={255}
              required
              className={inputClass}
              style={inputStyle}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs tracking-wider uppercase text-[#9DA2B3]">Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className={inputClass}
              style={inputStyle}
            />
          </div>

          {!isLogin && (
            <div className="flex items-start space-x-3">
              <Checkbox
                id="legal-agree"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked === true)}
                className="mt-0.5 border-[#40424D] data-[state=checked]:bg-[#AB8F5F] data-[state=checked]:border-[#AB8F5F]"
              />
              <label htmlFor="legal-agree" className="text-[11px] text-[#9DA2B3] leading-relaxed cursor-pointer">
                I acknowledge that peptide therapy carries inherent risks and I voluntarily assume all risks associated with treatment. I have read and agree to the{" "}
                <button type="button" onClick={() => setLegalModal("terms")} className="underline text-foreground hover:text-primary transition-colors">
                  Terms of Service
                </button>
                ,{" "}
                <button type="button" onClick={() => setLegalModal("disclaimer")} className="underline text-foreground hover:text-primary transition-colors">
                  Medical Disclaimer
                </button>
                , and{" "}
                <button type="button" onClick={() => setLegalModal("privacy")} className="underline text-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </button>
                , including the limitation of liability and assumption of risk provisions. I consent to receive SMS messages from Premier Vitality &amp; Wellness including security codes, order notifications, wellness reminders, and refill alerts. Message frequency varies. Msg &amp; data rates may apply. Reply STOP to cancel.
              </label>
            </div>
          )}

          {error && <p className="text-destructive text-sm font-body">{error}</p>}
          {message && <p className="text-primary text-sm font-body">{message}</p>}

          <button
            type="submit"
            disabled={loading || (!isLogin && !agreed)}
            className="w-full h-11 text-xs tracking-[0.2em] uppercase text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#AB8F5F]/10"
            style={{ border: "1px solid rgba(171,143,95,0.4)" }}
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* Google OAuth divider + button */}
        <div className="mt-6 flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: "#40424D" }} />
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#6E7180]">or</span>
          <div className="flex-1 h-px" style={{ background: "#40424D" }} />
        </div>

        <button
          type="button"
          onClick={async () => {
            setError("");
            const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback` } });
            if (error) setError(error.message || "Google sign-in failed");
          }}
          className="w-full mt-4 h-11 text-white text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-3 hover:bg-white/5 transition-colors"
          style={{ border: "1px solid #40424D" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" className="flex-shrink-0">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {isLogin ? "Sign in with Google" : "Sign up with Google"}
        </button>

        <div className="mt-6 text-center space-y-3">
          {isLogin && (
            <button
              onClick={async () => {
                if (!email) { setError("Enter your email first."); return; }
                setError(""); setMessage(""); setLoading(true);
                const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
                  redirectTo: `${window.location.origin}/reset-password`,
                });
                if (error) setError(error.message);
                else setMessage("Check your email for a password reset link.");
                setLoading(false);
              }}
              className="text-xs tracking-wider uppercase text-[#6E7180] hover:text-white transition-colors block mx-auto"
            >
              Forgot password?
            </button>
          )}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(""); setMessage(""); }}
            className="text-xs tracking-wider uppercase text-[#6E7180] hover:text-white transition-colors"
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        <div className="mt-8 text-center">
          <a href="/" className="text-xs tracking-wider uppercase text-[#6E7180] hover:text-white transition-colors">
            ← Back to website
          </a>
        </div>
      </div>

      {/* Legal modals */}
      <LegalModal open={legalModal === "terms"} onClose={() => setLegalModal(null)} title="Terms of Service">
        <p><strong className="text-foreground">Last Updated:</strong> April 1, 2026</p>
        <p className="uppercase font-medium text-foreground">PLEASE READ THESE TERMS OF SERVICE CAREFULLY BEFORE ACCESSING OR USING OUR SITE. By registering for and/or accessing and using the Site or Services, you agree to be bound by these Terms of Service and all other terms and policies that appear on the Site or Services. YOU MAY NOT ACCESS OR USE THE SERVICES OR ACCEPT THESE TERMS OF SERVICE IF YOU ARE NOT AT LEAST 18 YEARS OF AGE. IF YOU DO NOT AGREE WITH ALL OF THE PROVISIONS OF THESE TERMS OF SERVICE, DO NOT ACCESS AND/OR USE THE SERVICES.</p>
        <p className="uppercase font-medium text-foreground">ARBITRATION NOTICE: Except for certain kinds of disputes described in Section 12, you agree that disputes arising under these Terms will be resolved by binding, individual arbitration, and BY ACCEPTING THESE TERMS, YOU AND PREMIER VITALITY AND WELLNESS LLC ARE EACH WAIVING THE RIGHT TO A TRIAL BY JURY OR TO PARTICIPATE IN ANY CLASS ACTION OR REPRESENTATIVE PROCEEDING. YOU AGREE TO GIVE UP YOUR RIGHT TO GO TO COURT to assert or defend your rights under this contract (except for matters that may be taken to small claims court). Your rights will be determined by a NEUTRAL ARBITRATOR and NOT a judge or jury.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">1. Overview</h2>
        <p>Premier Vitality and Wellness LLC ("Premier Vitality and Wellness LLC," "we," "us," or "our") owns and operates the website located at premiervitalityandwellness.com (the "Site"). Premier Vitality and Wellness LLC offers the Site, including all information and content therewith (collectively, the "Content"), products available for purchase (the "Products") and various services (the "Services") to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated or referenced herein (the "Terms of Service") and compliance with all applicable laws and regulations. Your use of certain features or components of our Site, access to certain Services or your ability to purchase Products may be limited to those users that have registered an account with us.</p>
        <p>Any new features, tools or services which are added to the current Site shall also be subject to these Terms of Service. You can review the most current version of the Terms of Service at any time on this page. We reserve the right to update, change or replace any part of these Terms of Service by posting updates and/or changes to our Site. Any such changes will be effective as of the date of posting. It is your responsibility to check this page periodically for changes. Your continued use of or access to the Site (including the Content) or purchase of any Services or Products following the posting of any changes constitutes your acceptance of those changes.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">2. Services</h2>
        <p>Premier Vitality and Wellness LLC provides physician-directed wellness and optimization services including but not limited to peptide therapy, hormone optimization, biomarker analysis, nutritional counseling, and related medical services. Services are provided both in-person at our Arizona location and via telehealth/telemedicine. Our Services are currently available only to individuals who are at least 18 years of age.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">2a. Prescription Fulfillment Services</h2>
        <p>We may provide access to prescription fulfillment services offered by licensed compounding pharmacies (the "Pharmacies"). You can expect to receive your prescription drugs from one of our partner pharmacies. Premier Vitality and Wellness LLC does not recommend or endorse any specific prescription drug or pharmacy. PREMIER VITALITY AND WELLNESS LLC MAKES NO REPRESENTATIONS OR WARRANTIES ABOUT THE SUITABILITY, RELIABILITY, OR TIMELINESS OF THE PHARMACIES OR THE PRESCRIPTION PRODUCTS AND IS NOT RESPONSIBLE FOR ANY OF THE SERVICES PROVIDED BY THE PHARMACIES.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">2b. Healthcare Services — In-Person and Telehealth</h2>
        <p>Premier Vitality and Wellness LLC provides physician-directed medical services both in-person and via telehealth. By receiving in-person medical services at Premier Vitality and Wellness LLC, you acknowledge and agree that: (a) You are voluntarily presenting yourself for evaluation, examination, and treatment at our facility located at 1870 W Frye Rd Ste 1, Chandler, AZ 85224. (b) In-person care involves direct physical examination, potential blood draws, injections, and other procedures as determined medically appropriate by your Provider. (c) You have disclosed all relevant medical history, medications, allergies, and conditions to your Provider prior to receiving care. (d) You understand that no guarantee of outcome is made for any treatment or procedure. (e) You consent to the presence of clinical staff necessary to assist in your care. (f) You understand that photography or imaging of treatment areas may be taken for clinical documentation purposes with your verbal consent at time of service.</p>
        <p>For telehealth services, you consent to receive medical services via telemedicine technology including video conferencing, telephone consultation, and secure messaging. You understand that: (a) The same confidentiality laws that apply to in-person care apply to telehealth interactions. (b) You may withdraw consent to telehealth at any time without affecting your right to in-person care. (c) Potential risks include technical interruptions and, in rare circumstances, security breaches. (d) Your Provider may determine that in-person care is required for your specific situation. (e) You are responsible for ensuring a private, secure environment on your end during telehealth consultations.</p>
        <p className="uppercase font-medium text-foreground">IF YOU THINK YOU MAY HAVE A MEDICAL EMERGENCY, CALL YOUR DOCTOR, GO TO THE EMERGENCY DEPARTMENT, OR CALL 911 IMMEDIATELY.</p>
        <p>By accepting these Terms of Service, you acknowledge and agree that the Providers may send you electronic messages containing results, reports, instructions, and/or advice related to your diagnosis and/or treatment. You are responsible for checking and responding to these messages.</p>
        <p className="uppercase">PREMIER VITALITY AND WELLNESS LLC MAKES NO REPRESENTATIONS OR WARRANTIES ABOUT THE ACCURACY, SUITABILITY, RELIABILITY OR TIMELINESS OF THE DIAGNOSIS AND/OR TREATMENT PROVIDED BY THE PROVIDERS.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">3. Products</h2>
        <p>We may offer certain Products, including prescription products, and non-prescription products such as over-the-counter medications, vitamins, dietary supplements, and wellness products. All prices are in U.S. Dollars. All Products are non-refundable.</p>
        <p>You understand and agree that all Products should be used strictly in accordance with their instructions, precautions and guidelines and in accordance with applicable laws. Use of the Content related to a Product is not meant to serve as a substitute for professional medical advice. Please consult with your Provider regarding the use of any Product before using them.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">3a. Prescription Products</h2>
        <p>Certain Products require a valid prescription by a licensed healthcare provider. You may not purchase a Prescription Product unless and until you have completed a consultation with a Provider and such Provider has provided a written prescription. Prescriptions fulfilled by the Pharmacies may not use child-resistant packaging and Prescription Products may not be dispensed in child-resistant containers.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">4. Self-Pay Financial Agreement</h2>
        <p><strong className="text-foreground">INSURANCE NOT ACCEPTED; YOUR RESPONSIBILITY FOR PAYMENT.</strong> I understand and acknowledge that Premier Vitality and Wellness LLC and its Providers are not paid or reimbursed by managed care plans, Medicare, Medicaid or other government health care programs, or other third-party payors. Premier Vitality and Wellness LLC does not accept insurance for such services. I will be billed directly and shall be personally responsible for payment, regardless of whether I am or will be reimbursed by a managed care plan or other third-party payer.</p>
        <p>I agree to make timely payments for all health care, laboratory and pharmacy services that are provided to me. By providing my payment information, I authorize Premier Vitality and Wellness LLC to charge the credit card or other payment method on file for all items and/or services I receive or are scheduled to receive from the Provider, the laboratories and the pharmacies.</p>
        <p>I understand that the cost of services, including labs and medications, are final and not refundable. This is because the cost of treatment is for professional medical services (including any blood draws) which are fully rendered at point of care. Pharmacy rules prohibit the return of medications for reimbursement because medications are packaged for you and cannot be used for another patient. I understand I will not be able to receive refunds for treatments and for medications, even if they are unused. I understand that Premier Vitality and Wellness LLC reserves the right to discontinue service if I am delinquent on any payments.</p>
        <p>Accepted payment methods include credit card, debit card, and ACH bank transfer. Cash payments are not accepted. Appointments cancelled with less than 24 hours notice may be subject to a cancellation fee.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">5. Billing</h2>
        <p>You agree to provide current, complete and accurate purchase and account information for all purchases. You agree to promptly update your account and other information, including your email address and credit card numbers and expiration dates, so that we can complete your transactions and contact you as needed. You will be responsible for any applicable sales, use, duty, customs or other governmental taxes, levies or fees due with respect to your purchase of Products or Services.</p>
        <p>Some of our Products and/or Services may be available on a subscription basis. For these Products and Services, your payment account will be automatically charged as described for that Product or Service. You may cancel a subscription thirty days before the next monthly processing date of your subscription by contacting Premier Vitality and Wellness LLC at admin@premiervitalityandwellness.com with your cancellation request.</p>
        <p>Premier Vitality and Wellness LLC accepts payment from HSA/FSA accounts using credit or debit cards commonly associated with these types of accounts. Premier Vitality and Wellness LLC makes no warranty, expressed or implied, that your payment will be accepted by your HSA/FSA administrator as a valid expense for the account. Premier Vitality and Wellness LLC will provide you with the receipts needed for submission to your account administrator and your Provider will provide a Letter of Medical Necessity if requested.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">6. Your Obligations; Your Representations and Warranties</h2>
        <p>You are solely responsible for maintaining the security of your account and are responsible for all activities that occur under your account. You agree to immediately notify us in writing of any unauthorized use of this Site or any other breaches of security.</p>
        <p>You shall submit only truthful, complete, and accurate information through the Site. You are prohibited from using the Site or its Content: (a) for any unlawful purpose; (b) to solicit others to perform or participate in any unlawful acts; (c) to violate any international, federal, state, or local regulations, rules, laws, or ordinances; (d) to infringe upon or violate our intellectual property rights or the intellectual property rights of others; (e) to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability; (f) to submit false or misleading information; (g) to upload or transmit viruses or any other type of malicious code; (h) to collect or track the personal information of others; (i) to spam, phish, pharm, pretext, spider, crawl, or scrape; (j) for any obscene or immoral purpose; or (k) to interfere with or circumvent the security features of the Site or any related website or the Internet.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">7. Third Parties; Third-Party Links</h2>
        <p>Certain Content, Products and Services available on the Site may include materials from third parties. Premier Vitality and Wellness LLC has no responsibility for the accuracy, suitability or reliability of such third-party Content. Third-party links on the Site may direct you to third-party websites not affiliated with us. We are not responsible for examining or evaluating the content or accuracy of such third-party websites. You understand and agree that we will not be liable for any harm or damages related to the purchase or use of goods, services, resources, or content from any third party.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">8. Intellectual Property</h2>
        <p>Subject to these Terms of Service, you are hereby granted a non-transferable, non-exclusive, limited, revocable license to use the software and access the Content provided to you through the Site. All Content displayed on our Site is the exclusive property of Premier Vitality and Wellness LLC. Except as permitted herein, any use of the Content, including reproduction, modification, distribution, republishing, transmission, display or performance is strictly prohibited.</p>
        <p>You grant Premier Vitality and Wellness LLC a worldwide, perpetual, non-exclusive, irrevocable, royalty-free license to use, reproduce, distribute, modify, adapt, publish, translate, and create derivative works from any content you submit to the Site. Any ideas, suggestions, or feedback you submit to us will be the exclusive property of Premier Vitality and Wellness LLC.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">9. Termination</h2>
        <p>Premier Vitality and Wellness LLC may terminate your access to the Site or any of the Services at any time and for any reason, including your breach of any of the Terms of Service. Upon termination, your access to the Site and the terminated Services will immediately cease but you will remain liable for all amounts due up to and including the date of termination. The disclaimers, limitations of liabilities, releases and waivers set forth in these Terms of Service shall survive any such termination.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">10. Disclaimer of Warranties</h2>
        <p className="uppercase">ALL SERVICES, THE SITE AND CONTENT ARE PROVIDED "AS IS," "AS AVAILABLE," AND "WITH ALL FAULTS." PREMIER VITALITY AND WELLNESS LLC DISCLAIMS ALL WARRANTIES AND CONDITIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED, STATUTORY OR OTHERWISE, INCLUDING, WITHOUT LIMITATION, ANY IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, DURABILITY, TITLE, OR NON-INFRINGEMENT. PREMIER VITALITY AND WELLNESS LLC DOES NOT WARRANT OR GUARANTEE THAT THE CONTENT, PRODUCTS, SERVICES OR THE SITE ARE OR WILL BE ACCURATE, COMPLETE, RELIABLE, CURRENT OR ERROR-FREE.</p>
        <p className="uppercase">YOU AGREE THAT WHEN YOU VIEW, DOWNLOAD OR OTHERWISE OBTAIN CONTENT FROM OR THROUGH THE SITE, OR BY USING THE SERVICES OR A PRODUCT, YOU DO SO AT YOUR OWN RISK.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">11. Limitation of Liability</h2>
        <p className="uppercase">PREMIER VITALITY AND WELLNESS LLC, INCLUDING ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS OR REPRESENTATIVES (COLLECTIVELY, THE "PREMIER VITALITY AND WELLNESS LLC PARTIES") WILL NOT BE LIABLE FOR ANY DAMAGES OF ANY KIND ARISING OUT OF OR IN CONNECTION WITH THE USE OF THE SITE, THE CONTENT, OR ANY OF THE SERVICES OR PRODUCTS. TO THE FULLEST EXTENT PERMITTED BY LAW, THE PREMIER VITALITY AND WELLNESS LLC PARTIES SHALL NOT HAVE ANY LIABILITY FOR ANY INDIRECT, SPECIAL, EXEMPLARY, INCIDENTAL OR CONSEQUENTIAL DAMAGES, INCLUDING DAMAGES FOR LOSS OF PROFITS, USE, DATA OR OTHER INTANGIBLES. THE PREMIER VITALITY AND WELLNESS LLC PARTIES' LIABILITY SHALL NOT EXCEED THE AMOUNT YOU HAVE PAID FOR PRODUCTS AND SERVICES IN THE SIX (6) MONTHS PRECEDING THE DATE OF THE EVENT THAT IS THE BASIS FOR THE CLAIM.</p>
        <p className="uppercase">YOU AGREE THAT YOU MUST BRING ANY CLAIMS ARISING IN CONNECTION WITH YOUR USE OF THE SITE OR CONTENT WITHIN ONE (1) YEAR OF THE DATE OF THE EVENT GIVING RISE TO SUCH ACTION.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">12. Indemnification</h2>
        <p>You agree to indemnify, defend and hold harmless the Premier Vitality and Wellness LLC Parties, and the Pharmacies and Providers, from any and all third party suits, actions, claims, proceedings, damages, settlements, judgments, injuries, liabilities, obligations, losses, risks, costs, and expenses (including, without limitation, attorneys' fees and litigation expenses) relating to or arising from your use of the Site, or your breach of these Terms of Service, or your violation of any law or the rights of a third party.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">13. Dispute Resolution and Arbitration</h2>
        <p><strong className="text-foreground">13a. Generally.</strong> In the interest of resolving disputes between you and Premier Vitality and Wellness LLC in the most expedient and cost effective manner, and except as described in Section 13b, you and Premier Vitality and Wellness LLC agree that every dispute arising in connection with these terms will be resolved by binding arbitration. Arbitration is less formal than a lawsuit in court. Arbitration uses a neutral arbitrator instead of a judge or jury, may allow for more limited discovery than in court, and can be subject to very limited review by courts. Arbitrators can award the same damages and relief that a court can award. This agreement to arbitrate disputes includes all claims arising out of or relating to any aspect of these terms, whether based in contract, tort, statute, fraud, misrepresentation, or any other legal theory, and regardless of whether a claim arises during or after the termination of these terms. YOU AND PREMIER VITALITY AND WELLNESS LLC ARE EACH WAIVING THE RIGHT TO A TRIAL BY JURY OR TO PARTICIPATE IN A CLASS ACTION.</p>
        <p><strong className="text-foreground">13b. Exceptions.</strong> Nothing in these terms will be deemed to waive, preclude, or otherwise limit the right of either party to: (a) bring an individual action in small claims court; (b) pursue an enforcement action through the applicable federal, state, or local agency if that action is available; (c) seek injunctive relief in a court of law in aid of arbitration; or (d) file suit in a court of law to address an intellectual property infringement claim.</p>
        <p><strong className="text-foreground">13c. Arbitrator.</strong> Any arbitration between you and Premier Vitality and Wellness LLC will be settled under the Federal Arbitration Act and administered by the American Arbitration Association ("AAA") under its Consumer Arbitration Rules (collectively, "AAA Rules") as modified by these terms. The arbitration will be before a single arbitrator. The AAA rules and filing forms are available online at www.adr.org, by calling the AAA at 1-800-778-7879, or by contacting Premier Vitality and Wellness LLC. The arbitrator has exclusive authority to resolve any dispute relating to the interpretation, applicability, or enforceability of this binding arbitration agreement.</p>
        <p><strong className="text-foreground">13d. Notice of Arbitration; Process.</strong> A party who intends to seek arbitration must first send a written notice of the dispute to the other party by certified U.S. Mail or by Federal Express (signature required) or, only if that other party has not provided a current physical address, then by electronic mail ("Notice of Arbitration"). Premier Vitality and Wellness LLC's address for Notice is: 1870 W Frye Rd Ste 1, Chandler, AZ 85224. The Notice of Arbitration must: (a) describe the nature and basis of the claim or dispute; and (b) set forth the specific relief sought ("Demand"). The parties will make good faith efforts to resolve the claim directly, but if the parties do not reach an agreement to do so within 30 days after the Notice of Arbitration is received, you or Premier Vitality and Wellness LLC may commence an arbitration proceeding. All arbitration proceedings between the parties will be confidential unless otherwise agreed by the parties in writing.</p>
        <p><strong className="text-foreground">13e. Fees.</strong> If you commence arbitration in accordance with these Terms, Premier Vitality and Wellness LLC will reimburse you for your payment of the filing fee, unless your claim is for more than US$10,000, in which case the payment of any fees will be decided by the AAA Rules. Any arbitration hearing will take place at a location to be agreed upon in Maricopa County, Arizona, but if the claim is for US$10,000 or less, you may choose whether the arbitration will be conducted: (a) solely on the basis of documents submitted to the arbitrator; (b) through a non-appearance based telephone hearing; or (c) by an in-person hearing in Maricopa County, Arizona.</p>
        <p><strong className="text-foreground">13f. No Class Actions.</strong> YOU AND PREMIER VITALITY AND WELLNESS LLC AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING. Further, unless both you and Premier Vitality and Wellness LLC agree otherwise, the arbitrator may not consolidate more than one person's claims, and may not otherwise preside over any form of a representative or class proceeding.</p>
        <p><strong className="text-foreground">13g. Enforceability.</strong> If Section 13f or the entirety of this Section 13 is found to be unenforceable, then the entirety of this Section 13 will be null and void and, in that case, the exclusive jurisdiction and venue described in Section 14 will govern any action arising out of or related to these terms.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">14. Governing Law</h2>
        <p>These Terms of Service shall be governed by and construed in accordance with the laws of the State of Arizona.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">15. Privacy Policy</h2>
        <p>Premier Vitality and Wellness LLC respects your privacy. Please review our <a href="/privacy" className="underline text-foreground hover:text-primary transition-colors">Privacy Policy</a> for information regarding how we may collect, use and disclose your personal information. The Privacy Policy is hereby incorporated by reference into these Terms of Service.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">16. Electronic Communications</h2>
        <p>In connection with your access or use of the Services, you hereby consent to receive electronic communications from us, the Providers and the Pharmacies, whether through email, through the Site, or other electronic means. You hereby agree that such electronic communications will satisfy any legal requirement that such communications be in writing.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">17. General Terms</h2>
        <p>The headings used in this agreement are included for convenience only and will not limit or otherwise affect these Terms of Service. In the event that any provision of these Terms of Service is determined to be unlawful, void or unenforceable, such provision shall nonetheless be enforceable to the fullest extent permitted by applicable law, and the unenforceable portion shall be deemed to be severed from these Terms of Service. The failure of us to exercise or enforce any right or provision of these Terms of Service shall not constitute a waiver of such right or provision. These Terms of Service shall not create any partnership, joint venture, employment, or other agency relationship between you and Premier Vitality and Wellness LLC. Premier Vitality and Wellness LLC may transfer its contractual rights and obligations set forth in these Terms of Service to any affiliate or to another third party in the event that some or all of Premier Vitality and Wellness LLC's business is transferred to a third party by way of merger, sale of its assets or otherwise. You may not assign any of your rights hereunder.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">18. Digital Millennium Copyright Act</h2>
        <p>If you are a copyright owner or an agent thereof and believe that any content infringes upon your copyrights, you may submit a notification pursuant to the Digital Millennium Copyright Act ("DMCA") by providing us with the following information in writing: (a) a physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed; (b) identification of the copyrighted work claimed to have been infringed; (c) identification of the material that is claimed to be infringing and information reasonably sufficient to permit Premier Vitality and Wellness LLC to locate the material; (d) information reasonably sufficient to permit Premier Vitality and Wellness LLC to contact you, such as an address, telephone number, and email; (e) a statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law; and (f) a statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed. You may direct copyright infringement notifications to us at admin@premiervitalityandwellness.com.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">19. Contact Information</h2>
        <p>Questions about the Terms of Service should be sent to:</p>
        <p>Premier Vitality and Wellness LLC<br />
        1870 W Frye Rd Ste 1<br />
        Chandler, AZ 85224<br />
        Phone: (480) 234-9108<br />
        Email: admin@premiervitalityandwellness.com</p>
      </LegalModal>

      <LegalModal open={legalModal === "disclaimer"} onClose={() => setLegalModal(null)} title="Medical Disclaimer &amp; Informed Consent">
        <p><strong className="text-foreground">Last Updated:</strong> April 1, 2026</p>
        <p className="uppercase font-medium text-foreground">AUTHORIZATION AND CONSENT TO RECEIVE MEDICAL SERVICES (IN-PERSON AND TELEHEALTH)</p>
        <p>The purpose of this document is to obtain your informed consent to receive medical services from Premier Vitality and Wellness LLC, including both in-person care at our facility and telehealth/telemedicine consultations.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">1. Not Emergency Care</h2>
        <p>IF YOU ARE EXPERIENCING A MEDICAL EMERGENCY, CALL 911 OR GO TO THE NEAREST EMERGENCY ROOM IMMEDIATELY. Premier Vitality and Wellness LLC does not provide emergency medical services. Our services are elective wellness and optimization services and are not intended to replace your primary care physician, emergency services, or specialist care for acute medical conditions.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">2. Scope of Services</h2>
        <p>Premier Vitality and Wellness LLC provides physician-directed wellness and optimization services including but not limited to: peptide therapy, hormone optimization, biomarker analysis, nutritional counseling, and related medical services. These services are elective in nature.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">3. In-Person Medical Services Consent</h2>
        <p>By receiving in-person medical services at Premier Vitality and Wellness LLC (located at 1870 W Frye Rd Ste 1, Chandler, AZ 85224), you acknowledge and consent to the following:</p>
        <p><strong className="text-foreground">Nature of In-Person Care:</strong> During in-person visits, your medical history, examinations, and laboratory tests will be reviewed and discussed with your Provider. Physical examination of you will take place. Clinical staff may be present in the examination room to assist in your care. Procedures such as blood draws, injections, and other treatments may be performed as determined medically appropriate by your Provider.</p>
        <p><strong className="text-foreground">Clinical Documentation:</strong> Photography or imaging of treatment areas may be taken for clinical documentation purposes with your verbal consent at the time of service. Video, audio, and/or digital photography may be recorded during your visit only with your explicit consent.</p>
        <p><strong className="text-foreground">Medical Information and Records:</strong> All existing laws regarding your access to medical information and copies of your medical records apply to your in-person care. Dissemination of any patient-identifiable images or information from your visit to researchers or other entities shall not occur without your consent, unless authorized under existing confidentiality laws.</p>
        <p><strong className="text-foreground">Your Rights During In-Person Care:</strong> You have the right to refuse any procedure at any time. You have the right to ask questions about any proposed treatment before it is performed. You have the right to seek a second opinion. You have the right to know the identity of all clinical staff involved in your care.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">4. Nature of Telehealth Consultation</h2>
        <p>During the telehealth consultation: (a) Details of your medical history, examinations, and laboratory tests will be discussed with your Provider through the use of interactive video, audio and telecommunications technology. (b) Physical examination may take place to the extent possible via video. (c) Nonmedical technical personnel may be present to aid in video transmission. (d) Video, audio, and/or digital recordings may be made during the telemedicine consultation only with your explicit consent.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">5. Medical Information and Records (Telehealth)</h2>
        <p>All existing laws regarding your access to medical information and copies of your medical records apply to your telehealth consultation. Dissemination of any patient-identifiable images or information from this telemedicine interaction to researchers or other entities shall not occur without your consent, unless authorized under existing confidentiality laws.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">6. Confidentiality</h2>
        <p>Reasonable and appropriate efforts have been made to eliminate any confidentiality risks associated with both in-person and telehealth consultations. All existing confidentiality protections under federal and state law apply to information disclosed during your care. For telehealth, we use HIPAA-compliant encrypted platforms. You are responsible for ensuring privacy on your end during telehealth sessions.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">7. Risks and Benefits</h2>
        <p>The benefits of our services include access to physician-directed peptide therapy, hormone optimization, and wellness services in both a convenient in-person setting and via telehealth.</p>
        <p>Potential risks of in-person care include, but are not limited to: adverse reactions to medications or treatments, injection site reactions, bruising, soreness, allergic responses, infection at injection sites, and other known or unknown side effects. Your Provider will discuss specific risks prior to initiating any treatment.</p>
        <p>Potential risks of telehealth include: because of your specific medical condition or due to technical problems, a face-to-face in-person consultation still may be necessary after the telehealth appointment. Additionally, in rare circumstances, security protocols could fail causing a breach of patient privacy. The alternative to a telehealth consultation is a face-to-face visit with a physician at our facility.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">8. Peptide Therapy and Compounded Medications</h2>
        <p>Peptide therapies and compounded medications are prescribed and supervised by licensed physicians. You acknowledge that: (a) Compounded medications are not FDA-approved as finished drug products, though the individual ingredients may be FDA-approved or otherwise legally marketed. (b) Results vary by individual and no specific outcome is guaranteed. (c) All therapies carry inherent risks including adverse reactions, injection site reactions, allergic responses, and other known or unknown side effects. (d) You must disclose all current medications, supplements, and health conditions to your Provider to avoid contraindications. (e) Some treatments provided by Premier Vitality and Wellness LLC may constitute off-label use of medications. Your Provider will inform you when this applies and will explain the evidence base for the recommended treatment.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">9. No Physician-Patient Relationship Via Website</h2>
        <p>Browsing our website or contacting us does not establish a physician-patient relationship. A physician-patient relationship is established only after a formal consultation with one of our licensed Providers and mutual agreement to proceed with care.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">10. Individual Results</h2>
        <p>Results from peptide therapy, hormone optimization, and other wellness services vary significantly between individuals based on genetics, lifestyle, compliance, and other factors. Testimonials or case studies do not guarantee similar results.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">11. Patient Responsibilities</h2>
        <p>I agree to: (a) provide complete and accurate medical history; (b) report any changes in my health status promptly; (c) follow treatment instructions as directed by my Provider; (d) attend scheduled follow-up appointments; (e) promptly report any adverse reactions or concerns to my Provider; (f) not drive or operate heavy machinery if my Provider advises against it following a procedure.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">12. Acknowledgment</h2>
        <p>My health care practitioner has discussed with me the information provided in this document. I have had an opportunity to ask questions about this information and all of my questions have been answered. I understand the written information provided above. I voluntarily consent to receive medical services from Premier Vitality and Wellness LLC, including both in-person and telehealth services.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">13. Contact</h2>
        <p>Premier Vitality and Wellness LLC<br />
        1870 W Frye Rd Ste 1<br />
        Chandler, AZ 85224<br />
        Phone: (480) 234-9108<br />
        Email: admin@premiervitalityandwellness.com</p>
      </LegalModal>

      <LegalModal open={legalModal === "privacy"} onClose={() => setLegalModal(null)} title="Notice of Privacy Practices">
        <p><strong className="text-foreground">Effective Date:</strong> April 1, 2026</p>
        <p className="uppercase font-medium text-foreground">THIS NOTICE DESCRIBES HOW MEDICAL INFORMATION ABOUT YOU MAY BE USED AND DISCLOSED AND HOW YOU CAN GET ACCESS TO THIS INFORMATION. PLEASE REVIEW IT CAREFULLY.</p>
        <p>This Notice of Privacy Practices describes how we may use and disclose your protected health information to carry out treatment, payment or health care operations and for other purposes that are permitted or required by law. It also describes your rights to access and control your protected health information. "Protected health information" is information about you, including demographic information, that may identify you and that relates to your past, present or future physical or mental health or condition and related health care services.</p>
        <p>We are required to abide by the terms of this Notice of Privacy Practices. We may change the terms of our notice at any time. The new notice will be effective for all protected health information that we maintain at that time. We will provide you with any revised Notice of Privacy Practices upon request.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">1. Uses and Disclosures of Protected Health Information That May Be Made Without Your Authorization</h2>
        <p>Your protected health information may be used and disclosed by your physician, our office staff and others outside of our office who are involved in your care and treatment for the purpose of providing health care services to you.</p>
        <p><strong className="text-foreground">Treatment:</strong> We will use and disclose your protected health information to provide, coordinate, or manage your health care and any related services. This includes the coordination or management of your health care with another provider. We will also disclose protected health information to other physicians who may be treating you.</p>
        <p><strong className="text-foreground">Payment:</strong> Your protected health information may be used and disclosed to obtain payment for your health care services provided by us or by another provider. This may include certain activities such as making a determination of eligibility or coverage for insurance benefits, reviewing services provided to you for medical necessity, and undertaking utilization review activities.</p>
        <p><strong className="text-foreground">Health Care Operations:</strong> We may use or disclose your protected health information in order to support the business activities of Premier Vitality and Wellness LLC. These activities include, but are not limited to, quality assessment and compliance activities, employee review activities, training and licensing.</p>
        <p><strong className="text-foreground">Business Associates:</strong> We will share your protected health information with third party "business associates" that perform various activities (for example, billing or transcription services) for our business. Whenever an arrangement between our office and a business associate involves the use or disclosure of your protected health information, we will have a written contract that contains terms that will protect the privacy of your protected health information.</p>
        <p><strong className="text-foreground">Certain Marketing Activities:</strong> We may use or disclose your protected health information, as necessary, to provide you with information about treatment alternatives or other health-related benefits and services that may be of interest to you. You may contact our Privacy Officer to request that these materials not be sent to you.</p>
        <p><strong className="text-foreground">Required By Law:</strong> We may use or disclose your protected health information to the extent that the use or disclosure is required by law. The use or disclosure will be made in compliance with the law and will be limited to the relevant requirements of the law.</p>
        <p><strong className="text-foreground">Public Health Authorities:</strong> We may disclose your protected health information for public health activities and purposes to a public health authority that is permitted by law to collect or receive the information. This includes disclosures for the purpose of preventing or controlling disease, injury or disability; reporting births and deaths; reporting child abuse or neglect; and reporting reactions to medications or problems with products.</p>
        <p><strong className="text-foreground">Health Oversight Agencies:</strong> We may disclose protected health information to a health oversight agency for activities authorized by law, such as audits, investigations, and inspections. Oversight agencies seeking this information include government agencies that oversee the health care system, government benefit programs, other government regulatory programs and civil rights laws.</p>
        <p><strong className="text-foreground">Victim of Abuse or Neglect:</strong> We may disclose your protected health information to a government authority if we believe that you have been a victim of abuse, neglect or domestic violence. In this case, the disclosure will be made consistent with the requirements and limitations of applicable federal and state laws.</p>
        <p><strong className="text-foreground">Legal Proceedings:</strong> We may disclose protected health information in the course of any judicial or administrative proceeding, in response to an order of a court or administrative tribunal (to the extent such disclosure is expressly authorized), or in certain conditions in response to a subpoena, discovery request or other lawful process.</p>
        <p><strong className="text-foreground">Law Enforcement:</strong> We may also disclose protected health information, so long as applicable legal requirements are met, for certain law enforcement purposes. These law enforcement purposes include (1) legal processes and otherwise required by law, (2) limited information requests for identification and location purposes, (3) pertaining to victims of a crime, (4) suspicion that death has occurred as a result of criminal conduct, (5) in the event that a crime occurs on the premises of our business, and (6) in the case of a medical emergency and it is likely that a crime has occurred.</p>
        <p><strong className="text-foreground">Coroners, Funeral Directors, and Organ Donation:</strong> We may disclose protected health information to a coroner or medical examiner for identification purposes, determining cause of death or for the coroner or medical examiner to perform other duties authorized by law. We may also disclose protected health information to a funeral director, as authorized by law, in order to permit the funeral director to carry out their duties. Protected health information may be used and disclosed for cadaveric organ, eye or tissue donation purposes.</p>
        <p><strong className="text-foreground">Research:</strong> We may disclose your protected health information to researchers in certain circumstances when the research has been approved by an institutional review board that has established protocols to ensure the privacy of your protected health information.</p>
        <p><strong className="text-foreground">Avert Imminent Threat to Health or Safety:</strong> Consistent with applicable federal and state laws, we may disclose your protected health information if we believe that the use or disclosure is necessary to prevent or lessen a serious and imminent threat to the health or safety of a person or the public.</p>
        <p><strong className="text-foreground">Military Activity and National Security:</strong> When the appropriate conditions apply, we may use or disclose protected health information of individuals who are Armed Forces personnel for activities deemed necessary by appropriate military command authorities, for the purpose of a determination by the Department of Veterans Affairs of your eligibility for benefits, or to foreign military authority if you are a member of that foreign military services. We may also disclose your protected health information to authorized federal officials for conducting national security and intelligence activities.</p>
        <p><strong className="text-foreground">Workers' Compensation:</strong> We may disclose your protected health information as authorized to comply with workers' compensation laws and other similar legally-established programs.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">2. Other Permitted and Required Uses and Disclosures That Require Providing You the Opportunity to Agree or Object</h2>
        <p><strong className="text-foreground">Others Involved in Your Health Care or Payment for Your Care:</strong> Unless you object, we may disclose to a member of your family, a relative, a close friend or any other person you identify, your protected health information that directly relates to that person's involvement in your health care. If you are unable to agree or object to such a disclosure, we may disclose such information as necessary if we determine that it is in your best interest based on our professional judgment.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">3. Uses and Disclosures of Protected Health Information Requiring Your Written Authorization</h2>
        <p>Other uses and disclosures of your protected health information will be made only with your written authorization, unless otherwise permitted or required by law as described above. This includes but is not limited to any use or disclosure of your psychotherapy notes (as defined by HIPAA), as well as the use of your protected health information for marketing activities that require patient authorization under HIPAA and/or applicable state law. You may revoke any such authorization in writing at any time. If you revoke your authorization, we will no longer use or disclose your protected health information for the reasons covered by your written authorization, but please understand that we are unable to take back any disclosures already made with your authorization.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">4. Your Rights</h2>
        <p><strong className="text-foreground">Right to Inspect and Copy:</strong> You have the right to inspect and obtain a copy of your protected health information maintained by Premier Vitality and Wellness LLC, with limited exceptions. You must submit your request in writing. We may charge a reasonable fee for providing copies. Under federal law, you may not inspect or copy the following records: psychotherapy notes; information compiled in reasonable anticipation of, or use in, a civil, criminal, or administrative action or proceeding; and laboratory results that are subject to law that prohibits access to protected health information.</p>
        <p><strong className="text-foreground">Right to Amend:</strong> You have the right to request an amendment to your protected health information if you believe the information is incorrect or incomplete. Requests must be made in writing and include a reason for the amendment. We may deny your request under certain circumstances. If we deny your request for amendment, you have the right to file a statement of disagreement with us.</p>
        <p><strong className="text-foreground">Right to an Accounting of Disclosures:</strong> You have the right to request a list of certain disclosures of your protected health information made by Premier Vitality and Wellness LLC. This right applies to disclosures for purposes other than treatment, payment or health care operations.</p>
        <p><strong className="text-foreground">Right to Request Restrictions:</strong> You have the right to request restrictions on certain uses and disclosures of your protected health information. We are not required to agree to your request unless the disclosure is to a health plan for payment or health care operations purposes and the protected health information pertains to a service for which you have paid in full out of pocket.</p>
        <p><strong className="text-foreground">Right to Request Confidential Communications:</strong> You have the right to request that we communicate with you about health matters through a particular means or at a certain location. We will accommodate reasonable requests.</p>
        <p><strong className="text-foreground">Right to a Paper Copy of This Notice:</strong> You have the right to obtain a paper copy of this Notice at any time, even if you have agreed to receive it electronically.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">5. In-Person and Telehealth Privacy</h2>
        <p>For in-person visits at our facility at 1870 W Frye Rd Ste 1, Chandler, AZ 85224, reasonable physical and administrative safeguards are in place to protect your protected health information. For telehealth visits, we use encrypted, HIPAA-compliant video and messaging platforms. You are responsible for ensuring privacy on your end during telehealth sessions. Standard SMS text messages are not encrypted; if you are concerned about privacy, please request secure messaging through the patient portal.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">6. Data Security</h2>
        <p>We implement administrative, technical, and physical safeguards to protect your information from unauthorized access, use, or disclosure. However, no method of transmission or storage is 100% secure.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">7. Changes to This Notice</h2>
        <p>Premier Vitality and Wellness LLC reserves the right to change the terms of this Notice and to make new provisions effective for all protected health information we maintain. If we make material changes, we will make the revised Notice available upon request and will post it on our website.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">8. Complaints</h2>
        <p>If you believe your privacy rights have been violated, you may file a complaint with Premier Vitality and Wellness LLC or with the Secretary of the United States Department of Health and Human Services. More information about this complaint process is available at https://www.hhs.gov/hipaa/filing-a-complaint/complaint-process/index.html. You may also file a complaint with us by notifying our Privacy Officer. We will not retaliate against you for filing a complaint.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">9. Contact — Privacy Officer</h2>
        <p>Premier Vitality and Wellness LLC<br />
        Attn: Privacy Officer<br />
        1870 W Frye Rd Ste 1<br />
        Chandler, AZ 85224<br />
        Phone: (480) 234-9108<br />
        Email: admin@premiervitalityandwellness.com</p>
      </LegalModal>
    </div>
  );
};

export default Auth;

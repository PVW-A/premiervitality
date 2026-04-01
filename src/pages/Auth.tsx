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
        <h2 className="text-lg font-extralight text-foreground pt-4">1. Overview</h2>
        <p>Premier Vitality and Wellness LLC ("Premier Vitality &amp; Wellness," "we," "us," or "our") operates the website located at premiervitalityandwellness.com. By accessing or using our Site, Services, or Products, you agree to be bound by these Terms of Service. If you do not agree, do not use our Services. Our Services are available only to individuals who are at least 18 years of age.</p>
        <p><strong className="text-foreground">ARBITRATION NOTICE:</strong> Except as described in Section 12, disputes arising under these Terms will be resolved by binding individual arbitration. BY ACCEPTING THESE TERMS, YOU WAIVE THE RIGHT TO A TRIAL BY JURY OR TO PARTICIPATE IN ANY CLASS ACTION.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">2. Services</h2>
        <p>Premier Vitality &amp; Wellness provides physician-directed wellness and optimization services including peptide therapy, hormone optimization, biomarker analysis, nutritional counseling, and related medical services, both in-person and via telehealth.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">3. Self-Pay; Insurance Not Accepted</h2>
        <p>All services are provided on a self-pay basis. We do not accept Medicare, Medicaid, or government health care programs. Payment is due at time of service unless otherwise arranged in writing.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">4. Refund Policy</h2>
        <p>All fees for services, treatments, memberships, and products are non-refundable. Appointments cancelled with less than 24 hours notice may be subject to a cancellation fee.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">5. Your Responsibilities</h2>
        <p>You agree to: provide complete and accurate medical history; report changes in health status; follow treatment instructions; attend follow-up appointments; promptly report adverse reactions; and maintain the security of your patient portal account.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">6. Disclaimer of Warranties</h2>
        <p>ALL SERVICES AND CONTENT ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">7. Limitation of Liability</h2>
        <p>PREMIER VITALITY &amp; WELLNESS SHALL NOT BE LIABLE FOR ANY INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES. LIABILITY SHALL NOT EXCEED THE AMOUNT PAID FOR SERVICES IN THE SIX MONTHS PRECEDING THE CLAIM.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">8. Dispute Resolution</h2>
        <p>Disputes shall be resolved by binding arbitration in Maricopa County, Arizona. These Terms are governed by the laws of the State of Arizona.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">9. Contact</h2>
        <p>Premier Vitality and Wellness LLC — admin@premiervitalityandwellness.com</p>
        <p className="text-xs text-muted-foreground pt-2">View the full <a href="/terms" className="underline hover:text-foreground transition-colors">Terms of Service</a>.</p>
      </LegalModal>

      <LegalModal open={legalModal === "disclaimer"} onClose={() => setLegalModal(null)} title="Medical Disclaimer">
        <p><strong className="text-foreground">Last Updated:</strong> April 1, 2026</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">1. Not Emergency Care</h2>
        <p>IF YOU ARE EXPERIENCING A MEDICAL EMERGENCY, CALL 911 OR GO TO THE NEAREST EMERGENCY ROOM IMMEDIATELY. Premier Vitality &amp; Wellness does not provide emergency medical services.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">2. Scope of Services</h2>
        <p>Premier Vitality &amp; Wellness provides physician-directed elective wellness and optimization services. Our services are not intended to replace your primary care physician, emergency services, or specialist care for acute medical conditions.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">3. Peptide Therapy and Compounded Medications</h2>
        <p>Compounded medications are not FDA-approved as finished drug products, though individual ingredients may be FDA-approved. Results vary by individual. No specific outcome is guaranteed. All therapies carry inherent risks including adverse reactions, injection site reactions, allergic responses, and other side effects.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">4. No Physician-Patient Relationship Via Website</h2>
        <p>Browsing our website or contacting us does not establish a physician-patient relationship. A physician-patient relationship is established only after a formal consultation with one of our licensed Providers and mutual agreement to proceed with care.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">5. Individual Results</h2>
        <p>Results from peptide therapy, hormone optimization, and other wellness services vary significantly between individuals based on genetics, lifestyle, compliance, and other factors. Testimonials or case studies do not guarantee similar results.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">6. Off-Label Use</h2>
        <p>Some treatments may constitute off-label use of medications. Your Provider will inform you when this applies and will explain the evidence base for the recommended treatment.</p>
        <p className="text-xs text-muted-foreground pt-2">View the full <a href="/disclaimer" className="underline hover:text-foreground transition-colors">Medical Disclaimer</a>.</p>
      </LegalModal>

      <LegalModal open={legalModal === "privacy"} onClose={() => setLegalModal(null)} title="Privacy Policy">
        <p><strong className="text-foreground">Effective Date:</strong> April 1, 2026</p>
        <p className="uppercase font-medium text-foreground text-xs">THIS NOTICE DESCRIBES HOW MEDICAL INFORMATION ABOUT YOU MAY BE USED AND DISCLOSED AND HOW YOU CAN GET ACCESS TO THIS INFORMATION.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">1. Information We Collect</h2>
        <p>We collect: personal identification information (name, date of birth, address, phone, email); protected health information (PHI) including medical history, diagnoses, treatment records, prescriptions, and lab results; payment information; and device and usage data when you use our Site.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">2. HIPAA Compliance</h2>
        <p>As a covered entity under HIPAA, we are required to maintain the privacy of your Protected Health Information (PHI). We may use PHI without authorization for treatment, payment, health care operations, and as required by law. All other uses require your written authorization, which you may revoke at any time.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">3. Your Rights</h2>
        <p>You have the right to: inspect and copy your PHI; request amendment; request restrictions on use or disclosure; request confidential communications by alternative means; receive an accounting of disclosures; and obtain a paper copy of this Notice.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">4. Data Security</h2>
        <p>We implement administrative, technical, and physical safeguards to protect your information. However, no method of transmission or storage is 100% secure.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">5. Third Parties</h2>
        <p>We may share information with licensed pharmacies, laboratories, billing processors, and other business associates under written HIPAA-compliant agreements.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">6. Complaints</h2>
        <p>If you believe your privacy rights have been violated, you may file a complaint with us or with the U.S. Department of Health and Human Services. We will not retaliate against you for filing a complaint.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">7. Contact</h2>
        <p>Premier Vitality and Wellness LLC — admin@premiervitalityandwellness.com</p>
        <p className="text-xs text-muted-foreground pt-2">View the full <a href="/privacy" className="underline hover:text-foreground transition-colors">Privacy Policy</a>.</p>
      </LegalModal>
    </div>
  );
};

export default Auth;

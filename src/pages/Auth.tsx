import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import PVMonogram from "@/components/PVMonogram";
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
  const { user } = useAuth();

  useEffect(() => {
    if (user && !needs2FA) navigate("/portal");
  }, [user, navigate, needs2FA]);

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
      }
    }
    setLoading(false);
  };

  // 2FA verification screen
  if (needs2FA) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-10">
            <PVMonogram className="w-12 h-12 mb-4" />
            <h1 className="text-2xl font-heading font-light tracking-wide text-foreground">
              Verify Your Identity
            </h1>
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mt-2 font-body font-light text-center">
              We sent a code to {maskedPhone}
            </p>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs tracking-wider uppercase text-muted-foreground font-body font-light">
                Verification Code
              </Label>
              <Input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="bg-secondary border-border text-foreground font-body font-light text-center text-lg tracking-[0.5em]"
              />
            </div>

            {error && <p className="text-destructive text-sm font-body">{error}</p>}

            <Button
              onClick={handleVerify2FA}
              disabled={loading || verificationCode.length !== 6}
              className="w-full text-xs tracking-[0.2em] uppercase font-body font-light rounded-none h-11"
            >
              {loading ? "Verifying..." : "Verify"}
            </Button>

            <button
              onClick={() => {
                setNeeds2FA(false);
                setPendingSession(null);
                supabase.auth.signOut();
              }}
              className="text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors font-body font-light block mx-auto"
            >
              Cancel &amp; sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <PVMonogram className="w-12 h-12 mb-4" />
          <h1 className="text-2xl font-heading font-light tracking-wide text-foreground">
            Patient Portal
          </h1>
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mt-2 font-body font-light">
            {isLogin ? "Sign in to your account" : "Create your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs tracking-wider uppercase text-muted-foreground font-body font-light">First Name</Label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(sanitizeName(e.target.value))}
                    maxLength={100}
                    required={!isLogin}
                    className="bg-secondary border-border text-foreground font-body font-light"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs tracking-wider uppercase text-muted-foreground font-body font-light">Last Name</Label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(sanitizeName(e.target.value))}
                    maxLength={100}
                    required={!isLogin}
                    className="bg-secondary border-border text-foreground font-body font-light"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs tracking-wider uppercase text-muted-foreground font-body font-light">Phone Number</Label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(sanitizePhone(e.target.value))}
                  placeholder="+1 (555) 123-4567"
                  required={!isLogin}
                  className="bg-secondary border-border text-foreground font-body font-light"
                />
                <p className="text-[10px] text-muted-foreground font-body font-light">
                  Required for two-factor authentication &amp; account security.
                </p>
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label className="text-xs tracking-wider uppercase text-muted-foreground font-body font-light">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(sanitizeEmail(e.target.value))}
              maxLength={255}
              required
              className="bg-secondary border-border text-foreground font-body font-light"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs tracking-wider uppercase text-muted-foreground font-body font-light">Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="bg-secondary border-border text-foreground font-body font-light"
            />
          </div>

          {!isLogin && (
            <div className="flex items-start space-x-3">
              <Checkbox
                id="legal-agree"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked === true)}
                className="mt-0.5"
              />
              <label htmlFor="legal-agree" className="text-[11px] text-muted-foreground font-body font-light leading-relaxed cursor-pointer">
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

          <Button
            type="submit"
            disabled={loading || (!isLogin && !agreed)}
            className="w-full text-xs tracking-[0.2em] uppercase font-body font-light rounded-none h-11"
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </Button>
        </form>

        {/* Google OAuth divider + button */}
        <div className="mt-6 flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-body font-light">or</span>
          <Separator className="flex-1" />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={async () => {
            setError("");
            const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback` } });
            if (error) setError(error.message || "Google sign-in failed");
          }}
          className="w-full mt-4 h-11 rounded-none border-border text-foreground font-body font-light text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-3 hover:bg-secondary/80"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" className="flex-shrink-0">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {isLogin ? "Sign in with Google" : "Sign up with Google"}
        </Button>

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
              className="text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors font-body font-light block mx-auto"
            >
              Forgot password?
            </button>
          )}
          <button
            onClick={() => { setIsLogin(!isLogin); setError(""); setMessage(""); }}
            className="text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors font-body font-light"
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        <div className="mt-8 text-center">
          <a href="/" className="text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors font-body font-light">
            ← Back to website
          </a>
        </div>
      </div>

      {/* Legal modals */}
      <LegalModal open={legalModal === "terms"} onClose={() => setLegalModal(null)} title="Terms of Service">
        <p><strong className="text-foreground">Effective Date:</strong> February 23, 2026</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">1. Acceptance of Terms</h2>
        <p>By accessing or using the Premier Vitality & Wellness website and services, you agree to be bound by these Terms of Service. If you do not agree, you must discontinue use immediately.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">2. Medical Disclaimer</h2>
        <p>The information provided on this website is for general informational and educational purposes only and does not constitute medical advice, diagnosis, or treatment. Peptide therapy and related services are provided under the supervision of licensed healthcare providers. Always seek the advice of a qualified healthcare professional with any questions you may have regarding a medical condition.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">3. No Guarantees</h2>
        <p>We make no guarantees, representations, or warranties regarding the outcomes or results of any treatments, therapies, or protocols offered through our services. Individual results may vary significantly.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">4. Limitation of Liability</h2>
        <p>To the fullest extent permitted by applicable law, Premier Vitality & Wellness, its founders, officers, employees, agents, and affiliates shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of our website or services.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">5. Assumption of Risk</h2>
        <p>You acknowledge that peptide therapy and related treatments carry inherent risks, including but not limited to adverse reactions, side effects, and interactions with other medications. By using our services, you voluntarily assume all risks associated with such treatments and agree to hold Premier Vitality & Wellness harmless from any claims arising therefrom.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">6. Indemnification</h2>
        <p>You agree to indemnify, defend, and hold harmless Premier Vitality & Wellness and its founders, employees, and affiliates from and against any and all claims, liabilities, damages, losses, and expenses arising out of or in connection with your use of our services, your violation of these Terms, or your violation of any rights of another party.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">7. Intellectual Property</h2>
        <p>All content on this website, including text, graphics, logos, and images, is the property of Premier Vitality & Wellness and is protected by applicable intellectual property laws.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">8. Governing Law</h2>
        <p>These Terms shall be governed by and construed in accordance with the laws of the state in which Premier Vitality & Wellness operates, without regard to its conflict of law provisions.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">9. Severability</h2>
        <p>If any provision of these Terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">10. Changes to Terms</h2>
        <p>We reserve the right to modify these Terms at any time. Continued use of our services after any changes constitutes your acceptance of the new Terms.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">11. Contact</h2>
        <p>For questions regarding these Terms of Service, please contact us through the information provided on our website.</p>
      </LegalModal>

      <LegalModal open={legalModal === "disclaimer"} onClose={() => setLegalModal(null)} title="Medical Disclaimer">
        <p><strong className="text-foreground">Effective Date:</strong> February 23, 2026</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">General Information Only</h2>
        <p>The content provided on this website, including all text, graphics, images, and other material, is for informational purposes only and is not intended to be a substitute for professional medical advice, diagnosis, or treatment.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">Not Medical Advice</h2>
        <p>Nothing on this website should be construed as medical advice. The information provided does not create a physician-patient relationship. Always consult with a qualified, licensed healthcare provider before starting any new treatment, therapy, medication, or supplement, including peptide therapy.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">No Guaranteed Results</h2>
        <p>Premier Vitality & Wellness makes no claims, promises, or guarantees about the efficacy, safety, or outcomes of any treatments described on this website. Individual results vary and depend on numerous factors including age, health status, genetics, lifestyle, and adherence to protocols.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">Assumption of Risk</h2>
        <p>Peptide therapy and related treatments involve inherent risks including allergic reactions, injection site reactions, hormonal imbalances, drug interactions, and unknown long-term effects. By engaging with our services, you acknowledge these risks and accept full responsibility for your decision to pursue treatment.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">FDA Disclaimer</h2>
        <p>The statements made on this website have not been evaluated by the Food and Drug Administration (FDA). The products and services offered are not intended to diagnose, treat, cure, or prevent any disease.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">Limitation of Liability</h2>
        <p>Under no circumstances shall Premier Vitality & Wellness, its founders, physicians, employees, or affiliates be held liable for any damages whatsoever arising from your use of this website or any treatments, products, or services referenced herein.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">Emergency Situations</h2>
        <p>If you are experiencing a medical emergency, call 911 or your local emergency services immediately. Do not rely on this website for emergency medical guidance.</p>
      </LegalModal>

      <LegalModal open={legalModal === "privacy"} onClose={() => setLegalModal(null)} title="Privacy Policy">
        <p><strong className="text-foreground">Effective Date:</strong> February 26, 2026</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">1. Information We Collect</h2>
        <p>We may collect personal information you voluntarily provide, including your name, email address, phone number, and health-related information necessary for consultation and treatment. This may include Protected Health Information (PHI) such as lab results, biomarker data, medication history, and treatment records. We also automatically collect certain technical data such as IP addresses, browser type, device identifiers, and usage patterns.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">2. How We Use Your Information</h2>
        <p>We use your information to provide and improve our services, communicate with you about treatments and appointments, process orders, comply with legal obligations, and protect the safety and security of our platform and users. Health-related information is used exclusively for providing clinical wellness services, generating vitality assessments, and facilitating peptide therapy consultations under the supervision of licensed healthcare providers.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">3. Protected Health Information (PHI)</h2>
        <p>When you voluntarily submit health-related information through our platform, we treat this information with the highest level of care. All PHI is encrypted in transit and at rest, access is restricted to authorized clinical personnel on a minimum-necessary basis, and all access to patient records is logged in an immutable audit trail.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">4. Information Sharing</h2>
        <p>We do not sell, trade, or rent your personal information to third parties. We may share information with trusted service providers who assist in operating our platform, provided they are bound by agreements that require them to protect your information. Where applicable, we maintain Business Associate Agreements (BAAs) with third-party vendors who may access, process, or store PHI on our behalf.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">5. Data Security</h2>
        <p>We implement reasonable administrative, technical, and physical safeguards to protect your personal and health information, including role-based access controls, two-factor authentication, automatic session timeouts, encryption of data in transit and at rest, and comprehensive audit logging.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">6. Data Retention</h2>
        <p>We retain your personal information and health records for as long as necessary to provide our services and comply with applicable legal requirements. Health records are retained for a minimum of seven (7) years from the date of last service. Upon account deletion, non-essential personal data is removed within 30 days.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">7. Your Rights</h2>
        <p>You may request access to, correction of, or deletion of your personal information at any time. You have the right to request an accounting of disclosures of your PHI, to request restrictions on certain uses of your health information, and to receive a copy of your health records in a portable format.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">8. Third-Party Links</h2>
        <p>Our website may contain links to third-party sites. We are not responsible for the privacy practices or content of those sites.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">9. Changes to This Policy</h2>
        <p>We reserve the right to update this Privacy Policy at any time. Material changes affecting PHI handling will be communicated directly to affected users.</p>
        <h2 className="text-lg font-extralight text-foreground pt-4">10. Contact Us</h2>
        <p>If you have questions about this Privacy Policy or wish to exercise your rights regarding your health information, please contact us through the information provided on our website.</p>
      </LegalModal>
    </div>
  );
};

export default Auth;

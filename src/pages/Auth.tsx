import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import PVMonogram from "@/components/PVMonogram";
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
  const [smsConsent, setSmsConsent] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
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
          data: { first_name: firstName, last_name: lastName, phone, sms_consent: smsConsent },
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
                  onChange={(e) => setPhone(e.target.value)}
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
              onChange={(e) => setEmail(e.target.value)}
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
            <>
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="sms-consent"
                  checked={smsConsent}
                  onCheckedChange={(checked) => setSmsConsent(checked === true)}
                  className="mt-0.5"
                />
                <label htmlFor="sms-consent" className="text-[11px] text-muted-foreground font-body font-light leading-relaxed cursor-pointer">
                  I consent to receive SMS messages from Premier Vitality &amp; Wellness including 2FA codes, account notifications, and promotional messages. Msg &amp; data rates may apply. Reply STOP to opt out.{" "}
                  <a href="/sms-consent" target="_blank" className="underline text-foreground hover:text-primary transition-colors">
                    View full SMS policy
                  </a>
                </label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms-accept"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                  className="mt-0.5"
                />
                <label htmlFor="terms-accept" className="text-[11px] text-muted-foreground font-body font-light leading-relaxed cursor-pointer">
                  I acknowledge that peptide therapy carries inherent risks and I voluntarily assume all risks associated with treatment. I have read and agree to the{" "}
                  <a href="/terms" target="_blank" className="underline text-foreground hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                  ,{" "}
                  <a href="/disclaimer" target="_blank" className="underline text-foreground hover:text-primary transition-colors">
                    Medical Disclaimer
                  </a>
                  , and{" "}
                  <a href="/privacy" target="_blank" className="underline text-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                  , including the limitation of liability and assumption of risk provisions. I waive any and all claims against Premier Vitality &amp; Wellness, its founders, physicians, employees, and affiliates arising from my use of these services.
                </label>
              </div>
            </>
          )}

          {error && <p className="text-destructive text-sm font-body">{error}</p>}
          {message && <p className="text-primary text-sm font-body">{message}</p>}

          <Button
            type="submit"
            disabled={loading || (!isLogin && (!smsConsent || !termsAccepted))}
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
            const { error } = await lovable.auth.signInWithOAuth("google", {
              redirect_uri: window.location.origin,
            });
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
    </div>
  );
};

export default Auth;

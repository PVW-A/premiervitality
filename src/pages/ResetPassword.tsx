import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PVMonogram from "@/components/PVMonogram";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.get("type") === "recovery") {
      setIsRecovery(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      setMessage("Password updated successfully. Redirecting…");
      setTimeout(() => navigate("/portal"), 2000);
    }
    setLoading(false);
  };

  if (!isRecovery) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <PVMonogram className="w-12 h-12 mb-4 mx-auto" />
          <h1 className="text-2xl font-heading font-light tracking-wide text-foreground mb-4">
            Invalid Link
          </h1>
          <p className="text-sm text-muted-foreground font-body font-light mb-6">
            This password reset link is invalid or has expired.
          </p>
          <a href="/auth" className="text-xs tracking-wider uppercase text-primary hover:text-foreground transition-colors font-body font-light">
            ← Back to sign in
          </a>
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
            Set New Password
          </h1>
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mt-2 font-body font-light">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-xs tracking-wider uppercase text-muted-foreground font-body font-light">New Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="bg-secondary border-border text-foreground font-body font-light"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs tracking-wider uppercase text-muted-foreground font-body font-light">Confirm Password</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="bg-secondary border-border text-foreground font-body font-light"
            />
          </div>

          {error && <p className="text-destructive text-sm font-body">{error}</p>}
          {message && <p className="text-primary text-sm font-body">{message}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full text-xs tracking-[0.2em] uppercase font-body font-light rounded-none h-11"
          >
            {loading ? "Please wait..." : "Update Password"}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <a href="/auth" className="text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors font-body font-light">
            ← Back to sign in
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

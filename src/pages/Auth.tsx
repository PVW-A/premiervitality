import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PVMonogram from "@/components/PVMonogram";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate("/portal");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else navigate("/portal");
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { first_name: firstName, last_name: lastName },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) setError(error.message);
      else setMessage("Check your email to confirm your account.");
    }
    setLoading(false);
  };

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
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs tracking-wider uppercase text-muted-foreground font-body font-light">First Name</Label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required={!isLogin}
                  className="bg-secondary border-border text-foreground font-body font-light"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs tracking-wider uppercase text-muted-foreground font-body font-light">Last Name</Label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required={!isLogin}
                  className="bg-secondary border-border text-foreground font-body font-light"
                />
              </div>
            </div>
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

          {error && <p className="text-destructive text-sm font-body">{error}</p>}
          {message && <p className="text-primary text-sm font-body">{message}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full text-xs tracking-[0.2em] uppercase font-body font-light rounded-none h-11"
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 text-center">
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

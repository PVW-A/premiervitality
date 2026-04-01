import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ data: { session } }) => {
        window.location.replace(session ? "/portal" : "/auth");
      }).catch(() => {
        window.location.replace("/auth");
      });
    } else {
      // Handle implicit flow (hash fragment) — Supabase auto-detects session
      supabase.auth.getSession().then(({ data: { session } }) => {
        window.location.replace(session ? "/portal" : "/auth");
      });
    }
  }, []);

  return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#0a0a0a",color:"#c9a84c",fontFamily:"serif",fontSize:"1.2rem",letterSpacing:"0.2em"}}>SIGNING IN...</div>;
};

export default AuthCallback;

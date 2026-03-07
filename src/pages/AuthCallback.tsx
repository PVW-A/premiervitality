import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  useEffect(() => {
    supabase.auth.exchangeCodeForSession(window.location.hash).catch(() => {}).finally(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      window.location.replace(session ? "/portal" : "/auth");
    });
  }, []);

  return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#0a0a0a",color:"#c9a84c",fontFamily:"serif",fontSize:"1.2rem",letterSpacing:"0.2em"}}>SIGNING IN...</div>;
};

export default AuthCallback;

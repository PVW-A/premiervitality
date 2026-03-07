import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        subscription.unsubscribe();
        window.location.replace("/portal");
      } else if (event === "SIGNED_OUT") {
        window.location.replace("/auth");
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh"}}>Signing you in...</div>;
};

export default AuthCallback;

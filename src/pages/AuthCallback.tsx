import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        window.location.replace("/portal");
      } else {
        window.location.replace("/auth");
      }
    });
  }, []);

  return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh"}}>Signing you in...</div>;
};

export default AuthCallback;

import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { syncIntakeToProfile } from "@/lib/syncIntakeToProfile";

const AuthCallback = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const redirectWithSync = async (session: any) => {
      if (session?.user?.email) {
        await syncIntakeToProfile(session.user.id, session.user.email);
      }
      window.location.replace(session ? "/portal" : "/auth");
    };

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ data: { session } }) => {
        redirectWithSync(session);
      }).catch(() => {
        window.location.replace("/auth");
      });
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        redirectWithSync(session);
      });
    }
  }, []);

  return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:"#0a0a0a",color:"#c9a84c",fontFamily:"serif",fontSize:"1.2rem",letterSpacing:"0.2em"}}>SIGNING IN...</div>;
};

export default AuthCallback;

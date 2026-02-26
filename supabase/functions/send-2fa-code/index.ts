import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TWILIO_ACCOUNT_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
    const TWILIO_AUTH_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
    const TWILIO_PHONE_NUMBER = Deno.env.get("TWILIO_PHONE_NUMBER");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      throw new Error("Twilio credentials not configured");
    }

    const { userId, deviceFingerprint } = await req.json();
    if (!userId || !deviceFingerprint) {
      return new Response(JSON.stringify({ error: "Missing userId or deviceFingerprint" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Check if device is already trusted
    const { data: trustedDevice } = await supabaseAdmin
      .from("trusted_devices")
      .select("id")
      .eq("user_id", userId)
      .eq("device_fingerprint", deviceFingerprint)
      .maybeSingle();

    if (trustedDevice) {
      // Update last_used_at
      await supabaseAdmin
        .from("trusted_devices")
        .update({ last_used_at: new Date().toISOString() })
        .eq("id", trustedDevice.id);

      return new Response(JSON.stringify({ trusted: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user's phone from profile
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("phone, sms_2fa_enabled")
      .eq("user_id", userId)
      .maybeSingle();

    if (!profile?.phone) {
      return new Response(JSON.stringify({ trusted: true, reason: "no_phone" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!profile.sms_2fa_enabled) {
      return new Response(JSON.stringify({ trusted: true, reason: "2fa_disabled" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min

    // Store code
    await supabaseAdmin.from("verification_codes").insert({
      user_id: userId,
      code,
      phone: profile.phone,
      expires_at: expiresAt,
    });

    // Send SMS via Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const formData = new URLSearchParams({
      To: profile.phone,
      From: TWILIO_PHONE_NUMBER,
      Body: `Your Premier Vitality verification code is: ${code}. It expires in 10 minutes.`,
    });

    const twilioRes = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!twilioRes.ok) {
      const errBody = await twilioRes.text();
      throw new Error(`Twilio send failed [${twilioRes.status}]: ${errBody}`);
    }

    // Mask phone for display
    const maskedPhone = profile.phone.replace(/(\+\d{1})\d+(\d{4})/, "$1****$2");

    return new Response(
      JSON.stringify({ trusted: false, maskedPhone }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("send-2fa-code error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

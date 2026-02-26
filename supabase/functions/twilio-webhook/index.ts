import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "content-type",
      },
    });
  }

  // Twilio sends form-encoded POST
  const twimlResponse = (msg?: string) => {
    const body = msg
      ? `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${msg}</Message></Response>`
      : `<?xml version="1.0" encoding="UTF-8"?><Response/>`;
    return new Response(body, {
      status: 200,
      headers: { "Content-Type": "application/xml" },
    });
  };

  try {
    const formData = await req.formData();
    const fromPhone = (formData.get("From") as string) || "";
    const rawBody = ((formData.get("Body") as string) || "").trim().toUpperCase();

    if (!fromPhone || !rawBody) {
      return twimlResponse();
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const twilioSid = Deno.env.get("TWILIO_ACCOUNT_SID")!;
    const twilioAuth = Deno.env.get("TWILIO_AUTH_TOKEN")!;
    const twilioPhone = Deno.env.get("TWILIO_PHONE_NUMBER")!;

    const admin = createClient(supabaseUrl, serviceRoleKey);

    // Normalize phone: strip non-digits, ensure +1 prefix
    const normalizedPhone = fromPhone.startsWith("+") ? fromPhone : `+${fromPhone}`;

    // Look up user by phone
    const { data: profile, error: profileErr } = await admin
      .from("profiles")
      .select("user_id, phone")
      .eq("phone", normalizedPhone)
      .maybeSingle();

    if (profileErr || !profile) {
      // Try without +1 prefix variations
      const stripped = normalizedPhone.replace(/\D/g, "");
      const { data: profile2 } = await admin
        .from("profiles")
        .select("user_id, phone")
        .or(`phone.eq.${normalizedPhone},phone.eq.+${stripped},phone.eq.${stripped}`)
        .maybeSingle();

      if (!profile2) {
        console.log(`No profile found for phone: ${fromPhone}`);
        return twimlResponse();
      }

      // Use profile2 for the rest
      return await handleReply(admin, profile2.user_id, rawBody, twilioSid, twilioAuth, twilioPhone, normalizedPhone, supabaseUrl);
    }

    return await handleReply(admin, profile.user_id, rawBody, twilioSid, twilioAuth, twilioPhone, normalizedPhone, supabaseUrl);
  } catch (e) {
    console.error("Twilio webhook error:", e);
    return twimlResponse();
  }
});

async function handleReply(
  admin: ReturnType<typeof createClient>,
  userId: string,
  reply: string,
  twilioSid: string,
  twilioAuth: string,
  twilioPhone: string,
  toPhone: string,
  supabaseUrl: string
) {
  const twimlResponse = (msg?: string) => {
    const body = msg
      ? `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${msg}</Message></Response>`
      : `<?xml version="1.0" encoding="UTF-8"?><Response/>`;
    return new Response(body, {
      status: 200,
      headers: { "Content-Type": "application/xml" },
    });
  };

  if (reply === "Y" || reply === "YES") {
    // Find the most recent low-vial peptide for this user
    const { data: reminder } = await admin
      .from("peptide_reminders")
      .select("*, patient_peptides(peptide_id, dosage)")
      .eq("user_id", userId)
      .eq("low_vial_alert_sent", true)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!reminder) {
      return twimlResponse("Premier Vitality: No pending reorder found. Please contact us for assistance. Reply STOP to opt out.");
    }

    const peptideId = (reminder as any).patient_peptides?.peptide_id;
    if (!peptideId) {
      return twimlResponse("Premier Vitality: Unable to process reorder. Please contact us. Reply STOP to opt out.");
    }

    // Get peptide info
    const { data: peptide } = await admin
      .from("peptides")
      .select("name, price")
      .eq("id", peptideId)
      .single();

    if (!peptide) {
      return twimlResponse("Premier Vitality: Unable to find peptide details. Please contact us. Reply STOP to opt out.");
    }

    // Create a new peptide_request with status approved
    const { data: newRequest, error: reqErr } = await admin
      .from("peptide_requests")
      .insert({
        user_id: userId,
        peptide_id: peptideId,
        peptide_name: peptide.name,
        price: peptide.price,
        status: "approved",
      })
      .select("id")
      .single();

    if (reqErr || !newRequest) {
      console.error("Error creating reorder request:", reqErr);
      return twimlResponse("Premier Vitality: Unable to create reorder. Please try again in your portal. Reply STOP to opt out.");
    }

    // Reset the low_vial_alert_sent flag
    await admin
      .from("peptide_reminders")
      .update({ low_vial_alert_sent: false })
      .eq("id", reminder.id);

    return twimlResponse(
      `Premier Vitality: Your ${peptide.name} reorder has been placed! Log in to your portal to configure delivery options and complete payment. Reply STOP to opt out.`
    );
  }

  if (reply === "N" || reply === "NO") {
    // Dismiss the alert — reset low_vial_alert_sent
    const { error } = await admin
      .from("peptide_reminders")
      .update({ low_vial_alert_sent: false })
      .eq("user_id", userId)
      .eq("low_vial_alert_sent", true);

    if (error) {
      console.error("Error resetting alert:", error);
    }

    return twimlResponse("Premier Vitality: Got it — we won't remind you again until your next cycle. Reply STOP to opt out.");
  }

  // Unknown reply
  return twimlResponse("Premier Vitality: Reply Y to reorder, N to skip, or STOP to opt out.");
}

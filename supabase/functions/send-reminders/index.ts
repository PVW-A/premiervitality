import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const twilioSid = Deno.env.get("TWILIO_ACCOUNT_SID")!;
    const twilioAuth = Deno.env.get("TWILIO_AUTH_TOKEN")!;
    const twilioPhone = Deno.env.get("TWILIO_PHONE_NUMBER")!;

    const admin = createClient(supabaseUrl, serviceRoleKey);
    const now = new Date();
    const currentHHMM = `${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")}`;

    // ── 1. Dosing Reminders ──
    const { data: reminders, error: remErr } = await admin
      .from("peptide_reminders")
      .select("*")
      .eq("active", true);

    if (remErr) {
      console.error("Error fetching reminders:", remErr);
    }

    // Use a ±8 minute tolerance window for 15-min cron
    const toleranceMinutes = 8;

    const timeMatchesWindow = (targetTime: string): boolean => {
      const [tH, tM] = targetTime.split(":").map(Number);
      const [cH, cM] = currentHHMM.split(":").map(Number);
      const targetTotal = tH * 60 + tM;
      const currentTotal = cH * 60 + cM;
      const diff = Math.abs(targetTotal - currentTotal);
      return diff <= toleranceMinutes || diff >= 1440 - toleranceMinutes;
    };

    let remindersSent = 0;

    if (reminders) {
      for (const r of reminders) {
        // Check if linked patient_peptide supply has run out
        const { data: pp } = await admin
          .from("patient_peptides")
          .select("quantity_remaining, usage_per_day")
          .eq("id", r.patient_peptide_id)
          .maybeSingle();

        if (pp) {
          const daysLeft = (pp.usage_per_day && pp.usage_per_day > 0)
            ? pp.quantity_remaining / pp.usage_per_day
            : Infinity;
          if (daysLeft <= 0) {
            // Supply exhausted — deactivate reminder
            await admin
              .from("peptide_reminders")
              .update({ active: false })
              .eq("id", r.id);
            continue;
          }
        }

        // Look up phone from profiles
        const { data: prof } = await admin
          .from("profiles")
          .select("phone, sms_consent")
          .eq("user_id", r.user_id)
          .maybeSingle();

        const phone = prof?.phone;
        const smsConsent = prof?.sms_consent;
        if (!phone || !smsConsent) continue;

        const times: string[] = Array.isArray(r.reminder_times)
          ? r.reminder_times
          : [];

        const shouldSend = times.some((t: string) => timeMatchesWindow(t));
        if (!shouldSend) continue;

        const body = `Premier Vitality: Time for your ${r.peptide_name} dose${r.dosage ? ` (${r.dosage})` : ""}. Reply STOP to opt out.`;

        try {
          const twilioRes = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
            {
              method: "POST",
              headers: {
                Authorization: `Basic ${btoa(`${twilioSid}:${twilioAuth}`)}`,
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({
                From: twilioPhone,
                To: phone,
                Body: body,
              }),
            }
          );
          if (!twilioRes.ok) {
            const errBody = await twilioRes.text();
            console.error(`Twilio error for reminder ${r.id}:`, errBody);
          } else {
            remindersSent++;
          }
        } catch (e) {
          console.error(`SMS send error for reminder ${r.id}:`, e);
        }
      }
    }

    // ── 2. Low Vial Alerts ──
    // Find patient_peptides where days remaining <= 10 and no alert sent yet
    const { data: peptides, error: ppErr } = await admin
      .from("patient_peptides")
      .select("*, peptides(name, price)")
      .gt("usage_per_day", 0)
      .gt("quantity_remaining", 0);

    if (ppErr) {
      console.error("Error fetching patient peptides:", ppErr);
    }

    let alertsSent = 0;

    if (peptides) {
      for (const pp of peptides) {
        const daysLeft = Math.floor(pp.quantity_remaining / pp.usage_per_day);
        if (daysLeft > 10) continue;

        // Look up phone from profiles
        const { data: prof } = await admin
          .from("profiles")
          .select("phone, sms_consent")
          .eq("user_id", pp.user_id)
          .maybeSingle();

        const phone = prof?.phone;
        const smsConsent = prof?.sms_consent;
        if (!phone || !smsConsent) continue;

        // Check if alert already sent via peptide_reminders flag
        const { data: existingReminder } = await admin
          .from("peptide_reminders")
          .select("id, low_vial_alert_sent")
          .eq("patient_peptide_id", pp.id)
          .eq("low_vial_alert_sent", true)
          .maybeSingle();

        if (existingReminder) continue;

        const peptideName = (pp as any).peptides?.name || "your peptide";
        const body = `Premier Vitality: Your ${peptideName} supply is running low (~${daysLeft} days left). Reply Y to reorder or N to skip. Reply STOP to opt out.`;

        try {
          const twilioRes = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
            {
              method: "POST",
              headers: {
                Authorization: `Basic ${btoa(`${twilioSid}:${twilioAuth}`)}`,
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({
                From: twilioPhone,
                To: phone,
                Body: body,
              }),
            }
          );

          if (twilioRes.ok) {
            alertsSent++;
            // Mark alert sent — upsert a reminder row or update existing
            const { data: reminder } = await admin
              .from("peptide_reminders")
              .select("id")
              .eq("patient_peptide_id", pp.id)
              .maybeSingle();

            if (reminder) {
              await admin
                .from("peptide_reminders")
                .update({ low_vial_alert_sent: true })
                .eq("id", reminder.id);
            } else {
              // Create a minimal reminder row to track alert state
              await admin.from("peptide_reminders").insert({
                user_id: pp.user_id,
                patient_peptide_id: pp.id,
                peptide_name: peptideName,
                dosage: pp.dosage,
                times_per_day: 0,
                reminder_times: [],
                active: false,
                low_vial_alert_sent: true,
              });
            }
          } else {
            const errBody = await twilioRes.text();
            console.error(`Twilio low-vial alert error for ${pp.id}:`, errBody);
          }
        } catch (e) {
          console.error(`SMS low-vial error for ${pp.id}:`, e);
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        reminders_sent: remindersSent,
        low_vial_alerts_sent: alertsSent,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Unexpected error:", e);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

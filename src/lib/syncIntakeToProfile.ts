import { supabase } from "@/integrations/supabase/client";

/**
 * If a patient_intake record exists for this email, copy name/phone
 * into the profiles row — but only for fields the profile is currently missing.
 */
export async function syncIntakeToProfile(userId: string, email: string) {
  try {
    // Fetch intake record
    const { data: intake } = await supabase
      .from("patient_intake" as any)
      .select("first_name, last_name, phone")
      .eq("email", email.toLowerCase())
      .order("submission_date", { ascending: false })
      .limit(1)
      .single();

    if (!intake) return;

    // Fetch current profile to avoid overwriting existing data
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name, last_name, phone")
      .eq("user_id", userId)
      .single();

    const updates: Record<string, string> = {};
    if (!profile?.first_name && intake.first_name) updates.first_name = intake.first_name;
    if (!profile?.last_name && intake.last_name) updates.last_name = intake.last_name;
    if (!profile?.phone && intake.phone) updates.phone = intake.phone;

    if (Object.keys(updates).length > 0) {
      await supabase.from("profiles").update(updates).eq("user_id", userId);
    }
  } catch (e) {
    console.error("syncIntakeToProfile error:", e);
  }
}

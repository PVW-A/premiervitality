import { supabase } from "@/integrations/supabase/client";

interface AuditLogEntry {
  action: string;
  resource_type: string;
  resource_id?: string;
  patient_user_id?: string;
  metadata?: Record<string, unknown>;
}

export async function logAdminAction(entry: AuditLogEntry) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("audit_logs" as any).insert({
    admin_user_id: user.id,
    action: entry.action,
    resource_type: entry.resource_type,
    resource_id: entry.resource_id ?? null,
    patient_user_id: entry.patient_user_id ?? null,
    metadata: entry.metadata ?? {},
  });
}

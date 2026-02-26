
-- Enable pg_cron and pg_net extensions
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Create peptide_reminders table
CREATE TABLE public.peptide_reminders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  patient_peptide_id uuid NOT NULL REFERENCES public.patient_peptides(id) ON DELETE CASCADE,
  peptide_name text NOT NULL,
  dosage text,
  times_per_day integer NOT NULL DEFAULT 1,
  reminder_times jsonb NOT NULL DEFAULT '["08:00"]'::jsonb,
  duration_days integer, -- null = ongoing
  started_at timestamptz NOT NULL DEFAULT now(),
  active boolean NOT NULL DEFAULT true,
  low_vial_alert_sent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.peptide_reminders ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own reminders"
  ON public.peptide_reminders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reminders"
  ON public.peptide_reminders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminders"
  ON public.peptide_reminders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminders"
  ON public.peptide_reminders FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reminders"
  ON public.peptide_reminders FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Updated_at trigger
CREATE TRIGGER update_peptide_reminders_updated_at
  BEFORE UPDATE ON public.peptide_reminders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

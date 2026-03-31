-- Patient Intake Form table
CREATE TABLE IF NOT EXISTS public.patient_intake (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date NOT NULL,
  sex text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  address text NOT NULL,
  emergency_contact_name text NOT NULL,
  emergency_contact_phone text NOT NULL,
  current_medications text,
  known_allergies text,
  reason_for_visit text NOT NULL,
  current_symptoms text NOT NULL,
  health_conditions text[] NOT NULL DEFAULT '{}',
  prior_surgeries boolean DEFAULT false,
  prior_surgeries_description text,
  blood_clots boolean DEFAULT false,
  prior_hormone_therapy boolean DEFAULT false,
  exercise_frequency text NOT NULL,
  sleep_quality text NOT NULL,
  stress_level integer NOT NULL DEFAULT 5,
  tobacco_use text NOT NULL,
  alcohol_use text NOT NULL,
  wellness_goals text NOT NULL,
  additional_notes text,
  consent_self_pay boolean DEFAULT false,
  consent_medical_services boolean DEFAULT false,
  consent_hipaa boolean DEFAULT false,
  signature text,
  submission_date date DEFAULT CURRENT_DATE,
  status text DEFAULT 'new',
  pdf_url text
);

-- Enable RLS
ALTER TABLE public.patient_intake ENABLE ROW LEVEL SECURITY;

-- Public can insert only (for the intake form)
CREATE POLICY "Anyone can submit intake form"
  ON public.patient_intake FOR INSERT
  WITH CHECK (true);

-- No public read
-- Staff read via service role key (bypasses RLS)

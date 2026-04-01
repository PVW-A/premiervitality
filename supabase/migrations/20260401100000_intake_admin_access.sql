-- Add membership_tier column to patient_intake
ALTER TABLE public.patient_intake
  ADD COLUMN IF NOT EXISTS membership_tier text DEFAULT NULL;

-- Allow admin users to read patient_intake records
CREATE POLICY "Admins can read intake records"
  ON public.patient_intake FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Allow admin users to update patient_intake records (status, membership_tier)
CREATE POLICY "Admins can update intake records"
  ON public.patient_intake FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Allow users to read their own intake record (matched by email)
CREATE POLICY "Users can read own intake by email"
  ON public.patient_intake FOR SELECT
  USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

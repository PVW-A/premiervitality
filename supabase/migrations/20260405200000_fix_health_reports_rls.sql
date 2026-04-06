-- Fix overly permissive UPDATE policy (was USING(true), allowing any user to update any row)
DROP POLICY IF EXISTS "Service role can update health reports" ON public.health_reports;

CREATE POLICY "Users can update own health reports"
  ON public.health_reports FOR UPDATE
  USING (auth.uid() = user_id);

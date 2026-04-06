-- Health Reports table for AI-analyzed bloodwork
CREATE TABLE public.health_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'processing',
  file_path TEXT,
  file_name TEXT,
  raw_analysis JSONB,
  vitality_score INTEGER,
  biological_age INTEGER,
  summary TEXT,
  biomarkers JSONB DEFAULT '[]'::jsonb
);

ALTER TABLE public.health_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own health reports"
  ON public.health_reports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health reports"
  ON public.health_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can update health reports"
  ON public.health_reports FOR UPDATE
  USING (true);

CREATE POLICY "Admins can manage all health reports"
  ON public.health_reports FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_health_reports_user_id ON public.health_reports(user_id);
CREATE INDEX idx_health_reports_created_at ON public.health_reports(created_at DESC);

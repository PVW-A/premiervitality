
-- Table for storing biomarker lab results over time
CREATE TABLE public.biomarker_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  marker_name TEXT NOT NULL,
  category TEXT NOT NULL,
  value NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  reference_low NUMERIC,
  reference_high NUMERIC,
  status TEXT NOT NULL DEFAULT 'in_range',
  lab_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.biomarker_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own biomarker results"
  ON public.biomarker_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own biomarker results"
  ON public.biomarker_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all biomarker results"
  ON public.biomarker_results FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_biomarker_results_user_date ON public.biomarker_results (user_id, lab_date DESC);
CREATE INDEX idx_biomarker_results_category ON public.biomarker_results (user_id, category);

-- Table for caching news articles
CREATE TABLE public.news_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  url TEXT NOT NULL,
  source TEXT NOT NULL,
  category TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view news articles"
  ON public.news_articles FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage news articles"
  ON public.news_articles FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

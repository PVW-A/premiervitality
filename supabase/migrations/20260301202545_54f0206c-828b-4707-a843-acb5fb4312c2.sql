
-- Protocol categories (Weight Management, Wellness, etc.)
CREATE TABLE public.protocol_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.protocol_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view protocol categories"
  ON public.protocol_categories FOR SELECT USING (true);

CREATE POLICY "Admins can manage protocol categories"
  ON public.protocol_categories FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Individual protocol packages (each with a tier level)
CREATE TABLE public.protocols (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.protocol_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('premier', 'core', 'essential')),
  description TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_cost NUMERIC NOT NULL DEFAULT 0,
  total_price NUMERIC NOT NULL DEFAULT 0,
  duration_weeks INTEGER NOT NULL DEFAULT 10,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.protocols ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view protocols"
  ON public.protocols FOR SELECT USING (true);

CREATE POLICY "Admins can manage protocols"
  ON public.protocols FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

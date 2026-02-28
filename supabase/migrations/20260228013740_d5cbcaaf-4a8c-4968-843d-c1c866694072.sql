
-- Table for recurring peptide subscriptions
CREATE TABLE public.peptide_subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  peptide_id uuid NOT NULL REFERENCES public.peptides(id),
  peptide_name text NOT NULL,
  variation_label text,
  price numeric NOT NULL,
  include_injection_kit boolean NOT NULL DEFAULT false,
  delivery_method text NOT NULL DEFAULT 'pickup',
  status text NOT NULL DEFAULT 'active', -- active, paused, cancelled
  next_charge_at date NOT NULL,
  last_charged_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.peptide_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own peptide subscriptions"
  ON public.peptide_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own peptide subscriptions"
  ON public.peptide_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own peptide subscriptions"
  ON public.peptide_subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all peptide subscriptions"
  ON public.peptide_subscriptions FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Timestamp trigger
CREATE TRIGGER update_peptide_subscriptions_updated_at
  BEFORE UPDATE ON public.peptide_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

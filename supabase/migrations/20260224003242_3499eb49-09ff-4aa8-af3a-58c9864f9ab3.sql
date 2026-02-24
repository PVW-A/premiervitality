
-- Create membership_tiers table
CREATE TABLE public.membership_tiers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  monthly_price NUMERIC NOT NULL,
  annual_price NUMERIC NOT NULL,
  discount_pct NUMERIC NOT NULL DEFAULT 0,
  blood_work_frequency TEXT NOT NULL,
  consultation_frequency TEXT NOT NULL,
  priority_support BOOLEAN NOT NULL DEFAULT false,
  features JSONB DEFAULT '[]'::jsonb,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create memberships table
CREATE TABLE public.memberships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tier_id UUID NOT NULL REFERENCES public.membership_tiers(id),
  billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'annual')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'past_due')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  renews_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.membership_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- membership_tiers: viewable by everyone (public info)
CREATE POLICY "Anyone can view membership tiers"
ON public.membership_tiers FOR SELECT
USING (true);

-- membership_tiers: admins can manage
CREATE POLICY "Admins can manage membership tiers"
ON public.membership_tiers FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- memberships: users can view own
CREATE POLICY "Users can view own membership"
ON public.memberships FOR SELECT
USING (auth.uid() = user_id);

-- memberships: admins can manage all
CREATE POLICY "Admins can manage all memberships"
ON public.memberships FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Updated at trigger for memberships
CREATE TRIGGER update_memberships_updated_at
BEFORE UPDATE ON public.memberships
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed the 3 tiers
INSERT INTO public.membership_tiers (name, slug, monthly_price, annual_price, discount_pct, blood_work_frequency, consultation_frequency, priority_support, features, sort_order)
VALUES
  ('Essential', 'essential', 99, 89, 5, 'Annual', 'Initial consultation only', false, '["Access to peptide catalog", "5% discount on peptides", "Annual blood work panel", "Email support"]'::jsonb, 1),
  ('Premium', 'premium', 199, 179, 15, 'Semi-annual', 'Quarterly check-ins', true, '["Access to peptide catalog", "15% discount on peptides", "Semi-annual blood work panels", "Quarterly physician check-ins", "Priority support"]'::jsonb, 2),
  ('Elite', 'elite', 349, 299, 25, 'Quarterly', 'Monthly check-ins', true, '["Access to peptide catalog", "25% discount on peptides", "Quarterly blood work panels", "Monthly physician check-ins", "Dedicated priority support", "Early access to new peptides"]'::jsonb, 3);

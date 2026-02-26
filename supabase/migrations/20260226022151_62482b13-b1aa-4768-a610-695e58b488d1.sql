
-- Create the Legacy (grandfathered) tier with Essential-level benefits at $0
INSERT INTO public.membership_tiers (
  name, slug, monthly_price, annual_price, discount_pct,
  blood_work_frequency, consultation_frequency, priority_support,
  sort_order, features
) VALUES (
  'Legacy', 'legacy', 0, 0, 0,
  'Vitality panel included',
  'As needed',
  false,
  -1,
  '["Full portal access", "Vitality bloodwork panel", "Peptide catalog access", "Grandfathered from existing practice"]'::jsonb
);

-- Auto-create active memberships for all profiles that have a square_customer_id
-- but do NOT already have an active membership
INSERT INTO public.memberships (user_id, tier_id, billing_cycle, status, started_at)
SELECT
  p.user_id,
  (SELECT id FROM public.membership_tiers WHERE slug = 'legacy'),
  'monthly',
  'active',
  now()
FROM public.profiles p
WHERE p.square_customer_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.memberships m
    WHERE m.user_id = p.user_id AND m.status = 'active'
  );

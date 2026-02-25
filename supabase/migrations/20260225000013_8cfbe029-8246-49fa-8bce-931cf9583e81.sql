
ALTER TABLE public.membership_tiers
ADD COLUMN square_plan_id_annual text;

COMMENT ON COLUMN public.membership_tiers.square_plan_id IS 'Square plan variation ID for monthly cadence';
COMMENT ON COLUMN public.membership_tiers.square_plan_id_annual IS 'Square plan variation ID for annual cadence';

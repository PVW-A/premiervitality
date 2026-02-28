
-- Update Essential tier: 1 Baseline + 1 Core Checkup
UPDATE public.membership_tiers 
SET 
  blood_work_frequency = '1 Baseline + 1 Core Checkup/year',
  features = '["Access to peptide catalog", "Full-price peptide access", "1 Baseline Panel at sign-up (100+ biomarkers, valued at $499)", "1 Core Checkup per year (40+ biomarkers, valued at $149)", "Email support"]'::jsonb
WHERE slug = 'essential';

-- Update Premium tier: 1 Baseline + 2 Core Checkups
UPDATE public.membership_tiers 
SET 
  blood_work_frequency = '1 Baseline + 2 Core Checkups/year',
  features = '["Access to peptide catalog", "15% discount on peptides", "1 Baseline Panel at sign-up (100+ biomarkers, valued at $499)", "2 Core Checkups per year (40+ biomarkers, valued at $149 each)", "Quarterly physician check-ins", "Priority support"]'::jsonb
WHERE slug = 'premium';

-- Update Elite tier: 1 Baseline + 3 Core Checkups
UPDATE public.membership_tiers 
SET 
  blood_work_frequency = '1 Baseline + 3 Core Checkups/year',
  features = '["Access to peptide catalog", "25% discount on peptides", "1 Baseline Panel at sign-up (100+ biomarkers, valued at $499)", "3 Core Checkups per year (40+ biomarkers, valued at $149 each)", "Monthly physician check-ins", "Dedicated priority support", "Early access to new peptides", "Optional epigenetic age testing add-on"]'::jsonb
WHERE slug = 'elite';

-- Update Legacy tier
UPDATE public.membership_tiers 
SET 
  blood_work_frequency = '1 Core Checkup/year',
  features = '["Access to peptide catalog", "Full-price peptide access", "1 Core Checkup per year (40+ biomarkers, valued at $149)", "Email support", "Grandfathered from existing practice"]'::jsonb
WHERE slug = 'legacy';

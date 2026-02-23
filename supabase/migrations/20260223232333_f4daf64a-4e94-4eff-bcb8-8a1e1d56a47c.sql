
-- Add pricing and detail columns to peptides
ALTER TABLE public.peptides ADD COLUMN IF NOT EXISTS price NUMERIC;
ALTER TABLE public.peptides ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.peptides ADD COLUMN IF NOT EXISTS benefits TEXT;
ALTER TABLE public.peptides ADD COLUMN IF NOT EXISTS candidates TEXT;
ALTER TABLE public.peptides ADD COLUMN IF NOT EXISTS administration TEXT;

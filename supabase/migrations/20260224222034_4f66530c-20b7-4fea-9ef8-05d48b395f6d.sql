ALTER TABLE public.peptide_requests
ADD COLUMN include_injection_kit boolean NOT NULL DEFAULT false,
ADD COLUMN delivery_method text DEFAULT null;
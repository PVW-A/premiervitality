
ALTER TABLE public.peptide_requests
  ADD COLUMN payment_url text,
  ADD COLUMN square_order_id text;

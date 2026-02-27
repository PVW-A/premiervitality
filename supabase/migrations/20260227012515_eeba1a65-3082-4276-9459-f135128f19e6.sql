-- Add card-on-file columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS square_card_id text,
  ADD COLUMN IF NOT EXISTS square_card_last4 text,
  ADD COLUMN IF NOT EXISTS square_card_brand text;
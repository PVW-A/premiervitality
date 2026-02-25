
-- Add address columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN address_line1 text,
ADD COLUMN address_city text,
ADD COLUMN address_state text,
ADD COLUMN address_zip text;

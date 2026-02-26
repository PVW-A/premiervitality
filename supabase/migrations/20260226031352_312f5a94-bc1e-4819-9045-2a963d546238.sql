
-- Add birthday and birthday_locked columns to profiles
ALTER TABLE public.profiles
ADD COLUMN birthday date DEFAULT NULL,
ADD COLUMN birthday_locked boolean NOT NULL DEFAULT false;

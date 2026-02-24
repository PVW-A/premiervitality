
-- Add square_customer_id to profiles for webhook lookup
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS square_customer_id text;
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_square_customer_id ON public.profiles (square_customer_id) WHERE square_customer_id IS NOT NULL;

-- Add square_plan_id to membership_tiers for webhook tier matching
ALTER TABLE public.membership_tiers ADD COLUMN IF NOT EXISTS square_plan_id text;

-- Ensure user_id is unique on memberships for upsert
ALTER TABLE public.memberships ADD CONSTRAINT memberships_user_id_unique UNIQUE (user_id);

-- Allow users to update their own payment_url requests (for the edit order flow)
CREATE POLICY "Users can update own request payment fields"
ON public.peptide_requests
FOR UPDATE
USING (auth.uid() = user_id);

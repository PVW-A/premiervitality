
-- Table to store account links between users
CREATE TABLE public.account_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_user_id uuid NOT NULL,
  invitee_user_id uuid,
  invitee_email text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  relationship text DEFAULT 'family',
  created_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz,
  UNIQUE(inviter_user_id, invitee_email)
);

ALTER TABLE public.account_links ENABLE ROW LEVEL SECURITY;

-- Security definer function to check if two users are linked
CREATE OR REPLACE FUNCTION public.are_accounts_linked(_user_a uuid, _user_b uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.account_links
    WHERE status = 'accepted'
    AND (
      (inviter_user_id = _user_a AND invitee_user_id = _user_b)
      OR (inviter_user_id = _user_b AND invitee_user_id = _user_a)
    )
  )
$$;

-- RLS for account_links table
CREATE POLICY "Users can view own links"
  ON public.account_links FOR SELECT
  USING (auth.uid() = inviter_user_id OR auth.uid() = invitee_user_id);

CREATE POLICY "Users can create invites"
  ON public.account_links FOR INSERT
  WITH CHECK (auth.uid() = inviter_user_id);

CREATE POLICY "Users can update links they're part of"
  ON public.account_links FOR UPDATE
  USING (auth.uid() = inviter_user_id OR auth.uid() = invitee_user_id);

CREATE POLICY "Users can delete own invites"
  ON public.account_links FOR DELETE
  USING (auth.uid() = inviter_user_id);

CREATE POLICY "Admins can manage all links"
  ON public.account_links FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Now update RLS on related tables to allow linked account visibility

-- biomarker_results: linked users can view each other's results
CREATE POLICY "Linked users can view biomarker results"
  ON public.biomarker_results FOR SELECT
  USING (are_accounts_linked(auth.uid(), user_id));

-- patient_peptides: linked users can view each other's peptides
CREATE POLICY "Linked users can view patient peptides"
  ON public.patient_peptides FOR SELECT
  USING (are_accounts_linked(auth.uid(), user_id));

-- peptide_requests: linked users can view each other's requests
CREATE POLICY "Linked users can view peptide requests"
  ON public.peptide_requests FOR SELECT
  USING (are_accounts_linked(auth.uid(), user_id));

-- orders: linked users can view each other's orders
CREATE POLICY "Linked users can view orders"
  ON public.orders FOR SELECT
  USING (are_accounts_linked(auth.uid(), user_id));

-- profiles: linked users can view each other's profiles (for names)
CREATE POLICY "Linked users can view profiles"
  ON public.profiles FOR SELECT
  USING (are_accounts_linked(auth.uid(), user_id));

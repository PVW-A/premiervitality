
CREATE TABLE public.peptide_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  peptide_id uuid NOT NULL REFERENCES public.peptides(id) ON DELETE CASCADE,
  peptide_name text NOT NULL,
  variation_label text,
  price numeric,
  status text NOT NULL DEFAULT 'pending',
  deny_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.peptide_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own requests" ON public.peptide_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own requests" ON public.peptide_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all requests" ON public.peptide_requests
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_peptide_requests_updated_at
  BEFORE UPDATE ON public.peptide_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

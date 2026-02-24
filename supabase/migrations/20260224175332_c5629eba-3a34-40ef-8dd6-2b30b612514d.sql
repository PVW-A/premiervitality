-- Drop the existing restrictive SELECT policy and replace with a permissive one for public access
DROP POLICY IF EXISTS "Authenticated can view peptides" ON public.peptides;

CREATE POLICY "Anyone can view peptides"
ON public.peptides
FOR SELECT
USING (true);
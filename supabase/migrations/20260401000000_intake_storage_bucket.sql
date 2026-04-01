-- Create storage bucket for patient intake PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('patient-intake-pdfs', 'patient-intake-pdfs', true)
ON CONFLICT (id) DO NOTHING;

-- Allow service role to upload (edge functions use service role key which bypasses RLS)
-- Allow public read access to PDFs via public URL
CREATE POLICY "Public can read intake PDFs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'patient-intake-pdfs');

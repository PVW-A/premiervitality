
-- Storage bucket for bloodwork uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('bloodwork', 'bloodwork', false);

-- Patients can upload to their own folder
CREATE POLICY "Users can upload own bloodwork"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'bloodwork' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Patients can view own bloodwork
CREATE POLICY "Users can view own bloodwork"
ON storage.objects FOR SELECT
USING (bucket_id = 'bloodwork' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Admins can view all bloodwork
CREATE POLICY "Admins can view all bloodwork"
ON storage.objects FOR SELECT
USING (bucket_id = 'bloodwork' AND has_role(auth.uid(), 'admin'::app_role));

-- Admins can delete bloodwork
CREATE POLICY "Admins can manage bloodwork"
ON storage.objects FOR DELETE
USING (bucket_id = 'bloodwork' AND has_role(auth.uid(), 'admin'::app_role));

-- Table for tracking bloodwork uploads
CREATE TABLE public.bloodwork_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_review',
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.bloodwork_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own uploads"
ON public.bloodwork_uploads FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own uploads"
ON public.bloodwork_uploads FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all uploads"
ON public.bloodwork_uploads FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

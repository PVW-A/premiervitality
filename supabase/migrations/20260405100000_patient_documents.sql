-- Patient documents table for portal Documents tab
CREATE TABLE public.patient_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'other',
  file_path TEXT NOT NULL,
  file_size INTEGER,
  visible_to_patient BOOLEAN NOT NULL DEFAULT true,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.patient_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents"
  ON public.patient_documents FOR SELECT
  USING (auth.uid() = user_id AND visible_to_patient = true);

CREATE POLICY "Service role can insert documents"
  ON public.patient_documents FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can manage all documents"
  ON public.patient_documents FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_patient_documents_user_id ON public.patient_documents(user_id);

-- Storage bucket for patient documents (private, per-user folder structure)
INSERT INTO storage.buckets (id, name, public) VALUES ('patient-documents', 'patient-documents', false);

CREATE POLICY "Users can view own patient documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'patient-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Service role can upload patient documents"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'patient-documents');

CREATE POLICY "Admins can manage patient documents storage"
  ON storage.objects FOR ALL
  USING (bucket_id = 'patient-documents' AND has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for resources
INSERT INTO storage.buckets (id, name, public) VALUES ('resources', 'resources', true);

-- Create table to track uploaded resources
CREATE TABLE public.resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  category TEXT NOT NULL CHECK (category IN ('study_material', 'project')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Public can view all resources
CREATE POLICY "Public can view resources"
ON public.resources
FOR SELECT
USING (true);

-- Only admins can insert resources
CREATE POLICY "Admins can insert resources"
ON public.resources
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update resources
CREATE POLICY "Admins can update resources"
ON public.resources
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete resources
CREATE POLICY "Admins can delete resources"
ON public.resources
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Storage policies for resources bucket
CREATE POLICY "Public can view resource files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'resources');

CREATE POLICY "Admins can upload resource files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'resources' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update resource files"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'resources' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete resource files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'resources' AND has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_resources_updated_at
BEFORE UPDATE ON public.resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
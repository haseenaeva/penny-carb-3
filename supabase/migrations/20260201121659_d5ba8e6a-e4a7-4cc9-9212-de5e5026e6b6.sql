-- Add storage policies for special-offers bucket

-- Allow anyone to view special offer images (public bucket)
CREATE POLICY "Anyone can view special offer images"
ON storage.objects FOR SELECT
USING (bucket_id = 'special-offers');

-- Allow admins to upload special offer images
CREATE POLICY "Admins can upload special offer images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'special-offers' 
  AND (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
);

-- Allow admins to update special offer images
CREATE POLICY "Admins can update special offer images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'special-offers' 
  AND (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
);

-- Allow admins to delete special offer images
CREATE POLICY "Admins can delete special offer images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'special-offers' 
  AND (has_role(auth.uid(), 'super_admin'::app_role) OR has_role(auth.uid(), 'admin'::app_role))
);
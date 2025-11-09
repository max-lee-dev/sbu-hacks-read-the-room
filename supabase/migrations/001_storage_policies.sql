-- Storage policies for videos bucket
-- This allows public read access and anon/authenticated uploads
-- Note: RLS is already enabled on storage.objects by default in Supabase

-- Public read access for videos bucket
CREATE POLICY "Public read videos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'videos');

-- Allow anonymous users to upload to videos bucket (for development)
CREATE POLICY "Anon can upload to videos"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'videos');

-- Allow authenticated users to upload to videos bucket
CREATE POLICY "Authenticated can upload to videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'videos');


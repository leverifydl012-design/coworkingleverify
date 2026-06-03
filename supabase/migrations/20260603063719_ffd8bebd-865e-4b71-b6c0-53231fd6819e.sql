CREATE TABLE public.image_overrides (
  image_id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.image_overrides TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.image_overrides TO authenticated;
GRANT ALL ON public.image_overrides TO service_role;

ALTER TABLE public.image_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view image overrides"
ON public.image_overrides FOR SELECT
USING (true);

CREATE POLICY "Authenticated can insert image overrides"
ON public.image_overrides FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated can update image overrides"
ON public.image_overrides FOR UPDATE TO authenticated
USING (true);

CREATE POLICY "Authenticated can delete image overrides"
ON public.image_overrides FOR DELETE TO authenticated
USING (true);

-- Storage policies for site-images bucket (bucket will be created via tool)
CREATE POLICY "Public can view site images"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-images');

CREATE POLICY "Authenticated can upload site images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'site-images');

CREATE POLICY "Authenticated can update site images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'site-images');

CREATE POLICY "Authenticated can delete site images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'site-images');
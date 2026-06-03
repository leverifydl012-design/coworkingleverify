-- Remove permissive write policies on image_overrides
DROP POLICY IF EXISTS "Anyone can insert image overrides" ON public.image_overrides;
DROP POLICY IF EXISTS "Anyone can update image overrides" ON public.image_overrides;
DROP POLICY IF EXISTS "Anyone can delete image overrides" ON public.image_overrides;
-- SELECT policy "Anyone can view image overrides" intentionally kept (public read)

-- Remove permissive write policies on storage.objects for site-images bucket
DROP POLICY IF EXISTS "Authenticated can upload site images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update site images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete site images" ON storage.objects;
-- SELECT policy "Public can view site images" intentionally kept (public read)

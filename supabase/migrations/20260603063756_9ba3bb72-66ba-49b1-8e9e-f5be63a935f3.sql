DROP POLICY IF EXISTS "Authenticated can insert image overrides" ON public.image_overrides;
DROP POLICY IF EXISTS "Authenticated can update image overrides" ON public.image_overrides;
DROP POLICY IF EXISTS "Authenticated can delete image overrides" ON public.image_overrides;

CREATE POLICY "Anyone can insert image overrides"
ON public.image_overrides FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can update image overrides"
ON public.image_overrides FOR UPDATE TO anon, authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can delete image overrides"
ON public.image_overrides FOR DELETE TO anon, authenticated
USING (true);

GRANT INSERT, UPDATE, DELETE ON public.image_overrides TO anon;
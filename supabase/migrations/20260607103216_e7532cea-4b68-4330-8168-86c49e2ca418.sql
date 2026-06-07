
-- Explicit deny SELECT for anon/authenticated on PII tables (defense in depth)
REVOKE SELECT ON public.bookings FROM anon, authenticated;
REVOKE SELECT ON public.inquiries FROM anon, authenticated;
REVOKE SELECT ON public.members FROM anon, authenticated;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.events FROM anon, authenticated;

-- Service role retains full access for trusted server-side use
GRANT ALL ON public.bookings TO service_role;
GRANT ALL ON public.inquiries TO service_role;
GRANT ALL ON public.members TO service_role;
GRANT ALL ON public.events TO service_role;

-- Add explicit restrictive SELECT-deny policies to make intent unambiguous
CREATE POLICY "Deny anon/authenticated select on bookings"
  ON public.bookings FOR SELECT TO anon, authenticated USING (false);

CREATE POLICY "Deny anon/authenticated select on inquiries"
  ON public.inquiries FOR SELECT TO anon, authenticated USING (false);

CREATE POLICY "Deny anon/authenticated select on members"
  ON public.members FOR SELECT TO anon, authenticated USING (false);

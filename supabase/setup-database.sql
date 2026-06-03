-- Run this once in Supabase Dashboard → SQL Editor (project: nbtotsrcbcvfwfkvcfjf)
-- Fixes: "Could not find the 'image_id' column of 'image_overrides'"

-- Recreate image_overrides with the correct columns (safe if table was missing or wrong shape)
DROP TABLE IF EXISTS public.image_overrides CASCADE;

CREATE TABLE public.image_overrides (
  image_id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.image_overrides TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.image_overrides TO authenticated;
GRANT ALL ON public.image_overrides TO service_role;

ALTER TABLE public.image_overrides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view image overrides" ON public.image_overrides;
CREATE POLICY "Anyone can view image overrides"
  ON public.image_overrides FOR SELECT
  USING (true);

-- Admin / site data tables
CREATE TABLE IF NOT EXISTS public.members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  plan text NOT NULL DEFAULT 'Day Pass',
  status text NOT NULL DEFAULT 'Active',
  joined text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_name text NOT NULL,
  member_email text NOT NULL,
  member_phone text NOT NULL DEFAULT '',
  company text,
  notes text,
  space text NOT NULL DEFAULT 'Desk',
  date text NOT NULL,
  time text NOT NULL,
  duration text NOT NULL DEFAULT 'Monthly',
  people integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'Pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  date text NOT NULL,
  type text NOT NULL DEFAULT 'Engagement',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  interest text NOT NULL,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members: anyone can view" ON public.members;
CREATE POLICY "Members: anyone can view" ON public.members FOR SELECT USING (true);
DROP POLICY IF EXISTS "Members: anyone can insert" ON public.members;
CREATE POLICY "Members: anyone can insert" ON public.members FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Bookings: anyone can view" ON public.bookings;
CREATE POLICY "Bookings: anyone can view" ON public.bookings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Bookings: anyone can insert" ON public.bookings;
CREATE POLICY "Bookings: anyone can insert" ON public.bookings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Events: anyone can view" ON public.events;
CREATE POLICY "Events: anyone can view" ON public.events FOR SELECT USING (true);
DROP POLICY IF EXISTS "Events: anyone can insert" ON public.events;
CREATE POLICY "Events: anyone can insert" ON public.events FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Inquiries: anyone can view" ON public.inquiries;
CREATE POLICY "Inquiries: anyone can view" ON public.inquiries FOR SELECT USING (true);
DROP POLICY IF EXISTS "Inquiries: anyone can insert" ON public.inquiries;
CREATE POLICY "Inquiries: anyone can insert" ON public.inquiries FOR INSERT WITH CHECK (true);

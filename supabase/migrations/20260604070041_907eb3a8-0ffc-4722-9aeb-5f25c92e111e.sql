
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

GRANT INSERT ON public.bookings TO anon, authenticated;
GRANT INSERT ON public.inquiries TO anon, authenticated;
GRANT ALL ON public.members TO service_role;
GRANT ALL ON public.bookings TO service_role;
GRANT ALL ON public.events TO service_role;
GRANT ALL ON public.inquiries TO service_role;

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a booking" ON public.bookings
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Anyone can submit an inquiry" ON public.inquiries
  FOR INSERT TO anon, authenticated WITH CHECK (true);

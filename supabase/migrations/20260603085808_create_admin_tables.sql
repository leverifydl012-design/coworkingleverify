/*
  # Create admin data tables

  1. New Tables
    - `members` - Coworking space members
    - `bookings` - Space booking requests
    - `events` - Community calendar events
    - `inquiries` - Contact form submissions

  2. Security
    - Enable RLS on all tables
    - Add permissive policies for public access
*/

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

CREATE POLICY "Members: anyone can view" ON public.members FOR SELECT USING (true);
CREATE POLICY "Members: anyone can insert" ON public.members FOR INSERT WITH CHECK (true);
CREATE POLICY "Members: anyone can update" ON public.members FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Members: anyone can delete" ON public.members FOR DELETE USING (true);

CREATE POLICY "Bookings: anyone can view" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Bookings: anyone can insert" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Bookings: anyone can update" ON public.bookings FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Bookings: anyone can delete" ON public.bookings FOR DELETE USING (true);

CREATE POLICY "Events: anyone can view" ON public.events FOR SELECT USING (true);
CREATE POLICY "Events: anyone can insert" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "Events: anyone can update" ON public.events FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Events: anyone can delete" ON public.events FOR DELETE USING (true);

CREATE POLICY "Inquiries: anyone can view" ON public.inquiries FOR SELECT USING (true);
CREATE POLICY "Inquiries: anyone can insert" ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Inquiries: anyone can update" ON public.inquiries FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Inquiries: anyone can delete" ON public.inquiries FOR DELETE USING (true);

INSERT INTO public.members (name, email, plan, status, joined) VALUES
  ('Ayesha Khan', 'ayesha@studio.pk', 'Monthly Membership', 'Active', '2026-05-04'),
  ('Hamza Raza', 'hamza@indie.dev', 'Weekly Pass', 'Active', '2026-05-22'),
  ('Sana Ali', 'sana@growth.co', 'Monthly Membership', 'Active', '2026-04-18'),
  ('Bilal Sheikh', 'bilal@freelance.pk', 'Day Pass', 'Trial', '2026-05-30')
ON CONFLICT DO NOTHING;

INSERT INTO public.bookings (member_name, member_email, member_phone, space, date, time, status) VALUES
  ('Ayesha Khan', 'ayesha@studio.pk', '', 'Meeting Room', '2026-06-03', '11:00–12:00', 'Confirmed'),
  ('Hamza Raza', 'hamza@indie.dev', '', 'Desk', '2026-06-02', 'All day', 'Confirmed'),
  ('Sana Ali', 'sana@growth.co', '', 'Private Office', '2026-06-04', '14:00–17:00', 'Pending')
ON CONFLICT DO NOTHING;

INSERT INTO public.events (title, date, type) VALUES
  ('Founder Coffee & Intros', '2026-06-08', 'Networking'),
  ('Product Thinking Workshop', '2026-06-12', 'Workshop'),
  ('Remote Work Best Practices', '2026-06-18', 'Development'),
  ('Community Dinner', '2026-06-23', 'Engagement')
ON CONFLICT DO NOTHING;

INSERT INTO public.inquiries (name, email, interest, message) VALUES
  ('Zainab Tariq', 'zainab@agency.pk', 'Private Office', 'Looking for a 3-seater office.'),
  ('Usman Javed', 'usman@dev.io', 'Monthly Membership', 'Need 24/7 access.')
ON CONFLICT DO NOTHING;

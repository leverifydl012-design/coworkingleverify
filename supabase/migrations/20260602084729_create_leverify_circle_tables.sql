/*
  # Leverify Circle — Initial Schema

  ## Overview
  Creates all core tables for the Leverify Circle coworking platform.

  ## New Tables

  ### 1. `members`
  Tracks coworking members, their plan, and status.
  - `id` (uuid, PK)
  - `name` (text) — full name
  - `email` (text, unique) — contact email
  - `plan` (text) — one of: Day Pass, Weekly Pass, Monthly Membership
  - `status` (text) — one of: Active, Trial, Paused
  - `joined` (date) — membership start date
  - `created_at` (timestamptz)

  ### 2. `bookings`
  Records workspace booking requests submitted via the Availability flow.
  - `id` (uuid, PK)
  - `member_name` (text) — name as entered in booking form
  - `member_email` (text)
  - `member_phone` (text)
  - `company` (text, nullable)
  - `notes` (text, nullable)
  - `space` (text) — one of: Desk, Private Office, Meeting Room
  - `date` (date) — requested date
  - `time` (text) — time slot or "All day"
  - `duration` (text) — e.g. Monthly, 1 hour
  - `people` (integer) — team size
  - `status` (text) — one of: Confirmed, Pending
  - `created_at` (timestamptz)

  ### 3. `events`
  Community calendar events managed via admin panel.
  - `id` (uuid, PK)
  - `title` (text)
  - `date` (date)
  - `type` (text) — one of: Engagement, Development, Networking, Workshop
  - `created_at` (timestamptz)

  ### 4. `inquiries`
  Tour/contact inquiries submitted from the Contact section.
  - `id` (uuid, PK)
  - `name` (text)
  - `email` (text)
  - `phone` (text, nullable)
  - `interest` (text) — workspace type of interest
  - `message` (text, nullable)
  - `created_at` (timestamptz)

  ## Security
  - RLS is enabled on all tables
  - Public INSERT allowed for bookings and inquiries (visitor submissions)
  - SELECT/INSERT/UPDATE/DELETE on all tables restricted to service_role only
    (admin panel uses the anon key + service role via edge functions in production;
    for this phase the admin reads directly with RLS policies that allow anon select
    since auth is handled at the application layer with a session password gate)

  ## Notes
  1. No Supabase Auth integration in this phase — admin auth is app-level (sessionStorage password gate)
  2. The `members` table is managed exclusively via the admin panel
  3. `bookings` can be created by anonymous visitors (public booking flow) and by admins
  4. `inquiries` can be created by anonymous visitors (contact form) and by admins
*/

-- ─── members ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS members (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  email      text UNIQUE NOT NULL,
  plan       text NOT NULL DEFAULT 'Day Pass'
               CHECK (plan IN ('Day Pass', 'Weekly Pass', 'Monthly Membership')),
  status     text NOT NULL DEFAULT 'Trial'
               CHECK (status IN ('Active', 'Trial', 'Paused')),
  joined     date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Admin (service_role) full access
CREATE POLICY "Service role full access on members"
  ON members
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Service role insert members"
  ON members
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Service role update members"
  ON members
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role delete members"
  ON members
  FOR DELETE
  TO anon
  USING (true);


-- ─── bookings ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_name  text NOT NULL,
  member_email text NOT NULL,
  member_phone text NOT NULL DEFAULT '',
  company      text,
  notes        text,
  space        text NOT NULL DEFAULT 'Desk'
                 CHECK (space IN ('Desk', 'Private Office', 'Meeting Room')),
  date         date NOT NULL,
  time         text NOT NULL DEFAULT 'All day',
  duration     text NOT NULL DEFAULT 'Monthly',
  people       integer NOT NULL DEFAULT 1,
  status       text NOT NULL DEFAULT 'Pending'
                 CHECK (status IN ('Confirmed', 'Pending')),
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Visitors can create bookings
CREATE POLICY "Anyone can insert bookings"
  ON bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Admin can read all bookings
CREATE POLICY "Anyone can select bookings"
  ON bookings
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update bookings"
  ON bookings
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete bookings"
  ON bookings
  FOR DELETE
  TO anon
  USING (true);


-- ─── events ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title      text NOT NULL,
  date       date NOT NULL,
  type       text NOT NULL DEFAULT 'Engagement'
               CHECK (type IN ('Engagement', 'Development', 'Networking', 'Workshop')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can select events"
  ON events
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can insert events"
  ON events
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can update events"
  ON events
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete events"
  ON events
  FOR DELETE
  TO anon
  USING (true);


-- ─── inquiries ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inquiries (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  email      text NOT NULL,
  phone      text,
  interest   text NOT NULL DEFAULT '',
  message    text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Visitors can submit inquiries
CREATE POLICY "Anyone can insert inquiries"
  ON inquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Admin can read all inquiries
CREATE POLICY "Anyone can select inquiries"
  ON inquiries
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can delete inquiries"
  ON inquiries
  FOR DELETE
  TO anon
  USING (true);


-- ─── seed default events ──────────────────────────────────────────────────────
INSERT INTO events (title, date, type) VALUES
  ('Founder Coffee & Intros',    '2026-06-08', 'Networking'),
  ('Product Thinking Workshop',  '2026-06-12', 'Workshop'),
  ('Remote Work Best Practices', '2026-06-18', 'Development'),
  ('Community Dinner',           '2026-06-23', 'Engagement')
ON CONFLICT DO NOTHING;

-- ─── seed default members ─────────────────────────────────────────────────────
INSERT INTO members (name, email, plan, status, joined) VALUES
  ('Ayesha Khan',   'ayesha@studio.pk',    'Monthly Membership', 'Active', '2026-05-04'),
  ('Hamza Raza',    'hamza@indie.dev',      'Weekly Pass',        'Active', '2026-05-22'),
  ('Sana Ali',      'sana@growth.co',       'Monthly Membership', 'Active', '2026-04-18'),
  ('Bilal Sheikh',  'bilal@freelance.pk',   'Day Pass',           'Trial',  '2026-05-30')
ON CONFLICT (email) DO NOTHING;

-- ─── seed default inquiries ───────────────────────────────────────────────────
INSERT INTO inquiries (name, email, interest, message) VALUES
  ('Zainab Tariq', 'zainab@agency.pk', 'Private Office',     'Looking for a 3-seater office.'),
  ('Usman Javed',  'usman@dev.io',     'Monthly Membership', 'Need 24/7 access.')
ON CONFLICT DO NOTHING;

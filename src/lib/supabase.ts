import { createClient } from "@supabase/supabase-js";

export type MemberPlan = "Day Pass" | "Weekly Pass" | "Monthly Membership";
export type MemberStatus = "Active" | "Trial" | "Paused";
export type SpaceType = "Desk" | "Private Office" | "Meeting Room";
export type BookingStatus = "Confirmed" | "Pending";
export type EventType = "Engagement" | "Development" | "Networking" | "Workshop";

export type Member = {
  id: string;
  name: string;
  email: string;
  plan: MemberPlan;
  status: MemberStatus;
  joined: string;
  created_at: string;
};

export type Booking = {
  id: string;
  member_name: string;
  member_email: string;
  member_phone: string;
  company: string | null;
  notes: string | null;
  space: SpaceType;
  date: string;
  time: string;
  duration: string;
  people: number;
  status: BookingStatus;
  created_at: string;
};

export type Event = {
  id: string;
  title: string;
  date: string;
  type: EventType;
  created_at: string;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  interest: string;
  message: string | null;
  created_at: string;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

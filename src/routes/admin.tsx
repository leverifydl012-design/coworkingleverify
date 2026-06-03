import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Users, CalendarDays, ClipboardList, Inbox, TrendingUp, Plus, Trash2, LogOut, ShieldCheck, ExternalLink, Loader as Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  supabase,
  type Member,
  type MemberPlan,
  type MemberStatus,
  type Booking,
  type SpaceType,
  type BookingStatus,
  type Event,
  type EventType,
  type Inquiry,
} from "@/lib/supabase";

export const Route = createFileRoute("/admin")({
  component: AdminPanel,
  preload: false,
  loader: async () => {
    if (typeof window === "undefined") return null;
    return null;
  },
  head: () => ({
    meta: [
      { title: "Admin · Leverify Circle" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

const ADMIN_EMAIL = "Asidsarfraz@gmail.com";
const ADMIN_PASSWORD = "7654321";
const AUTH_KEY = "leverify-circle-admin-auth";


function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<"overview" | "members" | "bookings" | "calendar" | "inquiries">(
    "overview",
  );
  const [members, setMembers] = useState<Member[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAuthed(typeof window !== "undefined" && sessionStorage.getItem(AUTH_KEY) === "ok");
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [m, b, e, i] = await Promise.all([
        supabase.from("members").select("*").order("created_at", { ascending: false }),
        supabase.from("bookings").select("*").order("created_at", { ascending: false }),
        supabase.from("events").select("*").order("date", { ascending: true }),
        supabase.from("inquiries").select("*").order("created_at", { ascending: false }),
      ]);
      if (m.data) setMembers(m.data as Member[]);
      if (b.data) setBookings(b.data as Booking[]);
      if (e.data) setEvents(e.data as Event[]);
      if (i.data) setInquiries(i.data as Inquiry[]);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) fetchAll();
  }, [authed, fetchAll]);

  const stats = useMemo(
    () => [
      {
        label: "Active members",
        value: members.filter((m) => m.status === "Active").length,
        icon: Users,
      },
      { label: "Bookings", value: bookings.length, icon: ClipboardList },
      { label: "Upcoming events", value: events.length, icon: CalendarDays },
      { label: "Open inquiries", value: inquiries.length, icon: Inbox },
    ],
    [members, bookings, events, inquiries],
  );

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-card">
        <div className="container-px mx-auto max-w-7xl flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-foreground text-background flex items-center justify-center">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <div className="font-display font-bold text-foreground">
                Leverify Circle · Admin
              </div>
              <div className="text-xs text-muted-foreground">Internal operations dashboard</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-foreground text-background text-sm font-semibold px-4 py-2 shadow-elegant hover:opacity-90 transition"
              title="Open live website"
            >
              <ExternalLink className="size-4" /> View live site
            </Link>
            <button
              onClick={() => {
                sessionStorage.removeItem(AUTH_KEY);
                window.dispatchEvent(new Event("leverify-admin-auth"));
                setAuthed(false);
              }}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2"
            >
              <LogOut className="size-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="container-px mx-auto max-w-7xl py-8">
        <nav className="flex flex-wrap gap-2 mb-8">
          {(
            [
              ["overview", "Overview", TrendingUp],
              ["members", "Members", Users],
              ["bookings", "Bookings", ClipboardList],
              ["calendar", "Calendar", CalendarDays],
              ["inquiries", "Inquiries", Inbox],
            ] as const
          ).map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                tab === key
                  ? "bg-foreground text-background shadow-elegant"
                  : "bg-card border border-border text-foreground/80 hover:bg-accent"
              }`}
            >
              <Icon className="size-4" /> {label}
            </button>
          ))}
        </nav>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {tab === "overview" && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-2xl bg-card border border-border p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">
                        {s.label}
                      </span>
                      <s.icon className="size-4 text-gold" />
                    </div>
                    <div className="mt-3 font-display text-4xl font-bold text-foreground">
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "members" && (
              <CrudTable
                title="Members"
                columns={["Name", "Email", "Plan", "Status", "Joined"]}
                rows={members.map((m) => [m.name, m.email, m.plan, m.status, m.joined])}
                onAdd={async (values) => {
                  const { data } = await supabase
                    .from("members")
                    .insert({
                      name: values[0],
                      email: values[1],
                      plan: (values[2] as MemberPlan) || "Day Pass",
                      status: (values[3] as MemberStatus) || "Active",
                      joined: values[4] || new Date().toISOString().slice(0, 10),
                    })
                    .select()
                    .maybeSingle();
                  if (data) setMembers((prev) => [data as Member, ...prev]);
                }}
                onDelete={async (i) => {
                  const id = members[i].id;
                  await supabase.from("members").delete().eq("id", id);
                  setMembers((prev) => prev.filter((_, idx) => idx !== i));
                }}
              />
            )}

            {tab === "bookings" && (
              <CrudTable
                title="Bookings"
                columns={["Member", "Space", "Date", "Time", "Status"]}
                rows={bookings.map((b) => [b.member_name, b.space, b.date, b.time, b.status])}
                onAdd={async (v) => {
                  const { data } = await supabase
                    .from("bookings")
                    .insert({
                      member_name: v[0],
                      member_email: "",
                      member_phone: "",
                      space: (v[1] as SpaceType) || "Desk",
                      date: v[2],
                      time: v[3],
                      duration: "Monthly",
                      people: 1,
                      status: (v[4] as BookingStatus) || "Pending",
                    })
                    .select()
                    .maybeSingle();
                  if (data) setBookings((prev) => [data as Booking, ...prev]);
                }}
                onDelete={async (i) => {
                  const id = bookings[i].id;
                  await supabase.from("bookings").delete().eq("id", id);
                  setBookings((prev) => prev.filter((_, idx) => idx !== i));
                }}
              />
            )}

            {tab === "calendar" && (
              <CrudTable
                title="Community Calendar"
                columns={["Title", "Date", "Type"]}
                rows={events.map((e) => [e.title, e.date, e.type])}
                onAdd={async (v) => {
                  const { data } = await supabase
                    .from("events")
                    .insert({
                      title: v[0],
                      date: v[1],
                      type: (v[2] as EventType) || "Engagement",
                    })
                    .select()
                    .maybeSingle();
                  if (data) setEvents((prev) => [...prev, data as Event]);
                }}
                onDelete={async (i) => {
                  const id = events[i].id;
                  await supabase.from("events").delete().eq("id", id);
                  setEvents((prev) => prev.filter((_, idx) => idx !== i));
                }}
              />
            )}

            {tab === "inquiries" && (
              <div className="rounded-2xl bg-card border border-border overflow-hidden">
                <div className="px-5 py-4 border-b border-border font-display font-bold text-foreground">
                  Inquiries
                </div>
                <ul className="divide-y divide-border">
                  {inquiries.map((q, i) => (
                    <li key={q.id} className="p-5 flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-foreground">{q.name}</span>
                          <span className="text-xs text-muted-foreground">· {q.email}</span>
                          <span className="text-xs rounded-full bg-gold/15 text-gold px-2 py-0.5">
                            {q.interest}
                          </span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {q.created_at.slice(0, 10)}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{q.message}</p>
                      </div>
                      <button
                        onClick={async () => {
                          await supabase.from("inquiries").delete().eq("id", q.id);
                          setInquiries((prev) => prev.filter((_, idx) => idx !== i));
                        }}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label="Delete"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </li>
                  ))}
                  {inquiries.length === 0 && (
                    <li className="p-8 text-center text-sm text-muted-foreground">
                      No inquiries yet.
                    </li>
                  )}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function CrudTable({
  title,
  columns,
  rows,
  onAdd,
  onDelete,
}: {
  title: string;
  columns: string[];
  rows: string[][];
  onAdd: (values: string[]) => Promise<void>;
  onDelete: (index: number) => Promise<void>;
}) {
  const [draft, setDraft] = useState<string[]>(Array(columns.length).fill(""));
  const [saving, setSaving] = useState(false);
  const canAdd = draft.every((v) => v.trim().length > 0);

  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <span className="font-display font-bold text-foreground">{title}</span>
        <span className="text-xs text-muted-foreground">{rows.length} total</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              {columns.map((c) => (
                <th key={c} className="text-left px-5 py-3 font-semibold">
                  {c}
                </th>
              ))}
              <th className="w-12" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-border hover:bg-muted/30">
                {row.map((cell, j) => (
                  <td key={j} className="px-5 py-3 text-foreground/90">
                    {cell}
                  </td>
                ))}
                <td className="px-3">
                  <button
                    onClick={() => onDelete(i)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Delete"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
            <tr className="border-t border-border bg-muted/20">
              {draft.map((v, i) => (
                <td key={i} className="px-3 py-2">
                  <input
                    value={v}
                    onChange={(e) =>
                      setDraft((d) => d.map((x, idx) => (idx === i ? e.target.value : x)))
                    }
                    placeholder={columns[i]}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold"
                  />
                </td>
              ))}
              <td className="px-3">
                <button
                  disabled={!canAdd || saving}
                  onClick={async () => {
                    setSaving(true);
                    await onAdd(draft);
                    setDraft(Array(columns.length).fill(""));
                    setSaving(false);
                  }}
                  className="inline-flex items-center justify-center size-9 rounded-lg bg-foreground text-background disabled:opacity-40"
                  aria-label="Add"
                >
                  {saving ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Plus className="size-4" />
                  )}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (
      email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
      pwd === ADMIN_PASSWORD
    ) {
      sessionStorage.setItem(AUTH_KEY, "ok");
      window.dispatchEvent(new Event("leverify-admin-auth"));
      onSuccess();
    } else {
      setErr("Incorrect email or password.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl bg-card border border-border p-8 shadow-elegant"
      >
        <div className="size-12 rounded-xl bg-foreground text-background flex items-center justify-center">
          <ShieldCheck className="size-6" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold text-foreground">Admin sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Internal access for Leverify Circle operations.
        </p>

        <label className="block mt-6">
          <span className="block text-xs font-semibold text-foreground/80 mb-1.5">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErr("");
            }}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold"
            placeholder="you@example.com"
            autoFocus
          />
        </label>

        <label className="block mt-4">
          <span className="block text-xs font-semibold text-foreground/80 mb-1.5">Password</span>
          <input
            type="password"
            value={pwd}
            onChange={(e) => {
              setPwd(e.target.value);
              setErr("");
            }}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold"
            placeholder="••••••••"
          />
        </label>
        {err && <p className="mt-2 text-xs text-destructive">{err}</p>}

        <button
          type="submit"
          className="mt-6 w-full inline-flex justify-center rounded-full bg-foreground text-background px-5 py-3 text-sm font-semibold hover:opacity-90 transition"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}

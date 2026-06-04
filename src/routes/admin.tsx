import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Users,
  CalendarDays,
  ClipboardList,
  Inbox,
  TrendingUp,
  LogOut,
  ShieldCheck,
  ExternalLink,
  Loader as Loader2,
  Plus,
  Trash2,
  Search,
  Download,
  Activity,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Filter,
  MoreVertical,
  CheckCircle2,
  Clock,
  XCircle,
  Mail,
  Phone,
  Building2,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  ADMIN_EMAIL,
  AUTH_KEY,
  clearAdminSession,
  DEFAULT_ADMIN_PASSWORD,
  persistAdminSession,
} from "@/lib/admin-auth";
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

type Tab = "overview" | "members" | "bookings" | "calendar" | "inquiries";

const PLAN_PRICES: Record<string, number> = {
  "Day Pass": 2500,
  "Weekly Pass": 12000,
  "Monthly Membership": 35000,
};

function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const [members, setMembers] = useState<Member[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const revenue = useMemo(
    () =>
      members
        .filter((m) => m.status === "Active")
        .reduce((s, m) => s + (PLAN_PRICES[m.plan] || 0), 0),
    [members],
  );

  const activityFeed = useMemo(() => {
    const items: { id: string; type: string; title: string; time: string; icon: typeof Users; color: string }[] = [];
    bookings.slice(0, 4).forEach((b) =>
      items.push({
        id: `b-${b.id}`,
        type: "Booking",
        title: `${b.member_name} booked ${b.space}`,
        time: b.created_at,
        icon: ClipboardList,
        color: "text-blue-600 bg-blue-100",
      }),
    );
    inquiries.slice(0, 4).forEach((q) =>
      items.push({
        id: `i-${q.id}`,
        type: "Inquiry",
        title: `${q.name} · ${q.interest}`,
        time: q.created_at,
        icon: Inbox,
        color: "text-amber-600 bg-amber-100",
      }),
    );
    members.slice(0, 4).forEach((m) =>
      items.push({
        id: `m-${m.id}`,
        type: "Member",
        title: `${m.name} joined (${m.plan})`,
        time: m.created_at,
        icon: Users,
        color: "text-emerald-600 bg-emerald-100",
      }),
    );
    return items
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 8);
  }, [bookings, inquiries, members]);

  const stats = useMemo(
    () => [
      {
        label: "Monthly Revenue",
        value: `PKR ${revenue.toLocaleString()}`,
        sub: "From active plans",
        trend: 12.4,
        icon: DollarSign,
        gradient: "from-emerald-500 to-teal-600",
      },
      {
        label: "Active Members",
        value: members.filter((m) => m.status === "Active").length,
        sub: `${members.length} total`,
        trend: 8.2,
        icon: Users,
        gradient: "from-violet-500 to-indigo-600",
      },
      {
        label: "Bookings",
        value: bookings.length,
        sub: `${bookings.filter((b) => b.status === "Pending").length} pending`,
        trend: -3.1,
        icon: ClipboardList,
        gradient: "from-blue-500 to-cyan-600",
      },
      {
        label: "Open Inquiries",
        value: inquiries.length,
        sub: "Awaiting response",
        trend: 24.0,
        icon: Inbox,
        gradient: "from-amber-500 to-orange-600",
      },
    ],
    [members, bookings, inquiries, revenue],
  );

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;

  const navItems: { key: Tab; label: string; icon: typeof Users; badge?: number }[] = [
    { key: "overview", label: "Overview", icon: TrendingUp },
    { key: "members", label: "Members", icon: Users, badge: members.length },
    { key: "bookings", label: "Bookings", icon: ClipboardList, badge: bookings.filter((b) => b.status === "Pending").length || undefined },
    { key: "calendar", label: "Calendar", icon: CalendarDays, badge: events.length },
    { key: "inquiries", label: "Inquiries", icon: Inbox, badge: inquiries.length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-foreground text-background sticky top-0 h-screen">
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-gradient-to-br from-gold to-amber-400 flex items-center justify-center shadow-lg">
              <ShieldCheck className="size-5 text-foreground" />
            </div>
            <div>
              <div className="font-display font-bold text-base">Leverify</div>
              <div className="text-[10px] uppercase tracking-widest text-white/50">Admin Suite</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1">
          {navItems.map((item) => {
            const active = tab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-white text-foreground shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className={`size-4 ${active ? "text-gold" : ""}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      active ? "bg-gold/20 text-foreground" : "bg-white/10 text-white"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/70 hover:text-white hover:bg-white/5 transition"
          >
            <ExternalLink className="size-3.5" /> View live site
          </Link>
          <button
            onClick={() => {
              clearAdminSession();
              setAuthed(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/70 hover:text-white hover:bg-white/5 transition"
          >
            <LogOut className="size-3.5" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 border-b border-border">
          <div className="px-4 md:px-8 py-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-xl md:text-2xl font-bold text-foreground capitalize">
                {tab === "overview" ? "Dashboard" : tab}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="hidden md:flex items-center gap-2 bg-muted/60 rounded-full px-4 py-2 w-72">
              <Search className="size-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search anything..."
                className="bg-transparent text-sm outline-none flex-1"
              />
            </div>

            <button
              onClick={fetchAll}
              className="size-10 rounded-full bg-muted/60 hover:bg-muted flex items-center justify-center transition"
              aria-label="Refresh"
            >
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button className="relative size-10 rounded-full bg-muted/60 hover:bg-muted flex items-center justify-center transition">
              <Bell className="size-4" />
              {inquiries.length > 0 && (
                <span className="absolute top-2 right-2 size-2 rounded-full bg-rose-500" />
              )}
            </button>
            <div className="size-10 rounded-full bg-gradient-to-br from-gold to-amber-500 flex items-center justify-center font-bold text-foreground text-sm shadow-lg">
              A
            </div>
          </div>

          {/* Mobile nav */}
          <nav className="md:hidden flex gap-1 overflow-x-auto px-4 pb-3">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                  tab === item.key
                    ? "bg-foreground text-background"
                    : "bg-muted text-foreground/70"
                }`}
              >
                <item.icon className="size-3.5" />
                {item.label}
              </button>
            ))}
          </nav>
        </header>

        <main className="px-4 md:px-8 py-6 md:py-8">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="size-10 animate-spin text-gold" />
                <span className="text-sm text-muted-foreground">Loading dashboard…</span>
              </div>
            </div>
          ) : (
            <>
              {tab === "overview" && (
                <OverviewView
                  stats={stats}
                  activityFeed={activityFeed}
                  bookings={bookings}
                  members={members}
                  events={events}
                />
              )}

              {tab === "members" && (
                <CrudTable
                  title="Members Directory"
                  description="Manage workspace memberships, plans and status"
                  columns={["Name", "Email", "Plan", "Status", "Joined"]}
                  rows={members.map((m) => [m.name, m.email, m.plan, m.status, m.joined])}
                  search={search}
                  statusColumn={3}
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
                  description="Workspace reservations from members & visitors"
                  columns={["Member", "Space", "Date", "Time", "Status"]}
                  rows={bookings.map((b) => [b.member_name, b.space, b.date, b.time, b.status])}
                  search={search}
                  statusColumn={4}
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
                  description="Events, workshops & networking sessions"
                  columns={["Title", "Date", "Type"]}
                  rows={events.map((e) => [e.title, e.date, e.type])}
                  search={search}
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
                <InquiriesView
                  inquiries={inquiries}
                  search={search}
                  onDelete={async (id) => {
                    await supabase.from("inquiries").delete().eq("id", id);
                    setInquiries((prev) => prev.filter((q) => q.id !== id));
                  }}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

/* ---------------- Overview ---------------- */

function OverviewView({
  stats,
  activityFeed,
  bookings,
  members,
  events,
}: {
  stats: { label: string; value: string | number; sub: string; trend: number; icon: typeof Users; gradient: string }[];
  activityFeed: { id: string; type: string; title: string; time: string; icon: typeof Users; color: string }[];
  bookings: Booking[];
  members: Member[];
  events: Event[];
}) {
  // simple 7-day bar chart from bookings
  const chartData = useMemo(() => {
    const days: { day: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const count = bookings.filter((b) => b.created_at.slice(0, 10) === key).length;
      days.push({ day: d.toLocaleDateString("en", { weekday: "short" }), count });
    }
    return days;
  }, [bookings]);
  const maxBar = Math.max(...chartData.map((d) => d.count), 1);

  const planMix = useMemo(() => {
    const totals: Record<string, number> = {};
    members.forEach((m) => (totals[m.plan] = (totals[m.plan] || 0) + 1));
    const entries = Object.entries(totals);
    const sum = entries.reduce((s, [, v]) => s + v, 0) || 1;
    return entries.map(([plan, count]) => ({ plan, count, pct: Math.round((count / sum) * 100) }));
  }, [members]);

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => {
          const positive = s.trend >= 0;
          return (
            <div
              key={s.label}
              className="relative overflow-hidden rounded-2xl bg-white border border-border p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className={`absolute -right-8 -top-8 size-32 rounded-full bg-gradient-to-br ${s.gradient} opacity-10 blur-2xl`}
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className={`size-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-md`}>
                    <s.icon className="size-5 text-white" />
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold ${
                      positive ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                    {Math.abs(s.trend)}%
                  </span>
                </div>
                <div className="mt-4 font-display text-2xl font-bold text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                <div className="text-[11px] text-muted-foreground/70 mt-2">{s.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-border p-6 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-foreground">Bookings · last 7 days</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Daily reservation volume</p>
            </div>
            <button className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              <Download className="size-3.5" /> Export
            </button>
          </div>
          <div className="flex items-end justify-between gap-3 h-44">
            {chartData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-foreground to-foreground/60 hover:from-gold hover:to-amber-400 transition-all relative group cursor-pointer"
                    style={{ height: `${(d.count / maxBar) * 100}%`, minHeight: "8px" }}
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition">
                      {d.count}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-muted-foreground font-medium">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plan mix */}
        <div className="rounded-2xl bg-white border border-border p-6 shadow-sm">
          <h3 className="font-display font-bold text-foreground">Plan mix</h3>
          <p className="text-xs text-muted-foreground mt-0.5 mb-5">Distribution by membership</p>
          {planMix.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No members yet.</p>
          ) : (
            <div className="space-y-4">
              {planMix.map((p, i) => (
                <div key={p.plan}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-foreground">{p.plan}</span>
                    <span className="text-muted-foreground">{p.count} · {p.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        i === 0 ? "bg-gradient-to-r from-violet-500 to-indigo-500" :
                        i === 1 ? "bg-gradient-to-r from-amber-500 to-orange-500" :
                        "bg-gradient-to-r from-emerald-500 to-teal-500"
                      }`}
                      style={{ width: `${p.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activity */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-bold text-foreground flex items-center gap-2">
                <Activity className="size-4 text-gold" /> Recent activity
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Latest events across the workspace</p>
            </div>
          </div>
          {activityFeed.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No activity yet.</p>
          ) : (
            <ul className="space-y-3">
              {activityFeed.map((a) => (
                <li
                  key={a.id}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition"
                >
                  <div className={`size-9 rounded-xl flex items-center justify-center flex-shrink-0 ${a.color}`}>
                    <a.icon className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{a.title}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {a.type} · {new Date(a.time).toLocaleString()}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Upcoming events */}
        <div className="rounded-2xl bg-gradient-to-br from-foreground to-slate-800 text-background p-6 shadow-lg">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold flex items-center gap-2">
              <Sparkles className="size-4 text-gold" /> Upcoming
            </h3>
            <span className="text-xs text-white/60">{events.length} events</span>
          </div>
          {events.length === 0 ? (
            <p className="text-sm text-white/60 py-8 text-center">No events scheduled.</p>
          ) : (
            <ul className="space-y-3">
              {events.slice(0, 4).map((e) => (
                <li key={e.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
                  <div className="size-11 rounded-xl bg-gold/20 text-gold flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-[9px] font-bold uppercase">
                      {new Date(e.date).toLocaleString("en", { month: "short" })}
                    </span>
                    <span className="text-sm font-bold leading-none">
                      {new Date(e.date).getDate() || e.date.slice(8, 10)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{e.title}</div>
                    <div className="text-[11px] text-white/60 mt-0.5">{e.type}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Inquiries ---------------- */

function InquiriesView({
  inquiries,
  search,
  onDelete,
}: {
  inquiries: Inquiry[];
  search: string;
  onDelete: (id: string) => Promise<void>;
}) {
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return inquiries;
    return inquiries.filter((i) =>
      [i.name, i.email, i.interest, i.message, i.phone].some((v) => v?.toLowerCase().includes(q)),
    );
  }, [inquiries, search]);

  return (
    <div className="rounded-2xl bg-white border border-border shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-foreground">Inquiries</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {filtered.length} of {inquiries.length} messages
          </p>
        </div>
        <button className="text-xs inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-foreground/80 hover:bg-muted/70">
          <Filter className="size-3.5" /> Filter
        </button>
      </div>
      {filtered.length === 0 ? (
        <div className="p-12 text-center">
          <Inbox className="size-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No inquiries match your search.</p>
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {filtered.map((q) => (
            <li key={q.id} className="p-5 hover:bg-muted/30 transition group">
              <div className="flex items-start gap-4">
                <div className="size-11 rounded-full bg-gradient-to-br from-gold to-amber-500 flex items-center justify-center font-bold text-foreground flex-shrink-0">
                  {q.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground">{q.name}</span>
                    <span className="text-xs rounded-full bg-gold/15 text-gold px-2 py-0.5 font-medium">
                      {q.interest}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {new Date(q.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                    <span className="inline-flex items-center gap-1"><Mail className="size-3" /> {q.email}</span>
                    {q.phone && <span className="inline-flex items-center gap-1"><Phone className="size-3" /> {q.phone}</span>}
                  </div>
                  {q.message && (
                    <p className="mt-3 text-sm text-foreground/80 leading-relaxed">{q.message}</p>
                  )}
                  <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <a
                      href={`mailto:${q.email}`}
                      className="text-xs inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-foreground text-background hover:opacity-90"
                    >
                      <Mail className="size-3" /> Reply
                    </a>
                    <button
                      onClick={() => onDelete(q.id)}
                      className="text-xs inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-foreground/70 hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-3" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------------- CRUD Table ---------------- */

function StatusBadge({ value }: { value: string }) {
  const v = value.toLowerCase();
  const map: Record<string, { bg: string; icon: typeof CheckCircle2 }> = {
    active: { bg: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
    confirmed: { bg: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
    pending: { bg: "bg-amber-100 text-amber-700", icon: Clock },
    trial: { bg: "bg-blue-100 text-blue-700", icon: Sparkles },
    paused: { bg: "bg-rose-100 text-rose-700", icon: XCircle },
  };
  const m = map[v] || { bg: "bg-muted text-foreground/70", icon: CheckCircle2 };
  const Icon = m.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${m.bg}`}>
      <Icon className="size-3" /> {value}
    </span>
  );
}

function CrudTable({
  title,
  description,
  columns,
  rows,
  search,
  statusColumn,
  onAdd,
  onDelete,
}: {
  title: string;
  description?: string;
  columns: string[];
  rows: string[][];
  search?: string;
  statusColumn?: number;
  onAdd: (values: string[]) => Promise<void>;
  onDelete: (index: number) => Promise<void>;
}) {
  const [draft, setDraft] = useState<string[]>(Array(columns.length).fill(""));
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const canAdd = draft.every((v) => v.trim().length > 0);

  const filtered = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    if (!q) return rows.map((r, i) => ({ row: r, originalIndex: i }));
    return rows
      .map((r, i) => ({ row: r, originalIndex: i }))
      .filter(({ row }) => row.some((c) => c.toLowerCase().includes(q)));
  }, [rows, search]);

  const exportCsv = () => {
    const csv = [columns.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl bg-white border border-border shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-border flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-display font-bold text-foreground">{title}</h3>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{filtered.length} of {rows.length}</span>
          <button
            onClick={exportCsv}
            className="text-xs inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted hover:bg-muted/70 text-foreground/80"
          >
            <Download className="size-3.5" /> CSV
          </button>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="text-xs inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-foreground text-background hover:opacity-90"
          >
            <Plus className="size-3.5" /> Add new
          </button>
        </div>
      </div>

      {showForm && (
        <div className="px-6 py-4 bg-muted/30 border-b border-border">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {draft.map((v, i) => (
              <input
                key={i}
                value={v}
                onChange={(e) =>
                  setDraft((d) => d.map((x, idx) => (idx === i ? e.target.value : x)))
                }
                placeholder={columns[i]}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
              />
            ))}
          </div>
          <div className="mt-3 flex gap-2 justify-end">
            <button
              onClick={() => {
                setShowForm(false);
                setDraft(Array(columns.length).fill(""));
              }}
              className="text-xs px-3 py-2 rounded-full text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              disabled={!canAdd || saving}
              onClick={async () => {
                setSaving(true);
                await onAdd(draft);
                setDraft(Array(columns.length).fill(""));
                setSaving(false);
                setShowForm(false);
              }}
              className="text-xs inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-foreground text-background disabled:opacity-40 hover:opacity-90"
            >
              {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
              Save
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              {columns.map((c) => (
                <th key={c} className="text-left px-6 py-3 font-semibold">
                  {c}
                </th>
              ))}
              <th className="w-12" />
            </tr>
          </thead>
          <tbody>
            {filtered.map(({ row, originalIndex }) => (
              <tr key={originalIndex} className="border-t border-border hover:bg-muted/30 transition">
                {row.map((cell, j) => (
                  <td key={j} className="px-6 py-4 text-foreground/90">
                    {statusColumn === j ? (
                      <StatusBadge value={cell} />
                    ) : j === 0 ? (
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-gradient-to-br from-gold/40 to-amber-400/40 flex items-center justify-center text-xs font-bold text-foreground">
                          {cell.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{cell}</span>
                      </div>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
                <td className="px-3">
                  <button
                    onClick={() => onDelete(originalIndex)}
                    className="size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    aria-label="Delete"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-12 text-center">
                  <Building2 className="size-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No records found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- Login ---------------- */

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (
        email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
        pwd === DEFAULT_ADMIN_PASSWORD
      ) {
        persistAdminSession(pwd);
        onSuccess();
      } else {
        setErr("Incorrect email or password.");
      }
      setLoading(false);
    }, 350);
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(212,175,55,0.25),transparent_60%)]" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-xl bg-gradient-to-br from-gold to-amber-400 flex items-center justify-center">
              <ShieldCheck className="size-6 text-foreground" />
            </div>
            <div>
              <div className="font-display font-bold text-lg">Leverify Circle</div>
              <div className="text-xs text-white/50 uppercase tracking-widest">Admin Suite</div>
            </div>
          </div>
        </div>
        <div className="relative max-w-md">
          <h2 className="font-display text-4xl font-bold leading-tight">
            Run your workspace
            <br />
            <span className="text-gold">with precision.</span>
          </h2>
          <p className="mt-4 text-white/70 leading-relaxed">
            Manage members, bookings, events and inquiries from a single command center —
            built for the Leverify operations team.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[["98%", "Uptime"], ["24/7", "Support"], ["RLS", "Secured"]].map(([n, l]) => (
              <div key={l} className="border-l-2 border-gold/40 pl-3">
                <div className="font-display text-xl font-bold">{n}</div>
                <div className="text-[11px] text-white/50 uppercase tracking-wider">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-xs text-white/40">© {new Date().getFullYear()} Leverify Circle</div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <form
          onSubmit={submit}
          className="w-full max-w-sm rounded-3xl bg-white border border-border p-8 shadow-2xl"
        >
          <div className="size-12 rounded-xl bg-foreground text-background flex items-center justify-center">
            <ShieldCheck className="size-6" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to access the admin dashboard.
          </p>

          <label className="block mt-6">
            <span className="block text-xs font-semibold text-foreground/80 mb-1.5">Email</span>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErr("");
                }}
                className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                placeholder="you@example.com"
                autoFocus
              />
            </div>
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
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
              placeholder="••••••••"
            />
          </label>
          {err && (
            <p className="mt-3 text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg flex items-center gap-2">
              <XCircle className="size-3.5" /> {err}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full inline-flex justify-center items-center gap-2 rounded-full bg-foreground text-background px-5 py-3 text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
            Sign in securely
          </button>

          <p className="mt-5 text-[11px] text-muted-foreground text-center">
            Protected internal access · Leverify Circle Admin
          </p>
        </form>
      </div>
    </div>
  );
}

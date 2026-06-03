import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Users,
  CalendarDays,
  ClipboardList,
  Inbox,
  TrendingUp,
  Plus,
  Trash2,
  LogOut,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  component: AdminPanel,
  head: () => ({
    meta: [
      { title: "Admin · Leverify Circle" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

// ----- Types & local storage -----

type Member = {
  id: string;
  name: string;
  email: string;
  plan: "Day Pass" | "Weekly Pass" | "Monthly Membership";
  joined: string;
  status: "Active" | "Trial" | "Paused";
};

type Booking = {
  id: string;
  member: string;
  space: "Desk" | "Private Office" | "Meeting Room";
  date: string;
  time: string;
  status: "Confirmed" | "Pending";
};

type Event = {
  id: string;
  title: string;
  date: string;
  type: "Engagement" | "Development" | "Networking" | "Workshop";
};

type Inquiry = {
  id: string;
  name: string;
  email: string;
  interest: string;
  message: string;
  date: string;
};

const KEY = "leverify-circle-admin";
type Store = { members: Member[]; bookings: Booking[]; events: Event[]; inquiries: Inquiry[] };

const seed: Store = {
  members: [
    { id: "m1", name: "Ayesha Khan", email: "ayesha@studio.pk", plan: "Monthly Membership", joined: "2026-05-04", status: "Active" },
    { id: "m2", name: "Hamza Raza", email: "hamza@indie.dev", plan: "Weekly Pass", joined: "2026-05-22", status: "Active" },
    { id: "m3", name: "Sana Ali", email: "sana@growth.co", plan: "Monthly Membership", joined: "2026-04-18", status: "Active" },
    { id: "m4", name: "Bilal Sheikh", email: "bilal@freelance.pk", plan: "Day Pass", joined: "2026-05-30", status: "Trial" },
  ],
  bookings: [
    { id: "b1", member: "Ayesha Khan", space: "Meeting Room", date: "2026-06-03", time: "11:00–12:00", status: "Confirmed" },
    { id: "b2", member: "Hamza Raza", space: "Desk", date: "2026-06-02", time: "All day", status: "Confirmed" },
    { id: "b3", member: "Sana Ali", space: "Private Office", date: "2026-06-04", time: "14:00–17:00", status: "Pending" },
  ],
  events: [
    { id: "e1", title: "Founder Coffee & Intros", date: "2026-06-08", type: "Networking" },
    { id: "e2", title: "Product Thinking Workshop", date: "2026-06-12", type: "Workshop" },
    { id: "e3", title: "Remote Work Best Practices", date: "2026-06-18", type: "Development" },
    { id: "e4", title: "Community Dinner", date: "2026-06-23", type: "Engagement" },
  ],
  inquiries: [
    { id: "i1", name: "Zainab Tariq", email: "zainab@agency.pk", interest: "Private Office", message: "Looking for a 3-seater office.", date: "2026-05-31" },
    { id: "i2", name: "Usman Javed", email: "usman@dev.io", interest: "Monthly Membership", message: "Need 24/7 access.", date: "2026-05-29" },
  ],
};

function loadStore(): Store {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed;
    return { ...seed, ...JSON.parse(raw) };
  } catch {
    return seed;
  }
}

function saveStore(s: Store) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
}

// ----- Auth (server-validated) -----

const ADMIN_EMAIL = "Asidsarfraz@gmail.com";
const AUTH_KEY = "leverify-circle-admin-auth";
const PW_KEY = "leverify-circle-admin-pw";


function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<"overview" | "members" | "bookings" | "calendar" | "inquiries">("overview");
  const [store, setStore] = useState<Store>(seed);

  useEffect(() => {
    setAuthed(typeof window !== "undefined" && sessionStorage.getItem(AUTH_KEY) === "ok");
    setStore(loadStore());
  }, []);

  useEffect(() => { saveStore(store); }, [store]);

  const stats = useMemo(() => [
    { label: "Active members", value: store.members.filter(m => m.status === "Active").length, icon: Users },
    { label: "Bookings this week", value: store.bookings.length, icon: ClipboardList },
    { label: "Upcoming events", value: store.events.length, icon: CalendarDays },
    { label: "Open inquiries", value: store.inquiries.length, icon: Inbox },
  ], [store]);

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
              <div className="font-display font-bold text-foreground">Leverify Circle · Admin</div>
              <div className="text-xs text-muted-foreground">Internal operations dashboard</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-foreground text-background text-sm font-semibold px-4 py-2 shadow-elegant hover:opacity-90 transition"
              title="Open live website — your edits save automatically"
            >
              <ExternalLink className="size-4" /> View live site
            </Link>
            <button
              onClick={() => { sessionStorage.removeItem(AUTH_KEY); window.dispatchEvent(new Event("leverify-admin-auth")); setAuthed(false); }}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2"
            >
              <LogOut className="size-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="container-px mx-auto max-w-7xl py-8">
        <nav className="flex flex-wrap gap-2 mb-8">
          {([
            ["overview", "Overview", TrendingUp],
            ["members", "Members", Users],
            ["bookings", "Bookings", ClipboardList],
            ["calendar", "Calendar", CalendarDays],
            ["inquiries", "Inquiries", Inbox],
          ] as const).map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                tab === key ? "bg-foreground text-background shadow-elegant" : "bg-card border border-border text-foreground/80 hover:bg-accent"
              }`}
            >
              <Icon className="size-4" /> {label}
            </button>
          ))}
        </nav>

        {tab === "overview" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-card border border-border p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</span>
                  <s.icon className="size-4 text-gold" />
                </div>
                <div className="mt-3 font-display text-4xl font-bold text-foreground">{s.value}</div>
              </div>
            ))}
          </div>
        )}

        {tab === "members" && (
          <CrudTable
            title="Members"
            columns={["Name", "Email", "Plan", "Status", "Joined"]}
            rows={store.members.map(m => [m.name, m.email, m.plan, m.status, m.joined])}
            onAdd={(values) => setStore(s => ({ ...s, members: [...s.members, {
              id: crypto.randomUUID(), name: values[0], email: values[1],
              plan: (values[2] as Member["plan"]) || "Day Pass",
              status: (values[3] as Member["status"]) || "Active",
              joined: values[4] || new Date().toISOString().slice(0, 10),
            }] }))}
            onDelete={(i) => setStore(s => ({ ...s, members: s.members.filter((_, idx) => idx !== i) }))}
          />
        )}

        {tab === "bookings" && (
          <CrudTable
            title="Bookings"
            columns={["Member", "Space", "Date", "Time", "Status"]}
            rows={store.bookings.map(b => [b.member, b.space, b.date, b.time, b.status])}
            onAdd={(v) => setStore(s => ({ ...s, bookings: [...s.bookings, {
              id: crypto.randomUUID(), member: v[0], space: (v[1] as Booking["space"]) || "Desk",
              date: v[2], time: v[3], status: (v[4] as Booking["status"]) || "Pending",
            }] }))}
            onDelete={(i) => setStore(s => ({ ...s, bookings: s.bookings.filter((_, idx) => idx !== i) }))}
          />
        )}

        {tab === "calendar" && (
          <CrudTable
            title="Community Calendar"
            columns={["Title", "Date", "Type"]}
            rows={store.events.map(e => [e.title, e.date, e.type])}
            onAdd={(v) => setStore(s => ({ ...s, events: [...s.events, {
              id: crypto.randomUUID(), title: v[0], date: v[1], type: (v[2] as Event["type"]) || "Engagement",
            }] }))}
            onDelete={(i) => setStore(s => ({ ...s, events: s.events.filter((_, idx) => idx !== i) }))}
          />
        )}

        {tab === "inquiries" && (
          <div className="rounded-2xl bg-card border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border font-display font-bold text-foreground">Inquiries</div>
            <ul className="divide-y divide-border">
              {store.inquiries.map((q, i) => (
                <li key={q.id} className="p-5 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">{q.name}</span>
                      <span className="text-xs text-muted-foreground">· {q.email}</span>
                      <span className="text-xs rounded-full bg-gold/15 text-gold px-2 py-0.5">{q.interest}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{q.date}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{q.message}</p>
                  </div>
                  <button
                    onClick={() => setStore(s => ({ ...s, inquiries: s.inquiries.filter((_, idx) => idx !== i) }))}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Delete"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
              {store.inquiries.length === 0 && (
                <li className="p-8 text-center text-sm text-muted-foreground">No inquiries yet.</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// ----- Reusable CRUD table -----

function CrudTable({
  title, columns, rows, onAdd, onDelete,
}: {
  title: string;
  columns: string[];
  rows: string[][];
  onAdd: (values: string[]) => void;
  onDelete: (index: number) => void;
}) {
  const [draft, setDraft] = useState<string[]>(Array(columns.length).fill(""));
  const canAdd = draft.every(v => v.trim().length > 0);

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
              {columns.map(c => <th key={c} className="text-left px-5 py-3 font-semibold">{c}</th>)}
              <th className="w-12" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-border hover:bg-muted/30">
                {row.map((cell, j) => <td key={j} className="px-5 py-3 text-foreground/90">{cell}</td>)}
                <td className="px-3">
                  <button onClick={() => onDelete(i)} className="text-muted-foreground hover:text-destructive" aria-label="Delete">
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
                    onChange={(e) => setDraft(d => d.map((x, idx) => idx === i ? e.target.value : x))}
                    placeholder={columns[i]}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold"
                  />
                </td>
              ))}
              <td className="px-3">
                <button
                  disabled={!canAdd}
                  onClick={() => { onAdd(draft); setDraft(Array(columns.length).fill("")); }}
                  className="inline-flex items-center justify-center size-9 rounded-lg bg-foreground text-background disabled:opacity-40"
                  aria-label="Add"
                >
                  <Plus className="size-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ----- Login -----

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && pwd === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, "ok");
      window.dispatchEvent(new Event("leverify-admin-auth"));
      onSuccess();
    } else {
      setErr("Incorrect email or password.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-card border border-border p-8 shadow-elegant">
        <div className="size-12 rounded-xl bg-foreground text-background flex items-center justify-center">
          <ShieldCheck className="size-6" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold text-foreground">Admin sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">Internal access for Leverify Circle operations.</p>

        <label className="block mt-6">
          <span className="block text-xs font-semibold text-foreground/80 mb-1.5">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErr(""); }}
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
            onChange={(e) => { setPwd(e.target.value); setErr(""); }}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-gold"
            placeholder="••••••••"
          />
        </label>
        {err && <p className="mt-2 text-xs text-destructive">{err}</p>}

        <button type="submit" className="mt-6 w-full inline-flex justify-center rounded-full bg-foreground text-background px-5 py-3 text-sm font-semibold hover:opacity-90 transition">
          Sign in
        </button>

      </form>
    </div>
  );
}

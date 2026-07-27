import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowUpRight, Briefcase, CalendarDays, CircleCheck as CheckCircle2, ChevronLeft, ChevronRight, Loader as Loader2, Mail, MapPin, Phone, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

type SpaceKey = "desk" | "office" | "meeting";

type Space = {
  key: SpaceKey;
  name: string;
  icon: typeof Briefcase;
  total: number;
  available: number;
  tag: string;
  unit: string;
  blurb: string;
};

const INITIAL: Space[] = [
  { key: "desk", name: "Dedicated Desks", icon: Briefcase, total: 48, available: 12, tag: "From PKR 18,000/mo", unit: "desks", blurb: "Your own 24/7 desk in the open studio." },
  { key: "office", name: "Private Offices", icon: Users, total: 16, available: 3, tag: "From PKR 65,000/mo", unit: "suites", blurb: "Lockable, branded suites for 2–20 people." },
  { key: "meeting", name: "Meeting Rooms", icon: CalendarDays, total: 6, available: 4, tag: "From PKR 1,500/hr", unit: "rooms", blurb: "4K displays, Logitech Rally, instant booking." },
];

const TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

function statusFor(pct: number) {
  if (pct >= 0.4) return { label: "High availability", dot: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-400", bar: "bg-emerald-500" };
  if (pct >= 0.15) return { label: "Filling fast", dot: "bg-amber-500", text: "text-amber-700 dark:text-amber-400", bar: "bg-amber-500" };
  if (pct > 0) return { label: "Almost full", dot: "bg-orange-500", text: "text-orange-700 dark:text-orange-400", bar: "bg-orange-500" };
  return { label: "Waitlist", dot: "bg-rose-500", text: "text-rose-700 dark:text-rose-400", bar: "bg-rose-500" };
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-PK", { weekday: "short", month: "short", day: "numeric" });
}

function nextDays(n: number) {
  const out: Date[] = [];
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  for (let i = 0; i < n; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    out.push(d);
  }
  return out;
}

export function Availability() {
  const [spaces, setSpaces] = useState<Space[]>(INITIAL);
  const [pulse, setPulse] = useState(0);

  // Booking flow state
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selected, setSelected] = useState<SpaceKey>("desk");
  const [date, setDate] = useState<Date>(nextDays(1)[0]);
  const [time, setTime] = useState<string>("10:00");
  const [duration, setDuration] = useState<string>("Monthly");
  const [people, setPeople] = useState<number>(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Simulate live availability updates every 6s
  useEffect(() => {
    const id = setInterval(() => {
      setSpaces((prev) =>
        prev.map((s) => {
          const delta = Math.random() < 0.5 ? -1 : 1;
          const next = Math.max(0, Math.min(s.total, s.available + delta));
          return { ...s, available: next };
        }),
      );
      setPulse((p) => p + 1);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const current = spaces.find((s) => s.key === selected)!;
  const days = useMemo(() => nextDays(14), []);
  const durationOptions = selected === "meeting"
    ? ["1 hour", "2 hours", "Half day", "Full day"]
    : selected === "desk"
      ? ["Daily", "Weekly", "Monthly"]
      : ["Monthly", "Quarterly", "Annual"];

  useEffect(() => {
    setDuration(selected === "meeting" ? "1 hour" : selected === "desk" ? "Monthly" : "Monthly");
  }, [selected]);

  const canNext = (() => {
    if (step === 1) return current.available > 0;
    if (step === 2) return Boolean(date && (selected !== "meeting" || time));
    if (step === 3) return form.name.trim() && /.+@.+\..+/.test(form.email) && form.phone.trim().length >= 7;
    return true;
  })();

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const space = spaces.find((s) => s.key === selected)!;
      const spaceName = space.name.replace(" Desks", "").replace(" Offices", "").replace(" Rooms", "");
      await supabase.from("bookings").insert({
        member_name: form.name,
        member_email: form.email,
        member_phone: form.phone,
        company: form.company || null,
        notes: form.notes || null,
        space: spaceName,
        date: date.toISOString().slice(0, 10),
        time: selected === "meeting" ? time : "All day",
        duration: duration,
        people: people,
        status: "Pending",
      });
      setSubmitting(false);
      setDone(true);
      setStep(4);
    } catch (err) {
      console.error("Failed to submit booking:", err);
      setSubmitting(false);
    }
  }

  function reset() {
    setStep(1);
    setDone(false);
    setForm({ name: "", email: "", phone: "", company: "", notes: "" });
  }

  return (
    <section id="availability" className="py-24 lg:py-32">
      <div className="container-px mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              <Activity className="size-3.5" /> Live availability
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">
              Real-time space, booked in minutes.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Availability updates in real time across our Civic Center Bahria Town floor. Pick a space, choose a date, and we'll confirm within an hour.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="relative flex size-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex rounded-full size-2.5 bg-emerald-500" />
            </span>
            Live · synced {pulse > 0 ? "just now" : "moments ago"}
          </div>
        </div>

        {/* Availability cards */}
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {spaces.map((s) => {
            const pct = s.available / s.total;
            const status = statusFor(pct);
            const Icon = s.icon;
            const isActive = selected === s.key;
            return (
              <button
                key={s.key}
                onClick={() => { setSelected(s.key); setStep(1); setDone(false); }}
                className={cn(
                  "text-left rounded-3xl border p-6 lg:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant",
                  isActive ? "border-foreground bg-card shadow-elegant" : "border-border bg-card/60",
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="size-12 rounded-2xl bg-accent flex items-center justify-center">
                    <Icon className="size-5 text-foreground" />
                  </div>
                  <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", status.text)}>
                    <span className={cn("size-1.5 rounded-full", status.dot)} />
                    {status.label}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl font-bold">{s.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.blurb}</p>

                <div className="mt-5 flex items-baseline gap-2">
                  <span className="text-4xl font-bold tabular-nums">{s.available}</span>
                  <span className="text-sm text-muted-foreground">of {s.total} {s.unit}</span>
                </div>

                <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn("h-full transition-all duration-700", status.bar)}
                    style={{ width: `${Math.max(4, pct * 100)}%` }}
                  />
                </div>

                <div className="mt-5 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{s.tag}</span>
                  <span className={cn("inline-flex items-center gap-1 font-semibold", isActive ? "text-foreground" : "text-muted-foreground")}>
                    {isActive ? "Selected" : "Choose"} <ArrowUpRight className="size-3.5" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Booking flow */}
        <div className="mt-14 rounded-3xl border border-border bg-card overflow-hidden shadow-elegant">
          <div className="grid lg:grid-cols-[1fr_360px]">
            {/* Steps */}
            <div className="p-7 lg:p-10">
              {/* Stepper */}
              <ol className="flex items-center gap-2 text-xs font-medium">
                {[
                  { n: 1, label: "Space" },
                  { n: 2, label: "Date & time" },
                  { n: 3, label: "Your details" },
                  { n: 4, label: "Confirm" },
                ].map((s, i) => (
                  <li key={s.n} className="flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center justify-center size-7 rounded-full border text-[11px] font-semibold transition",
                        step >= (s.n as 1 | 2 | 3 | 4)
                          ? "bg-foreground text-background border-foreground"
                          : "bg-card text-muted-foreground border-border",
                      )}
                    >
                      {step > s.n ? <CheckCircle2 className="size-4" /> : s.n}
                    </span>
                    <span className={cn("hidden sm:inline", step >= (s.n as 1 | 2 | 3 | 4) ? "text-foreground" : "text-muted-foreground")}>{s.label}</span>
                    {i < 3 && <span className="w-6 h-px bg-border mx-1" />}
                  </li>
                ))}
              </ol>

              <div className="mt-8 min-h-[320px]">
                {step === 1 && (
                  <div className="animate-fade-up">
                    <h3 className="font-display text-2xl font-bold">Pick a space</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Switch between options above. Selected:</p>
                    <div className="mt-5 rounded-2xl border border-border bg-muted/40 p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-xl bg-foreground text-background flex items-center justify-center">
                          <current.icon className="size-5" />
                        </div>
                        <div>
                          <p className="font-semibold">{current.name}</p>
                          <p className="text-xs text-muted-foreground">{current.tag}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold tabular-nums">{current.available}</p>
                        <p className="text-[11px] text-muted-foreground uppercase tracking-wide">available</p>
                      </div>
                    </div>

                    {selected !== "meeting" && (
                      <div className="mt-6">
                        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Team size</label>
                        <div className="mt-2 flex items-center gap-2">
                          {[1, 2, 4, 6, 10, 20].map((n) => (
                            <button
                              key={n}
                              onClick={() => setPeople(n)}
                              className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium border transition",
                                people === n ? "bg-foreground text-background border-foreground" : "bg-card border-border hover:bg-accent",
                              )}
                            >
                              {n}{n === 20 ? "+" : ""}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-6">
                      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Commitment</label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {durationOptions.map((d) => (
                          <button
                            key={d}
                            onClick={() => setDuration(d)}
                            className={cn(
                              "px-4 py-2 rounded-full text-sm font-medium border transition",
                              duration === d ? "bg-foreground text-background border-foreground" : "bg-card border-border hover:bg-accent",
                            )}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="animate-fade-up">
                    <h3 className="font-display text-2xl font-bold">When would you like to start?</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Pick a date in the next two weeks.</p>

                    <div className="mt-5 -mx-1 overflow-x-auto">
                      <div className="flex gap-2 px-1 pb-2">
                        {days.map((d) => {
                          const active = d.toDateString() === date.toDateString();
                          return (
                            <button
                              key={d.toISOString()}
                              onClick={() => setDate(d)}
                              className={cn(
                                "flex-shrink-0 w-20 rounded-2xl border px-3 py-3 text-center transition",
                                active ? "bg-foreground text-background border-foreground shadow-elegant" : "bg-card border-border hover:bg-accent",
                              )}
                            >
                              <div className="text-[10px] uppercase tracking-wide opacity-80">{d.toLocaleDateString("en-PK", { weekday: "short" })}</div>
                              <div className="mt-1 text-xl font-bold">{d.getDate()}</div>
                              <div className="text-[10px] opacity-80">{d.toLocaleDateString("en-PK", { month: "short" })}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {selected === "meeting" && (
                      <div className="mt-6">
                        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Start time</label>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {TIME_SLOTS.map((t) => {
                            // pseudo-random booked slots based on date
                            const booked = (t.charCodeAt(1) + date.getDate()) % 4 === 0;
                            const active = time === t;
                            return (
                              <button
                                key={t}
                                disabled={booked}
                                onClick={() => setTime(t)}
                                className={cn(
                                  "px-4 py-2 rounded-full text-sm font-medium border transition",
                                  booked && "opacity-40 line-through cursor-not-allowed",
                                  active && !booked ? "bg-foreground text-background border-foreground" : "bg-card border-border hover:bg-accent",
                                )}
                              >
                                {t}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className="animate-fade-up">
                    <h3 className="font-display text-2xl font-bold">Your details</h3>
                    <p className="mt-1 text-sm text-muted-foreground">We'll confirm your booking within an hour.</p>
                    <div className="mt-5 grid sm:grid-cols-2 gap-4">
                      <Field icon={User} label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Ali Raza" />
                      <Field icon={Briefcase} label="Company (optional)" value={form.company} onChange={(v) => setForm({ ...form, company: v })} placeholder="Acme Studio" />
                      <Field icon={Mail} label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="you@company.com" />
                      <Field icon={Phone} label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+92 300 1234567" />
                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Notes (optional)</label>
                        <textarea
                          value={form.notes}
                          onChange={(e) => setForm({ ...form, notes: e.target.value })}
                          rows={3}
                          maxLength={500}
                          placeholder="Anything we should know?"
                          className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && done && (
                  <div className="animate-fade-up text-center py-8">
                    <div className="mx-auto size-16 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="size-8" />
                    </div>
                    <h3 className="mt-5 font-display text-2xl font-bold">Booking request received</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                      Thanks {form.name.split(" ")[0]} — our team will confirm your {current.name.toLowerCase()} for {formatDate(date)} within the hour.
                    </p>
                    <button
                      onClick={reset}
                      className="mt-6 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-accent transition"
                    >
                      Make another booking
                    </button>
                  </div>
                )}
              </div>

              {/* Nav buttons */}
              {step < 4 && (
                <div className="mt-8 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s))}
                    disabled={step === 1}
                    className="inline-flex items-center gap-1 rounded-full border border-border px-4 py-2.5 text-sm font-semibold hover:bg-accent transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="size-4" /> Back
                  </button>
                  {step < 3 ? (
                    <button
                      onClick={() => setStep((s) => ((s + 1) as 2 | 3))}
                      disabled={!canNext}
                      className="inline-flex items-center gap-1 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-semibold shadow-elegant hover:opacity-90 transition disabled:opacity-40"
                    >
                      Continue <ChevronRight className="size-4" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={!canNext || submitting}
                      className="inline-flex items-center gap-2 rounded-full bg-gold-gradient text-gold-foreground px-6 py-2.5 text-sm font-bold shadow-gold hover:opacity-95 transition disabled:opacity-50"
                    >
                      {submitting ? <><Loader2 className="size-4 animate-spin" /> Confirming…</> : <>Confirm booking <ArrowUpRight className="size-4" /></>}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Summary */}
            <aside className="bg-hero-gradient text-white p-7 lg:p-10 flex flex-col">
              <span className="text-[11px] uppercase tracking-[0.2em] text-white/60">Booking summary</span>
              <h4 className="mt-3 font-display text-2xl font-bold">{current.name}</h4>
              <p className="text-sm text-white/70 mt-1">{current.tag}</p>

              <dl className="mt-8 space-y-4 text-sm">
                <Row label="Date" value={formatDate(date)} />
                {selected === "meeting" && <Row label="Time" value={time} />}
                <Row label="Commitment" value={duration} />
                {selected !== "meeting" && <Row label="Team size" value={`${people}${people === 20 ? "+" : ""} ${people === 1 ? "person" : "people"}`} />}
                <Row label="Availability" value={`${current.available} ${current.unit} open`} />
              </dl>

              <div className="mt-auto pt-8 border-t border-white/10 text-xs text-white/60 space-y-2">
                <p className="flex items-center gap-2"><MapPin className="size-3.5" /> Civic Center Bahria Town, Rawalpindi</p>
                <p>No payment required to reserve. Our team confirms within 1 hour during business hours.</p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-white/60">{label}</dt>
      <dd className="font-semibold text-right">{value}</dd>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  icon: typeof User;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</label>
      <div className="mt-2 flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 focus-within:ring-2 focus-within:ring-ring">
        <Icon className="size-4 text-muted-foreground" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={120}
          className="flex-1 bg-transparent text-sm focus:outline-none"
        />
      </div>
    </div>
  );
}

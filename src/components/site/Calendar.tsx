import { CalendarDays, Users, Sparkles, GraduationCap } from "lucide-react";

type Event = {
  date: string;
  day: string;
  title: string;
  type: "Engagement" | "Development" | "Networking" | "Workshop";
  time: string;
  description: string;
};

const events: Event[] = [
  {
    date: "08",
    day: "Mon",
    title: "Founder Coffee & Intros",
    type: "Networking",
    time: "09:30 – 10:30",
    description: "Casual roundtable for members to share what they're working on this month.",
  },
  {
    date: "12",
    day: "Fri",
    title: "Product Thinking Workshop",
    type: "Workshop",
    time: "16:00 – 18:00",
    description: "Hands-on session on framing problems, prioritization and shipping faster.",
  },
  {
    date: "18",
    day: "Thu",
    title: "Remote Work Best Practices",
    type: "Development",
    time: "15:00 – 16:30",
    description: "Async communication, focus rituals and tooling — led by Leverify's team.",
  },
  {
    date: "23",
    day: "Tue",
    title: "Community Dinner",
    type: "Engagement",
    time: "19:00 – 21:00",
    description: "Monthly community dinner — open to all members and a +1 guest.",
  },
];

const typeStyles: Record<Event["type"], { icon: typeof Users; color: string }> = {
  Engagement: { icon: Sparkles, color: "bg-gold/15 text-gold" },
  Development: { icon: GraduationCap, color: "bg-primary/10 text-primary" },
  Networking: { icon: Users, color: "bg-emerald-500/10 text-emerald-600" },
  Workshop: { icon: CalendarDays, color: "bg-blue-500/10 text-blue-600" },
};

export function Calendar() {
  return (
    <section id="calendar" className="py-24 lg:py-32 bg-muted/40">
      <div className="container-px mx-auto max-w-[1760px]">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Community Calendar</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Engagement & development, every month.
            </h2>
            <p className="mt-4 text-muted-foreground">
              A published monthly calendar of engagement activities, networking sessions and professional development —
              what makes Leverify Circle different from a typical coworking space.
            </p>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full bg-foreground text-background px-6 py-3 text-sm font-semibold hover:opacity-90 transition shadow-elegant w-fit"
          >
            Join the next session
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {events.map((e) => {
            const Icon = typeStyles[e.type].icon;
            return (
              <article
                key={e.title}
                className="group rounded-3xl bg-card border border-border p-6 flex gap-5 hover:shadow-elegant hover:-translate-y-1 transition-all duration-300"
              >
                <div className="shrink-0 w-20 rounded-2xl bg-gradient-to-br from-foreground to-foreground/80 text-background flex flex-col items-center justify-center py-3">
                  <span className="text-xs uppercase tracking-widest opacity-70">{e.day}</span>
                  <span className="font-display text-3xl font-bold leading-none mt-1">{e.date}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${typeStyles[e.type].color}`}>
                      <Icon className="size-3" /> {e.type}
                    </span>
                    <span className="text-xs text-muted-foreground">{e.time}</span>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-bold text-foreground">{e.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{e.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

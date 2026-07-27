import { Users, Zap, Coffee, ShieldCheck } from "lucide-react";

const stats = [
  { value: "20–25", label: "members in Phase 1" },
  { value: "Monthly", label: "engagement calendar" },
  { value: "1:1", label: "networking & mentorship" },
  { value: "F-7", label: "Markaz, Islamabad" },
];

const pillars = [
  { icon: Users, title: "Work", text: "Professional workspace, flexible seating and meeting facilities for focused output." },
  { icon: Zap, title: "Connect", text: "Curated networking with founders, freelancers and remote professionals." },
  { icon: Coffee, title: "Learn", text: "Monthly professional development sessions, workshops and skill swaps." },
  { icon: ShieldCheck, title: "Grow", text: "A growth-oriented community aligned with Leverify's culture and values." },
];

export function About() {
  return (
    <section id="about" className="py-24 lg:py-32">
      <div className="container-px mx-auto max-w-[1600px]">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">About Leverify Circle</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-foreground leading-tight">
              More than a desk. A community to work, connect, learn and grow.
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Leverify Circle is a community-oriented work and development space built inside Leverify's existing
              office in Islamabad. Unlike traditional coworking, we combine focused work with professional networking,
              engagement activities and development sessions — in an environment aligned with Leverify's culture.
            </p>

            <dl className="mt-10 grid grid-cols-2 gap-6">
              {stats.map((s) => (
                <div key={s.label} className="border-l-2 border-gold pl-4">
                  <dt className="font-display text-3xl font-bold text-foreground">{s.value}</dt>
                  <dd className="text-sm text-muted-foreground mt-1">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-5">
            {pillars.map((p, i) => (
              <div
                key={p.title}
                className="group rounded-2xl border border-border bg-card p-6 hover:shadow-elegant hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="size-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold-gradient group-hover:text-gold-foreground transition">
                  <p.icon className="size-6" />
                </div>
                <h3 className="mt-5 font-display font-semibold text-lg text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

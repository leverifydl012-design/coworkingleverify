import { Users, Zap, Coffee, ShieldCheck } from "lucide-react";

const stats = [
  { value: "12K+", label: "sq ft of workspace" },
  { value: "500+", label: "members & growing" },
  { value: "24/7", label: "secure access" },
  { value: "30+", label: "events monthly" },
];

const pillars = [
  { icon: Users, title: "Real community", text: "Curated networking nights, founder breakfasts, and skill swaps." },
  { icon: Zap, title: "Deep focus", text: "Acoustic-treated zones, ergonomic seating, and lightning fiber." },
  { icon: Coffee, title: "Hospitality first", text: "Barista coffee, fresh meals, and concierge that knows your name." },
  { icon: ShieldCheck, title: "Trusted address", text: "Biometric entry, 24/7 security, and enterprise-grade IT." },
];

export function About() {
  return (
    <section id="about" className="py-24 lg:py-32">
      <div className="container-px mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">About Nexus</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-foreground leading-tight">
              A workspace built for the way modern teams actually work.
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Nexus is Islamabad's premium coworking destination — designed for founders shipping product,
              agencies serving global clients, and ecommerce teams scaling across borders. Everything here,
              from the lighting to the lattes, is tuned for productivity, focus, and serendipitous connection.
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

import { Check, Sparkles } from "lucide-react";

const plans = [
  {
    name: "Flex",
    price: "9,500",
    tagline: "For freelancers & remote workers",
    features: ["Hot desk access Mon–Sat", "Unlimited coffee & tea", "High-speed fiber Wi-Fi", "Community events", "4 meeting room hours/mo"],
  },
  {
    name: "Dedicated",
    price: "18,000",
    tagline: "For full-time professionals",
    featured: true,
    features: ["Reserved 24/7 desk", "Locker + monitor setup", "8 meeting hours/mo", "Premium phone booths", "Print & scan credits", "Guest day passes"],
  },
  {
    name: "Team",
    price: "65,000",
    tagline: "Private offices from 2 seats",
    features: ["Lockable private office", "Custom branding inside", "Dedicated meeting room", "IT & concierge support", "Priority event access"],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 lg:py-32">
      <div className="container-px mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Pricing</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Simple plans. No surprises.
          </h2>
          <p className="mt-4 text-muted-foreground">
            All plans include premium amenities, secure 24/7 access on eligible tiers, and zero setup fees.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-3xl p-8 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                p.featured
                  ? "bg-hero-gradient text-primary-foreground shadow-elegant lg:scale-105"
                  : "bg-card border border-border hover:shadow-elegant"
              }`}
            >
              {p.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-gold-gradient px-4 py-1.5 text-xs font-semibold text-gold-foreground shadow-gold">
                  <Sparkles className="size-3" /> Most Popular
                </div>
              )}
              <h3 className={`font-display text-xl font-bold ${p.featured ? "text-primary-foreground" : "text-foreground"}`}>
                {p.name}
              </h3>
              <p className={`mt-1 text-sm ${p.featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {p.tagline}
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className={`text-xs ${p.featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>PKR</span>
                <span className="font-display text-5xl font-bold">{p.price}</span>
                <span className={`text-sm ${p.featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>/mo</span>
              </div>

              <ul className="mt-8 space-y-3 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <span className={`mt-0.5 size-5 rounded-full flex items-center justify-center ${p.featured ? "bg-gold text-gold-foreground" : "bg-gold/15 text-gold"}`}>
                      <Check className="size-3" />
                    </span>
                    <span className={p.featured ? "text-primary-foreground/90" : "text-foreground/90"}>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`mt-8 inline-flex justify-center items-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                  p.featured
                    ? "bg-gold-gradient text-gold-foreground hover:opacity-90 shadow-gold"
                    : "bg-foreground text-background hover:opacity-90"
                }`}
              >
                Choose {p.name}
              </a>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Need something custom? <a href="#contact" className="text-foreground font-semibold underline underline-offset-4">Talk to our team →</a>
        </p>
      </div>
    </section>
  );
}

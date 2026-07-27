import { ArrowRight, PlayCircle, MapPin, Star } from "lucide-react";
import hero from "@/assets/hero-workspace.jpg";
import { EditableImage } from "./EditableImage";
import LogoMarquee from "./LogoMarquee";

export function Hero() {
  return (
    <section id="top" className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      {/* Background flourishes */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-32 size-[480px] rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute top-40 -right-40 size-[520px] rounded-full bg-primary/15 blur-3xl" />
      </div>

      <div className="container-px mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-medium text-foreground/80">
            <MapPin className="size-3.5 text-gold" />
            Leverify Circle · Civic Center Bahria Town, Rawalpindi
          </div>

          <h1 className="mt-6 text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-foreground">
            Work.
            <br />
            <span className="gradient-text">Connect.</span> Learn.
            <br />
            Grow.
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed">
            Leverify Circle is a community-oriented work and development space for remote professionals,
            freelancers, startups and teams — built inside Leverify's Rawalpindi office.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3.5 text-sm font-semibold shadow-elegant hover:translate-y-[-2px] transition-transform"
            >
              Book a Tour
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#workspaces"
              className="inline-flex items-center gap-2 rounded-full glass px-6 py-3.5 text-sm font-semibold text-foreground hover:bg-accent transition"
            >
              <PlayCircle className="size-4" /> Explore Workspaces
            </a>
          </div>

          <div className="mt-10 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="size-10 rounded-full border-2 border-background bg-gradient-to-br from-muted to-accent"
                  style={{ background: `linear-gradient(135deg, oklch(0.${5 + i} 0.1 ${80 + i * 40}), oklch(0.3 0.08 ${250 - i * 20}))` }}
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-gold">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
                <span className="ml-2 text-sm font-semibold text-foreground">4.9/5</span>
              </div>
              <p className="text-xs text-muted-foreground">Trusted by 500+ professionals</p>
            </div>
          </div>
        </div>

        {/* Visual */}
        <div className="relative animate-scale-in">
          <div className="relative rounded-3xl overflow-hidden shadow-elegant">
            <EditableImage
              id="hero-main"
              src={hero}
              alt="Premium coworking workspace at Leverify Islamabad with floor-to-ceiling windows"
              width={1920}
              height={1080}
              className="w-full h-[560px] lg:h-[640px] xl:h-[720px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
          </div>

          {/* Floating stat cards */}
          <div className="absolute -left-4 lg:-left-10 top-12 glass rounded-2xl p-4 w-48 animate-float shadow-elegant">
            <p className="text-xs text-muted-foreground">Active members</p>
            <p className="text-2xl font-display font-bold text-foreground">+500</p>
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full w-[78%] bg-gold-gradient rounded-full" />
            </div>
          </div>

          <div className="absolute -right-2 lg:-right-6 bottom-10 glass rounded-2xl p-4 w-56 animate-float shadow-elegant" style={{ animationDelay: "1.2s" }}>
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-gold-gradient flex items-center justify-center">
                <Star className="size-5 text-gold-foreground fill-current" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">99.9% Uptime</p>
                <p className="text-xs text-muted-foreground">Fiber + Power backup</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logo strip */}
      <div className="container-px mx-auto max-w-7xl mt-20">
        <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground mb-6">
          Powering teams from
        </p>
        <LogoMarquee />
      </div>
    </section>
  );
}

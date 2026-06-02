import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import desk from "@/assets/dedicated-desks.jpg";
import office from "@/assets/private-office.jpg";
import meeting from "@/assets/meeting-room.jpg";
import lounge from "@/assets/coworking-lounge.jpg";

const tabs = [
  {
    id: "dedicated",
    name: "Dedicated Desks",
    image: desk,
    tag: "From PKR 18,000/mo",
    description: "Your own desk in our open studio — set up your monitors, leave your gear, and own your spot.",
    features: ["Reserved 24/7 desk", "Locker storage", "Ergonomic chair", "8 meeting credits/mo"],
  },
  {
    id: "private",
    name: "Private Offices",
    image: office,
    tag: "From PKR 65,000/mo",
    description: "Lockable, fully furnished offices for teams of 2–20. Brand it, scale it, make it yours.",
    features: ["Lockable office", "Custom branding", "Team meeting rooms", "Dedicated IT support"],
  },
  {
    id: "meeting",
    name: "Meeting Rooms",
    image: meeting,
    tag: "From PKR 1,500/hr",
    description: "Book by the hour. 4K displays, video conferencing, and whiteboards on every wall.",
    features: ["4–20 person rooms", "4K + Logitech Rally", "Catering on request", "Instant booking"],
  },
  {
    id: "shared",
    name: "Shared Coworking",
    image: lounge,
    tag: "From PKR 9,500/mo",
    description: "Hot-desking across the lounge and shared studio. Show up, plug in, get to work.",
    features: ["Any open seat", "Unlimited coffee", "Community events", "Mon–Sat access"],
  },
  {
    id: "virtual",
    name: "Virtual Office",
    image: office,
    tag: "From PKR 4,500/mo",
    description: "A prestigious Islamabad business address, mail handling, and meeting room credits.",
    features: ["Business address", "Mail handling", "Call answering", "4 meeting hrs/mo"],
  },
];

export function Workspaces() {
  const [active, setActive] = useState(tabs[0].id);
  const current = tabs.find((t) => t.id === active)!;

  return (
    <section id="workspaces" className="py-24 lg:py-32 bg-muted/40">
      <div className="container-px mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Workspaces</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Five ways to work. One premium address.
            </h2>
          </div>
          <a href="#contact" className="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-gold transition">
            Book a tour <ArrowUpRight className="size-4" />
          </a>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${
                active === t.id
                  ? "bg-foreground text-background shadow-elegant"
                  : "glass text-foreground/80 hover:text-foreground"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        <div key={current.id} className="mt-10 grid lg:grid-cols-2 gap-8 items-stretch animate-fade-up">
          <div className="relative rounded-3xl overflow-hidden shadow-elegant min-h-[400px]">
            <EditableImage
              id={`workspace-${current.id}`}
              src={current.image}
              alt={current.name}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 glass rounded-full px-4 py-2 text-sm font-semibold text-foreground">
              {current.tag}
            </div>
          </div>

          <div className="rounded-3xl bg-card border border-border p-8 lg:p-10 flex flex-col">
            <h3 className="font-display text-3xl font-bold text-foreground">{current.name}</h3>
            <p className="mt-4 text-muted-foreground leading-relaxed">{current.description}</p>

            <ul className="mt-8 space-y-3 flex-1">
              {current.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-foreground/90">
                  <span className="mt-0.5 size-5 rounded-full bg-gold/15 text-gold flex items-center justify-center">
                    <Check className="size-3" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-3 text-sm font-semibold shadow-elegant hover:opacity-90 transition"
              >
                Reserve {current.name}
                <ArrowUpRight className="size-4" />
              </a>
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-accent transition"
              >
                See all plans
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

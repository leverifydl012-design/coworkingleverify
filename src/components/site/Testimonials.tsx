import { Quote, Star } from "lucide-react";
import { EditableImage } from "./EditableImage";

const items = [
  {
    id: "ayesha",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    quote: "We scaled our agency from 4 to 18 people inside Leverify without ever moving offices. The team handles everything.",
    name: "Ayesha Khan",
    role: "Founder, Pixelcraft Studio",
  },
  {
    id: "hamza",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    quote: "Fastest internet I've ever had in Pakistan, real coffee, and the community is the best perk. I haven't worked from home in months.",
    name: "Hamza Tariq",
    role: "Senior Engineer, Remote",
  },
  {
    id: "sara",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
    quote: "Our ecommerce team runs photo shoots, calls with US clients, and pack-out days from one address. Leverify is our HQ.",
    name: "Sara Mahmood",
    role: "COO, Brandloom",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 lg:py-32 bg-hero-gradient text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 -z-0 opacity-30">
        <div className="absolute top-20 -left-20 size-96 rounded-full bg-gold/30 blur-3xl" />
        <div className="absolute bottom-10 right-0 size-96 rounded-full bg-primary/40 blur-3xl" />
      </div>
      <div className="container-px container-shell relative">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Testimonials</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">
            Loved by Islamabad's best teams.
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {items.map((t) => (
            <figure key={t.name} className="glass-dark rounded-3xl p-8 flex flex-col">
              <Quote className="size-8 text-gold" />
              <blockquote className="mt-6 text-lg leading-relaxed text-primary-foreground/95 flex-1">
                "{t.quote}"
              </blockquote>
              <div className="mt-8 flex items-center justify-between">
                <figcaption className="flex items-center gap-3">
                  <div className="relative size-12 rounded-full overflow-hidden ring-2 ring-gold/40 shrink-0">
                    <EditableImage
                      id={`testimonial-${t.id}`}
                      src={t.avatar}
                      alt={t.name}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-display font-semibold">{t.name}</div>
                    <div className="text-sm text-primary-foreground/70">{t.role}</div>
                  </div>
                </figcaption>
                <div className="flex gap-0.5 text-gold">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="size-4 fill-current" />)}
                </div>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Wifi, Zap, Users, Snowflake, Coffee, ShieldCheck, Car, Printer, Clock } from "lucide-react";
import { EditableImage } from "./EditableImage";
import lounge from "@/assets/coworking-lounge.jpg";

const items = [
  { icon: Wifi, title: "High-speed Internet", text: "Symmetric fiber with redundant failover." },
  { icon: Zap, title: "Power Backup", text: "Zero downtime — UPS + generator on demand." },
  { icon: Users, title: "Meeting Rooms", text: "Book by the hour with 4K conferencing." },
  { icon: Snowflake, title: "Climate Control", text: "Zoned AC for year-round comfort." },
  { icon: Coffee, title: "Tea & Coffee", text: "Barista bar, free refills, snacks daily." },
  { icon: ShieldCheck, title: "24/7 Security", text: "Biometric entry & on-site guards." },
  { icon: Car, title: "Parking", text: "Covered parking for members & guests." },
  { icon: Printer, title: "Print & Scan", text: "Wireless printing credits included." },
  { icon: Clock, title: "24/7 Access", text: "Work on your schedule, not ours." },
];

export function Amenities() {
  return (
    <section id="amenities" className="py-24 lg:py-32 bg-muted/40">
      <div className="container-px mx-auto max-w-7xl">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Amenities</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Every detail engineered for momentum.
          </h2>
        </div>

        <div className="relative mt-10 rounded-3xl overflow-hidden shadow-elegant h-56 md:h-72">
          <EditableImage
            id="amenities-cover"
            src={lounge}
            alt="Leverify amenities and lounge space"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5">
          {items.map((it) => (
            <div
              key={it.title}
              className="group rounded-2xl bg-card border border-border p-6 hover:border-gold/40 hover:shadow-elegant transition-all duration-300"
            >
              <div className="size-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center group-hover:bg-gold-gradient group-hover:text-gold-foreground transition">
                <it.icon className="size-6" />
              </div>
              <h3 className="mt-5 font-display font-semibold text-foreground">{it.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

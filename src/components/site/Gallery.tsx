import hero from "@/assets/hero-workspace.jpg";
import { EditableImage } from "./EditableImage";
import desk from "@/assets/dedicated-desks.jpg";
import office from "@/assets/private-office.jpg";
import meeting from "@/assets/meeting-room.jpg";
import lounge from "@/assets/coworking-lounge.jpg";

const images = [
  { src: hero, label: "Open Studio", span: "lg:col-span-2 lg:row-span-2" },
  { src: lounge, label: "Lounge" },
  { src: office, label: "Private Office" },
  { src: meeting, label: "Boardroom" },
  { src: desk, label: "Dedicated Desks" },
];

export function Gallery() {
  return (
    <section id="gallery" className="py-24 lg:py-32">
      <div className="container-px mx-auto max-w-[1760px]">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Gallery</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Step inside Leverify Islamabad.
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            Architect-designed interiors, biophilic light, and quiet zones that respect deep work.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-3 lg:gap-4 lg:h-[640px]">
          {images.map((img, i) => (
            <div
              key={i}
              className={`relative group rounded-2xl overflow-hidden ${img.span ?? ""}`}
            >
              <EditableImage
                id={`gallery-${i}`}
                src={img.src}
                alt={img.label}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition" />
              <div className="absolute bottom-4 left-4 text-primary-foreground font-display font-semibold">
                {img.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { Menu, X, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/leverify-logo.png";

const links = [
  { href: "#workspaces", label: "Workspaces" },
  { href: "#availability", label: "Availability" },
  { href: "#calendar", label: "Calendar" },
  { href: "#pricing", label: "Pricing" },
  { href: "#amenities", label: "Amenities" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "py-3" : "py-5",
      )}
    >
      <div className="container-px mx-auto max-w-7xl">
        <div
          className={cn(
            "flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-300",
            scrolled ? "glass shadow-elegant" : "bg-transparent",
          )}
        >
          <a href="#top" className="flex items-center gap-2 group">
            <div className="size-10 rounded-xl bg-white shadow-elegant flex items-center justify-center p-1.5">
              <img src={logo} alt="Leverify logo" className="size-full object-contain" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-base text-foreground">Leverify Circle</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Work · Connect · Learn · Grow</span>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground rounded-lg hover:bg-accent transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href="#contact"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Book a Tour
            </a>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition shadow-elegant"
            >
              Get Started
            </a>
          </div>

          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center size-10 rounded-lg hover:bg-accent"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden mt-2 glass rounded-2xl p-4 animate-fade-up">
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 text-sm font-medium rounded-lg hover:bg-accent"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#pricing"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex justify-center rounded-full bg-foreground text-background px-5 py-3 text-sm font-semibold"
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

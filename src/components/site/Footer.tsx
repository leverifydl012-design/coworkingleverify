import { Instagram, Linkedin, Facebook, Twitter, ArrowUpRight } from "lucide-react";
import logo from "@/assets/leverify-logo.png";

export function Footer() {
  return (
    <footer className="bg-hero-gradient text-primary-foreground">
      <div className="container-px mx-auto max-w-[1760px] py-20">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <a href="#top" className="flex items-center gap-2">
              <div className="size-11 rounded-xl bg-white flex items-center justify-center p-1.5">
                <img src={logo} alt="Leverify logo" className="size-full object-contain" />
              </div>
              <span className="font-display text-lg font-bold">Leverify Coworking</span>
            </a>
            <p className="mt-5 text-primary-foreground/70 max-w-sm leading-relaxed">
              Premium coworking in Civic Center Bahria Town, Rawalpindi. Designed for founders, agencies, and remote teams
              that take work — and the people doing it — seriously.
            </p>
            <a
              href="#contact"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold-gradient text-gold-foreground px-5 py-3 text-sm font-semibold shadow-gold hover:opacity-90 transition"
            >
              Book a Tour <ArrowUpRight className="size-4" />
            </a>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <FooterCol title="Workspace" links={[
              ["Dedicated Desks", "#workspaces"],
              ["Private Offices", "#workspaces"],
              ["Meeting Rooms", "#workspaces"],
              ["Virtual Office", "#workspaces"],
            ]} />
            <FooterCol title="Company" links={[
              ["About", "#about"],
              ["Pricing", "#pricing"],
              ["Gallery", "#gallery"],
              ["FAQ", "#faq"],
            ]} />
            <FooterCol title="Contact" links={[
              ["Office#04 Floor, 145 St 3, Civic Center Bahria Town, Rawalpindi", "#contact"],
              ["051-8488180", "tel:051-8488180"],
              ["admin@leverify.com", "mailto:admin@leverify.com"],
            ]} />
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-primary-foreground/60">
            © {new Date().getFullYear()} Leverify Coworking. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {[Instagram, Linkedin, Facebook, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="size-9 rounded-full glass-dark flex items-center justify-center hover:bg-gold hover:text-gold-foreground transition"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="font-display font-semibold text-sm uppercase tracking-wider text-gold">{title}</h4>
      <ul className="mt-4 space-y-3">
        {links.map(([label, href]) => (
          <li key={label}>
            <a href={href} className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition">
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  { q: "Where is Leverify located in Islamabad?", a: "We're in the heart of F-7 Markaz with quick access from Margalla Road and Jinnah Avenue. Covered parking and a dedicated entry for members." },
  { q: "Can I tour the space before signing up?", a: "Yes — book a free 20-minute tour through the contact form. We'll walk you through every workspace type and let you trial a day pass." },
  { q: "What internet speeds do you offer?", a: "Symmetric 1 Gbps fiber from multiple ISPs with automatic failover, plus enterprise Wi-Fi 6 access points across the building." },
  { q: "Do you have 24/7 access?", a: "Members on Dedicated, Team, and Private Office plans get biometric 24/7 access. Flex members access Monday–Saturday during operating hours." },
  { q: "Can I register my business at this address?", a: "Yes. Our Virtual Office plan includes a verifiable Islamabad business address, mail handling, and call answering." },
  { q: "Do you offer day passes?", a: "Absolutely. Drop in for PKR 1,500/day — includes Wi-Fi, coffee, and access to the coworking lounge." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-24 lg:py-32">
      <div className="container-px mx-auto max-w-4xl">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">FAQ</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Questions, answered.
          </h2>
        </div>

        <div className="mt-12 divide-y divide-border border-y border-border">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="py-2">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-6 py-5 text-left group"
                >
                  <span className="font-display font-semibold text-base md:text-lg text-foreground group-hover:text-gold transition">
                    {f.q}
                  </span>
                  <span className="size-9 rounded-full border border-border flex items-center justify-center shrink-0 group-hover:bg-foreground group-hover:text-background transition">
                    {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
                  </span>
                </button>
                {isOpen && (
                  <p className="pb-6 pr-12 text-muted-foreground leading-relaxed animate-fade-up">
                    {f.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

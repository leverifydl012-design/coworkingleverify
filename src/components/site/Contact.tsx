import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Send, CircleCheck as CheckCircle2 } from "lucide-react";
import { EditableImage } from "./EditableImage";
import lounge from "@/assets/coworking-lounge.jpg";
import { supabase } from "@/lib/supabase";

export function Contact() {
  const [sent, setSent] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", interest: "Dedicated Desk", message: "" });

  useEffect(() => setMounted(true), []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;

    setIsSubmitting(true);
    try {
      await supabase.from("inquiries").insert({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        interest: form.interest,
        message: form.message || null,
      });
      setSent(true);
    } catch (err) {
      console.error("Failed to submit inquiry:", err);
    }
    setIsSubmitting(false);
  }

  return (
    <section id="contact" className="relative py-24 lg:py-32 bg-muted/40 overflow-hidden">
      <div className="absolute inset-0 -z-0">
        <EditableImage
          id="contact-bg"
          src={lounge}
          alt=""
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-muted/40" />
      </div>
      <div className="container-px mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 relative">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Contact</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold text-foreground leading-tight">
            Book a tour. Tour today.
          </h2>
          <p className="mt-4 text-muted-foreground max-w-md">
            Tell us how you work and we'll match you to the perfect workspace. Most tours are confirmed within an hour.
          </p>

          <ul className="mt-10 space-y-5">
            <li className="flex items-start gap-4">
              <span className="size-11 rounded-xl bg-gold/15 text-gold flex items-center justify-center"><MapPin className="size-5" /></span>
              <div>
                <div className="font-semibold text-foreground">Visit</div>
                <div className="text-sm text-muted-foreground">Office#04 Floor, 145 St 3, Civic Center Bahria Town, Rawalpindi</div>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="size-11 rounded-xl bg-gold/15 text-gold flex items-center justify-center"><Phone className="size-5" /></span>
              <div>
                <div className="font-semibold text-foreground">Call</div>
                <div className="text-sm text-muted-foreground">051-8488180</div>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="size-11 rounded-xl bg-gold/15 text-gold flex items-center justify-center"><Phone className="size-5" /></span>
              <div>
                <div className="font-semibold text-foreground">Mobile</div>
                <div className="text-sm text-muted-foreground">03315362692</div>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="size-11 rounded-xl bg-gold/15 text-gold flex items-center justify-center"><Mail className="size-5" /></span>
              <div>
                <div className="font-semibold text-foreground">Email</div>
                <div className="text-sm text-muted-foreground">admin@leverify.com</div>
              </div>
            </li>
          </ul>

          <div className="mt-10 rounded-3xl overflow-hidden border border-border shadow-elegant aspect-[16/10]">
            <iframe
              title="Leverify Coworking — Civic Center Bahria Town, Rawalpindi"
              src="https://www.google.com/maps?q=Civic+Center+Bahria+Town+Phase+4,+Rawalpindi&output=embed"
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="border-0"
            />
          </div>
        </div>

        <div className="rounded-3xl bg-card border border-border p-8 lg:p-10 shadow-elegant">
          {sent ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20 animate-scale-in">
              <CheckCircle2 className="size-14 text-gold" />
              <h3 className="mt-6 font-display text-2xl font-bold text-foreground">Tour request received</h3>
              <p className="mt-3 text-muted-foreground max-w-sm">
                Thanks {form.name.split(" ")[0]} — our community team will reach out within an hour to confirm your tour.
              </p>
              <button
                onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", interest: "Dedicated Desk", message: "" }); }}
                className="mt-8 text-sm font-semibold text-foreground underline underline-offset-4"
              >
                Send another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <h3 className="font-display text-2xl font-bold text-foreground">Inquiry form</h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full name" required>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    maxLength={80}
                    className="input"
                    placeholder="Ayesha Khan"
                  />
                </Field>
                <Field label="Email" required>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    maxLength={120}
                    className="input"
                    placeholder="you@company.com"
                  />
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Phone">
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    maxLength={30}
                    className="input"
                    placeholder="+92 300 0000000"
                  />
                </Field>
                <Field label="Interested in">
                  {mounted ? (
                    <select
                      value={form.interest}
                      onChange={(e) => setForm({ ...form, interest: e.target.value })}
                      className="input"
                    >
                      <option>Dedicated Desk</option>
                      <option>Private Office</option>
                      <option>Meeting Room</option>
                      <option>Shared Coworking</option>
                      <option>Virtual Office</option>
                    </select>
                  ) : (
                    <input readOnly value={form.interest} className="input" aria-hidden="true" />
                  )}
                </Field>
              </div>

              <Field label="Message">
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  maxLength={1000}
                  className="input resize-none"
                  placeholder="Tell us about your team and what you need…"
                />
              </Field>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-6 py-3.5 text-sm font-semibold shadow-elegant hover:opacity-90 transition disabled:opacity-50"
              >
                <Send className="size-4" /> {isSubmitting ? "Submitting..." : "Request a Tour"}
              </button>
              <p className="text-xs text-muted-foreground text-center">By submitting, you agree to be contacted by our team.</p>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          background: var(--background);
          border: 1px solid var(--border);
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          color: var(--foreground);
          transition: border-color .15s, box-shadow .15s;
          outline: none;
        }
        .input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px color-mix(in oklab, var(--gold) 20%, transparent); }
      `}</style>
    </section>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-foreground/80 mb-1.5">
        {label} {required && <span className="text-gold">*</span>}
      </span>
      {children}
    </label>
  );
}

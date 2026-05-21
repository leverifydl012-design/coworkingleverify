import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", interest: "Dedicated Desk", message: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // Basic validation
    if (!form.name.trim() || !form.email.trim()) return;
    setSent(true);
  }

  return (
    <section id="contact" className="py-24 lg:py-32 bg-muted/40">
      <div className="container-px mx-auto max-w-7xl grid lg:grid-cols-2 gap-12">
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
                <div className="text-sm text-muted-foreground">Nexus Coworking, F-7 Markaz, Islamabad</div>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="size-11 rounded-xl bg-gold/15 text-gold flex items-center justify-center"><Phone className="size-5" /></span>
              <div>
                <div className="font-semibold text-foreground">Call</div>
                <div className="text-sm text-muted-foreground">+92 51 123 4567</div>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <span className="size-11 rounded-xl bg-gold/15 text-gold flex items-center justify-center"><Mail className="size-5" /></span>
              <div>
                <div className="font-semibold text-foreground">Email</div>
                <div className="text-sm text-muted-foreground">hello@nexuscoworking.pk</div>
              </div>
            </li>
          </ul>

          <div className="mt-10 rounded-3xl overflow-hidden border border-border shadow-elegant aspect-[16/10]">
            <iframe
              title="Nexus Coworking — Islamabad location"
              src="https://www.google.com/maps?q=F-7+Markaz,+Islamabad,+Pakistan&output=embed"
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
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-6 py-3.5 text-sm font-semibold shadow-elegant hover:opacity-90 transition"
              >
                <Send className="size-4" /> Request a Tour
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

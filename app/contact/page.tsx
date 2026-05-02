import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { getSiteSettings } from "@/lib/content";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const s = await getSiteSettings();
  return (
    <div className="container-page py-16 md:py-24">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Contact</p>
      <h1 className="mt-2 font-display text-4xl md:text-6xl">Let's talk.</h1>

      <div className="mt-12 grid gap-12 md:grid-cols-[1.3fr_1fr]">
        <ContactForm />
        <aside className="space-y-6">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-white/50">Reach us</h2>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li className="flex gap-3"><MapPin className="size-4 text-white/50" /> {s.address}</li>
              <li className="flex gap-3"><Phone className="size-4 text-white/50" /> <a href={`tel:${s.phone}`}>{s.phone}</a></li>
              <li className="flex gap-3"><Mail className="size-4 text-white/50" /> <a href={`mailto:${s.email}`}>{s.email}</a></li>
            </ul>
          </div>
          {s.brochure && (
            <a href={s.brochure} className="block rounded-xl border border-white/15 px-4 py-3 text-sm hover:bg-white/5">
              Download e-brochure (PDF) →
            </a>
          )}
        </aside>
      </div>
    </div>
  );
}

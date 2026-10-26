import type { Metadata } from "next";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { getSiteSettings } from "@/lib/content";
import { BUSINESS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with LEDs Concept for LED lighting design, supply and installation. Request a quote for your nightclub, venue, home theatre or architectural project.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact", title: "Contact · LEDs Concept" },
};

export default async function ContactPage() {
  const s = await getSiteSettings();
  return (
    <div className="container-page py-16 md:py-24">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Contact</p>
      <h1 className="mt-2 font-display text-3xl sm:text-4xl md:text-6xl">Let's talk.</h1>

      <div className="mt-12 grid gap-12 md:grid-cols-[1.3fr_1fr]">
        <ContactForm />
        <aside className="space-y-6">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-white/50">Reach us</h2>
            <p className="mt-3 font-display text-lg">{BUSINESS.legalName}</p>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li className="flex gap-3"><MapPin className="size-4 text-white/50" /> {s.address}</li>
              <li className="flex gap-3"><Phone className="size-4 text-white/50" /> <a href={BUSINESS.whatsappTel}>{BUSINESS.whatsapp}</a></li>
              <li className="flex gap-3"><Mail className="size-4 text-white/50" /> <a href={`mailto:${s.email}`}>{s.email}</a></li>
            </ul>
            <a
              href={BUSINESS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-medium text-white shadow-[0_10px_30px_-10px_rgba(37,211,102,0.7)] ring-1 ring-white/20 transition hover:scale-[1.03]"
            >
              <MessageCircle className="size-4" /> Chat on WhatsApp
            </a>
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

import Link from "next/link";
import { Instagram, Youtube, Facebook, Twitter } from "lucide-react";
import type { SiteSettings } from "@/lib/sample-data";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-24 border-t border-white/10 bg-black/40">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <div className="font-display text-xl">
            <span className="neon-text">LEDs</span> Concept
          </div>
          <p className="mt-3 text-sm text-white/60">{settings.tagline}</p>
          <p className="mt-2 text-xs text-white/40">Madrix Licensed Associates</p>
        </div>
        <div>
          <h4 className="mb-3 text-xs uppercase tracking-widest text-white/50">Sitemap</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/projects">Projects</Link></li>
            <li><Link href="/products">Products</Link></li>
            <li><Link href="/gallery">Gallery</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-xs uppercase tracking-widest text-white/50">Reach us</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>{settings.address}</li>
            <li><a href={`tel:${settings.phone}`}>{settings.phone}</a></li>
            <li><a href={`mailto:${settings.email}`}>{settings.email}</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-xs uppercase tracking-widest text-white/50">Follow</h4>
          <div className="flex gap-3">
            {settings.instagram && <a href={settings.instagram} aria-label="Instagram" className="rounded-full border border-white/15 p-2 hover:bg-white/10"><Instagram className="size-4" /></a>}
            {settings.youtube && <a href={settings.youtube} aria-label="YouTube" className="rounded-full border border-white/15 p-2 hover:bg-white/10"><Youtube className="size-4" /></a>}
            {settings.facebook && <a href={settings.facebook} aria-label="Facebook" className="rounded-full border border-white/15 p-2 hover:bg-white/10"><Facebook className="size-4" /></a>}
            {settings.twitter && <a href={settings.twitter} aria-label="Twitter" className="rounded-full border border-white/15 p-2 hover:bg-white/10"><Twitter className="size-4" /></a>}
          </div>
          {settings.brochure && (
            <a href={settings.brochure} className="mt-4 inline-block text-sm text-white/70 underline-offset-4 hover:underline">
              Download e-brochure
            </a>
          )}
        </div>
      </div>
      <div className="border-t border-white/5 py-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} LEDs Concept. All rights reserved.
      </div>
    </footer>
  );
}

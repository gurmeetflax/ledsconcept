import type { Metadata } from "next";
import Link from "next/link";
import { getAllProjects } from "@/lib/content";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Share cards",
  description: "Download branded WhatsApp cards for LEDs Concept projects.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/cards" },
};

export default async function CardsPage() {
  const projects = await getAllProjects();
  const cards = [
    { slug: "cover", label: "Cover", file: "leds-concept-cover.png" },
    ...projects.map((p) => ({
      slug: p.slug,
      label: p.title,
      file: `leds-concept-${p.slug}.png`,
    })),
  ];

  return (
    <div className="container-page py-16 md:py-24">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Marketing</p>
      <h1 className="mt-2 font-display text-3xl sm:text-4xl md:text-6xl">Share cards</h1>
      <p className="mt-4 max-w-2xl text-white/70 md:text-lg">
        Ready-to-forward WhatsApp cards for each project, sized 1080×1350 with the real project photo.
        Tap <span className="text-white">Save image</span> below a card (or long-press it on your phone),
        then attach it in a WhatsApp chat or Status.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.slug} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/cards/${c.slug}`}
              alt={`${c.label} WhatsApp card`}
              width={1080}
              height={1350}
              loading="lazy"
              className="w-full"
            />
            <div className="flex items-center justify-between gap-3 p-4">
              <span className="truncate font-display text-base">{c.label}</span>
              <a
                href={`/cards/${c.slug}`}
                download={c.file}
                className="flex-none rounded-full bg-neon-grad px-4 py-2 text-xs font-medium text-ink"
              >
                Save image
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
        <h2 className="font-display text-xl">How to forward on WhatsApp</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-white/70">
          <li>Tap <span className="text-white">Save image</span> (on a phone, long-press the card → Save to Photos).</li>
          <li>Open a WhatsApp chat or your Status → attach → Gallery → pick the card → send.</li>
          <li>To forward one you already sent, long-press it → Forward → choose contacts.</li>
        </ol>
        <p className="mt-4 text-sm text-white/50">
          Send as a photo (not “Document”) so it previews inline.
        </p>
      </div>

      <div className="mt-10">
        <Link href="/projects" className="text-sm text-white/70 hover:text-white">
          ← Back to projects
        </Link>
      </div>
    </div>
  );
}

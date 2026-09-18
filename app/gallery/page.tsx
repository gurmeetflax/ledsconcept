import type { Metadata } from "next";
import { LightboxGrid } from "@/components/lightbox-grid";
import { getAllProjects } from "@/lib/content";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Gallery",
  description:
    "A visual gallery of LEDs Concept installations — pixel-mapped lighting across nightclubs, architecture and events.",
  alternates: { canonical: "/gallery" },
  openGraph: { url: "/gallery", title: "Gallery · LEDs Concept" },
};

export default async function GalleryPage() {
  const projects = await getAllProjects();
  const images = projects
    .filter((p) => p.image)
    .map((p) => ({ src: p.image, alt: `${p.title} — ${p.sector} LED lighting, ${p.location}` }));

  return (
    <div className="container-page py-16 md:py-24">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Visuals</p>
      <h1 className="mt-2 font-display text-3xl sm:text-4xl md:text-6xl">Gallery</h1>

      <div className="mt-10">
        <LightboxGrid items={images} layout="masonry" />
      </div>
    </div>
  );
}

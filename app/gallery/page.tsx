import { LightboxGrid } from "@/components/lightbox-grid";
import { getAllProjects } from "@/lib/content";

export const revalidate = 60;
export const metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const projects = await getAllProjects();
  const images = projects.flatMap((p) => [p.image, p.image]).filter(Boolean) as string[];

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

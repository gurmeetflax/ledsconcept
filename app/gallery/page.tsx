import { getAllProjects } from "@/lib/content";

export const revalidate = 60;
export const metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const projects = await getAllProjects();
  // Build a masonry from project images for v1; later wire to dedicated galleryItem schema.
  const images = projects.flatMap((p) => [p.image, p.image]);

  return (
    <div className="container-page py-16 md:py-24">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Visuals</p>
      <h1 className="mt-2 font-display text-4xl md:text-6xl">Gallery</h1>

      <div className="mt-10 columns-2 gap-3 md:columns-3 lg:columns-4 [&>*]:mb-3 [&>*]:break-inside-avoid">
        {images.map((src, i) => (
          <div
            key={i}
            className={`overflow-hidden rounded-xl ${i % 3 === 0 ? "aspect-[3/4]" : i % 3 === 1 ? "aspect-square" : "aspect-[4/5]"} bg-cover bg-center`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>
    </div>
  );
}

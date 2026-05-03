import Link from "next/link";
import { SanityImage } from "@/components/sanity-image";
import { getAllProjects } from "@/lib/content";

export const revalidate = 60;
export const metadata = { title: "Case Studies" };

export default async function CaseStudiesPage() {
  const projects = await getAllProjects();

  return (
    <div className="container-page py-16 md:py-24">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">In depth</p>
      <h1 className="mt-2 font-display text-3xl sm:text-4xl md:text-6xl">Case Studies</h1>
      <p className="mt-4 max-w-2xl text-white/70">
        A closer look at the briefs, design intent, and execution behind our projects.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {projects.map((p) => (
          <Link
            key={p._id}
            href={`/case-studies/${p.slug}`}
            className="group overflow-hidden rounded-2xl border border-white/10"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <SanityImage
                src={p.image}
                alt={p.title}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-[10px] uppercase tracking-widest text-white/60">
                  {p.sector} · {p.year}
                </p>
                <h3 className="mt-1 font-display text-xl">{p.title}</h3>
                <p className="text-xs text-white/60">{p.location}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import { SanityImage } from "@/components/sanity-image";
import { getAllProjects, getSectors } from "@/lib/content";

export const revalidate = 60;
export const metadata = { title: "Projects" };

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string }>;
}) {
  const params = await searchParams;
  const [projects, sectors] = await Promise.all([getAllProjects(), getSectors()]);
  const filtered = params.sector
    ? projects.filter((p) => p.sectorSlug === params.sector)
    : projects;

  return (
    <div className="container-page py-16 md:py-24">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Work</p>
      <h1 className="mt-2 font-display text-3xl sm:text-4xl md:text-6xl">Projects</h1>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/projects"
          className={`rounded-full border border-white/15 px-4 py-1.5 text-sm ${!params.sector ? "bg-white text-ink" : "text-white/70 hover:bg-white/5"}`}
        >
          All
        </Link>
        {sectors.map((s) => (
          <Link
            key={s._id}
            href={`/projects?sector=${s.slug}`}
            className={`rounded-full border border-white/15 px-4 py-1.5 text-sm ${params.sector === s.slug ? "bg-white text-ink" : "text-white/70 hover:bg-white/5"}`}
          >
            {s.name}
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {filtered.map((p) => (
          <Link
            key={p._id}
            href={`/projects/${p.slug}`}
            className="group overflow-hidden rounded-2xl border border-white/10"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <SanityImage
                src={p.image}
                alt={p.title}
                fill
                sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <p className="text-[10px] uppercase tracking-widest text-white/50">{p.sector} · {p.year}</p>
              <h3 className="mt-1 font-display text-lg">{p.title}</h3>
              <p className="text-xs text-white/50">{p.location}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

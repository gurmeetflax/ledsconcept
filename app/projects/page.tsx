import type { Metadata } from "next";
import Link from "next/link";
import { SanityImage } from "@/components/sanity-image";
import { IndiaFootprint } from "@/components/india-footprint";
import { getAllProjects, getSectors } from "@/lib/content";
import { buildFootprintCities } from "@/lib/footprint";
import { cn } from "@/lib/cn";

export const revalidate = 60;
export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected LED lighting projects by LEDs Concept — pixel-mapped nightclubs, architectural facades and event installations across India.",
  alternates: { canonical: "/projects" },
  openGraph: { url: "/projects", title: "Projects · LEDs Concept" },
};

const TABS = [
  { key: "grid", label: "Projects", href: "/projects" },
  { key: "map", label: "Map", href: "/projects?view=map" },
] as const;

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string; view?: string }>;
}) {
  const params = await searchParams;
  const isMap = params.view === "map";
  const [projects, sectors] = await Promise.all([getAllProjects(), getSectors()]);
  const filtered = params.sector
    ? projects.filter((p) => p.sectorSlug === params.sector)
    : projects;

  return (
    <div className="container-page py-16 md:py-24">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Work</p>
      <h1 className="mt-2 font-display text-3xl sm:text-4xl md:text-6xl">Projects</h1>

      {/* View tabs */}
      <div className="mt-7 flex gap-1 border-b border-white/10">
        {TABS.map((t) => {
          const activeTab = t.key === "map" ? isMap : !isMap;
          return (
            <Link
              key={t.key}
              href={t.href}
              className={cn(
                "relative -mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition",
                activeTab
                  ? "border-neon-magenta text-white"
                  : "border-transparent text-white/55 hover:text-white",
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      {isMap ? (
        <div className="mt-8">
          <p className="mb-6 max-w-2xl text-sm text-white/60 md:text-base">
            Installations delivered across India — tap a city to see the projects there.
          </p>
          <IndiaFootprint cities={buildFootprintCities(projects)} />
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SanityImage } from "@/components/sanity-image";
import type { Project } from "@/lib/sample-data";

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  return (
    <section className="container-page py-14 md:py-28">
      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Selected projects</p>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl md:text-5xl">Recent installations.</h2>
        </div>
        <Link href="/projects" className="hidden items-center gap-2 text-sm text-white/70 hover:text-white md:inline-flex">
          View all <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="grid auto-rows-[280px] grid-cols-2 gap-4 md:auto-rows-[320px] md:grid-cols-3">
        {projects.map((p) => (
          <Link
            key={p._id}
            href={`/projects/${p.slug}`}
            className="group relative overflow-hidden rounded-2xl border border-white/10"
          >
            <SanityImage
              src={p.image}
              alt={p.title}
              fill
              sizes="(min-width: 768px) 33vw, 50vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent" aria-hidden />
            <div className="absolute inset-0 flex flex-col justify-end p-5">
              <p className="text-[10px] uppercase tracking-widest text-white/60">{p.sector} · {p.year}</p>
              <h3 className="mt-1 font-display text-lg md:text-2xl">{p.title}</h3>
              <p className="text-xs text-white/60">{p.location}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

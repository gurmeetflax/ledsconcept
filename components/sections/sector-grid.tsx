import Link from "next/link";
import type { Sector } from "@/lib/sample-data";
import { ArrowUpRight } from "lucide-react";

export function SectorGrid({ sectors }: { sectors: Sector[] }) {
  return (
    <section className="container-page py-14 md:py-28">
      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">What we light</p>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl md:text-5xl">Three worlds, one canvas.</h2>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {sectors.map((s) => (
          <Link
            key={s._id}
            href={`/projects?sector=${s.slug}`}
            className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${s.image})` }}
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" aria-hidden />
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl">{s.name}</h3>
                <ArrowUpRight className="size-5 transition group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-white/70">{s.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

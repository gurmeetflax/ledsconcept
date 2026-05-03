import Link from "next/link";
import { notFound } from "next/navigation";
import { LiteYouTube } from "@/components/lite-youtube";
import { LightboxGrid } from "@/components/lightbox-grid";
import { SanityImage } from "@/components/sanity-image";
import { CaseStudy } from "@/components/case-study";
import { getAllProjects, getProjectBySlug } from "@/lib/content";
import type { PortableTextBlock } from "@portabletext/react";

export const revalidate = 60;

export async function generateStaticParams() {
  const all = await getAllProjects();
  return all.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = (await getProjectBySlug(slug)) as
    | (Awaited<ReturnType<typeof getProjectBySlug>> & {
        title: string;
        year: number;
        location: string;
        sector: string;
        image: string;
        headerVideo?: string;
        summary?: string;
        gearUsed?: string[];
        video?: string;
        gallery?: string[];
        body?: PortableTextBlock[];
        zones?: { zone: string; treatment: string }[];
      })
    | null;
  if (!p) notFound();

  return (
    <article>
      <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        {p.headerVideo ? (
          <video
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            src={p.headerVideo}
            poster={p.image}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden
          />
        ) : (
          <SanityImage
            src={p.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/20 to-ink" />
        <div className="container-page absolute inset-x-0 bottom-10">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">{p.sector} · {p.year} · {p.location}</p>
          <h1 className="mt-3 font-display text-3xl sm:text-5xl md:text-7xl">{p.title}</h1>
        </div>
      </div>

      <div className="container-page grid gap-12 py-16 md:grid-cols-3 md:gap-16">
        <div className="md:col-span-2">
          <h2 className="text-xs uppercase tracking-widest text-white/50">The brief</h2>
          <p className="mt-3 text-lg leading-relaxed text-white/80">{p.summary}</p>
        </div>
        <aside>
          <h2 className="text-xs uppercase tracking-widest text-white/50">Gear used</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            {(p.gearUsed ?? []).map((g) => (
              <li key={g} className="border-b border-white/10 pb-2">{g}</li>
            ))}
          </ul>
        </aside>
      </div>

      <CaseStudy body={p.body} zones={p.zones} />

      {!!p.gallery?.length && (
        <div className="container-page pb-16">
          <LightboxGrid items={p.gallery} layout="grid" />
        </div>
      )}

      {p.video && (
        <div className="container-page pb-16">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-white/10">
            <LiteYouTube videoId={p.video} title={`${p.title} video`} />
          </div>
        </div>
      )}

      <div className="container-page flex justify-between border-t border-white/10 py-10">
        <Link href="/projects" className="text-sm text-white/70 hover:text-white">← All projects</Link>
        <Link href="/contact" className="text-sm text-white/70 hover:text-white">Start a similar project →</Link>
      </div>
    </article>
  );
}

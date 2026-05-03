import Link from "next/link";
import { notFound } from "next/navigation";
import { SanityImage } from "@/components/sanity-image";
import { CaseStudy } from "@/components/case-study";
import { getAllProjects, getProjectBySlug } from "@/lib/content";
import type { PortableTextBlock } from "@portabletext/react";

export const revalidate = 60;

export async function generateStaticParams() {
  const all = await getAllProjects();
  return all.map((p) => ({ slug: p.slug }));
}

export default async function CaseStudyDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = (await getProjectBySlug(slug)) as
    | (Awaited<ReturnType<typeof getProjectBySlug>> & {
        title: string;
        year: number;
        location: string;
        sector: string;
        image: string;
        summary?: string;
        body?: PortableTextBlock[];
      })
    | null;
  if (!p) notFound();

  return (
    <article className="container-page py-12 md:py-20">
      <Link href="/case-studies" className="text-xs uppercase tracking-[0.3em] text-white/50 hover:text-white">
        ← Case studies
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            {p.sector} · {p.year} · {p.location}
          </p>
          <h1 className="mt-3 font-display text-3xl sm:text-4xl md:text-6xl">{p.title}</h1>
          {p.summary && <p className="mt-4 text-lg leading-relaxed text-white/80">{p.summary}</p>}
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
          <SanityImage src={p.image} alt={p.title} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
        </div>
      </div>

      <CaseStudy body={p.body} />

      <div className="mt-12 flex justify-between border-t border-white/10 pt-8 text-sm text-white/70">
        <Link href={`/projects/${p.slug}`} className="hover:text-white">
          See the project →
        </Link>
        <Link href="/contact" className="hover:text-white">
          Start a similar project →
        </Link>
      </div>
    </article>
  );
}

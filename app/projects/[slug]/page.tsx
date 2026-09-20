import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LiteYouTube } from "@/components/lite-youtube";
import { LightboxGrid } from "@/components/lightbox-grid";
import { SanityImage } from "@/components/sanity-image";
import { CaseStudy } from "@/components/case-study";
import { JsonLd } from "@/components/json-ld";
import { getAllProjects, getProjectBySlug } from "@/lib/content";
import { SITE, absoluteUrl, ogImage, metaDescription } from "@/lib/seo";
import { sanitySized } from "@/lib/image";
import type { PortableTextBlock } from "@portabletext/react";

export const revalidate = 60;

export async function generateStaticParams() {
  const all = await getAllProjects();
  return all.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getProjectBySlug(slug)) as
    | {
        title: string;
        sector?: string;
        location?: string;
        year?: number;
        summary?: string;
        metaDescription?: string;
        image?: string;
      }
    | null;
  if (!p) return { title: "Project not found" };

  const title = `${p.title}${p.sector ? ` — ${p.sector} LED lighting` : ""}`;
  const bits = [p.sector, p.location, p.year].filter(Boolean).join(" · ");
  const description = metaDescription(
    p.metaDescription || p.summary || `${p.title}: ${bits} LED lighting project by ${SITE.name}.`,
  );
  const og = ogImage(p.image);
  const url = `/projects/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      ...(og ? { images: [{ url: og, width: 1200, height: 630, alt: p.title }] } : {}),
    },
    twitter: { card: "summary_large_image", title, description, ...(og ? { images: [og] } : {}) },
  };
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

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "Projects", item: absoluteUrl("/projects") },
      { "@type": "ListItem", position: 3, name: p.title, item: absoluteUrl(`/projects/${slug}`) },
    ],
  };
  const projectLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.title,
    ...(p.summary ? { description: p.summary } : {}),
    ...(p.image ? { image: ogImage(p.image) } : {}),
    ...(p.location ? { locationCreated: { "@type": "Place", name: p.location } } : {}),
    ...(p.year ? { dateCreated: String(p.year) } : {}),
    creator: { "@type": "Organization", name: SITE.name, url: SITE.url },
  };

  return (
    <article>
      <JsonLd data={[breadcrumbLd, projectLd]} />
      <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        {p.headerVideo ? (
          <video
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            src={p.headerVideo}
            poster={sanitySized(p.image, 1600)}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden
          />
        ) : (
          <SanityImage
            src={p.image}
            alt={`${p.title} — ${p.sector} LED lighting installation in ${p.location}`}
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

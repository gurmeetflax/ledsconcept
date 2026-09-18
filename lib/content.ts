import { queries, sanityFetch } from "./sanity";
import {
  sampleProductCategories,
  sampleProducts,
  sampleProjects,
  sampleSectors,
  sampleSiteSettings,
  type Product,
  type Project,
  type Sector,
  type SiteSettings,
} from "./sample-data";

const hasSanity = !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

// Pass URLs through untouched. Width/quality negotiation is handled by
// next/image + the SanityImage wrapper (which appends auto=format&fit=max).
function img(url: string | undefined | null): string {
  return url ?? "";
}

function optimizeProject<T extends { image?: string; gallery?: string[] }>(p: T): T {
  return {
    ...p,
    image: img(p.image),
    gallery: p.gallery?.map((g) => img(g)),
  };
}

// When Sanity is configured we trust it — an empty result means the editor
// simply hasn't added that content yet, so we return an empty list rather than
// injecting placeholder sample content into a live site. Sample data is only a
// convenience for local dev before Sanity is connected.
export async function getSectors(): Promise<Sector[]> {
  if (!hasSanity) return sampleSectors;
  const data = await sanityFetch<Sector[]>(queries.sectors);
  return (data ?? []).map((s) => ({ ...s, image: img(s.image) }));
}

export async function getFeaturedProjects(): Promise<Project[]> {
  if (!hasSanity) return sampleProjects.slice(0, 6);
  const data = await sanityFetch<Project[]>(queries.featuredProjects);
  return (data ?? []).map((p) => optimizeProject(p));
}

export async function getAllProjects(): Promise<Project[]> {
  if (!hasSanity) return sampleProjects;
  const data = await sanityFetch<Project[]>(queries.allProjects);
  return (data ?? []).map((p) => optimizeProject(p));
}

export async function getProjectBySlug(slug: string) {
  if (!hasSanity) {
    const p = sampleProjects.find((x) => x.slug === slug);
    return p
      ? {
          ...p,
          summary: "Sample project summary. Replace with Sanity content.",
          gearUsed: ["Pixel Tube 360 ×120", "DMX Node 4U", "Madrix Ultimate"],
          video: "ScMzIvxBSi4",
          gallery: [p.image, p.image, p.image],
        }
      : null;
  }
  const p = await sanityFetch<{ image?: string; gallery?: string[] } | null>(
    queries.projectBySlug,
    { slug },
  );
  if (!p) return null;
  return optimizeProject(p);
}

export async function getProducts(): Promise<Product[]> {
  if (!hasSanity) return sampleProducts;
  const data = await sanityFetch<Product[]>(queries.products);
  return (data ?? []).map((p) => ({ ...p, image: img(p.image) }));
}

export async function getProductCategories() {
  if (!hasSanity) return sampleProductCategories;
  const data = await sanityFetch<typeof sampleProductCategories>(queries.productCategories);
  return data ?? [];
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!hasSanity) return sampleSiteSettings;
  const data = await sanityFetch<SiteSettings | null>(queries.siteSettings);
  return data ?? sampleSiteSettings;
}

export { img };

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

export async function getSectors(): Promise<Sector[]> {
  if (!hasSanity) return sampleSectors;
  const data = await sanityFetch<Sector[]>(queries.sectors);
  return data?.length ? data : sampleSectors;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  if (!hasSanity) return sampleProjects.slice(0, 6);
  const data = await sanityFetch<Project[]>(queries.featuredProjects);
  return data?.length ? data : sampleProjects.slice(0, 6);
}

export async function getAllProjects(): Promise<Project[]> {
  if (!hasSanity) return sampleProjects;
  const data = await sanityFetch<Project[]>(queries.allProjects);
  return data?.length ? data : sampleProjects;
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
  return sanityFetch(queries.projectBySlug, { slug });
}

export async function getProducts(): Promise<Product[]> {
  if (!hasSanity) return sampleProducts;
  const data = await sanityFetch<Product[]>(queries.products);
  return data?.length ? data : sampleProducts;
}

export async function getProductCategories() {
  if (!hasSanity) return sampleProductCategories;
  const data = await sanityFetch<typeof sampleProductCategories>(queries.productCategories);
  return data?.length ? data : sampleProductCategories;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!hasSanity) return sampleSiteSettings;
  const data = await sanityFetch<SiteSettings | null>(queries.siteSettings);
  return data ?? sampleSiteSettings;
}

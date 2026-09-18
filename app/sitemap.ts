import type { MetadataRoute } from "next";
import { getAllProjects, getProducts } from "@/lib/content";
import { SITE } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url;
  const now = new Date();
  const [projects, products] = await Promise.all([getAllProjects(), getProducts()]);

  // Home first (highest priority), then key sections, then detail pages.
  const staticPaths: { path: string; priority: number }[] = [
    { path: "", priority: 1 },
    { path: "/projects", priority: 0.9 },
    { path: "/products", priority: 0.8 },
    { path: "/about", priority: 0.6 },
    { path: "/gallery", priority: 0.6 },
    { path: "/contact", priority: 0.7 },
  ];

  return [
    ...staticPaths.map(({ path, priority }) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority,
    })),
    ...projects.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...products.map((p) => ({
      url: `${base}/products/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}

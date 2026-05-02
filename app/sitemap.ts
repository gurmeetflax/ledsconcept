import type { MetadataRoute } from "next";
import { getAllProjects, getProducts } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.ledsconcept.com";
  const [projects, products] = await Promise.all([getAllProjects(), getProducts()]);
  const staticPaths = ["", "/about", "/projects", "/products", "/gallery", "/contact"];
  return [
    ...staticPaths.map((p) => ({ url: `${base}${p}`, changeFrequency: "weekly" as const })),
    ...projects.map((p) => ({ url: `${base}/projects/${p.slug}`, changeFrequency: "monthly" as const })),
    ...products.map((p) => ({ url: `${base}/products/${p.slug}`, changeFrequency: "monthly" as const })),
  ];
}

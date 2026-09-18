import { Hero } from "@/components/sections/hero";
import { SectorGrid } from "@/components/sections/sector-grid";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { ProductsStrip } from "@/components/sections/products-strip";
import { ReelsSection } from "@/components/sections/reels-section";
import { MadrixStrip } from "@/components/sections/madrix-strip";
import { CTA } from "@/components/sections/cta";
import type { Metadata } from "next";
import { getFeaturedProjects, getProducts, getSectors, getSiteSettings } from "@/lib/content";
import { SITE } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = {
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: { url: SITE.url, title: `${SITE.name} — ${SITE.tagline}`, description: SITE.description },
};

export default async function HomePage() {
  const [sectors, projects, products, settings] = await Promise.all([
    getSectors(),
    getFeaturedProjects(),
    getProducts(),
    getSiteSettings(),
  ]);

  return (
    <>
      <Hero youtubeId={settings.youtubeHeroId} videoUrl={settings.heroVideo} />
      <SectorGrid sectors={sectors} />
      <FeaturedProjects projects={projects} />
      <ReelsSection feedId={settings.beholdFeedId || "awDA3WLI489BQxzHqzAX"} />
      <ProductsStrip products={products} />
      <MadrixStrip />
      <CTA />
    </>
  );
}

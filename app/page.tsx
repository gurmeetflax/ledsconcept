import { Hero } from "@/components/sections/hero";
import { SectorGrid } from "@/components/sections/sector-grid";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { ProductsStrip } from "@/components/sections/products-strip";
import { YouTubeReel } from "@/components/sections/youtube-reel";
import { ReelsSection } from "@/components/sections/reels-section";
import { InstagramSection } from "@/components/sections/instagram-section";
import { MadrixStrip } from "@/components/sections/madrix-strip";
import { CTA } from "@/components/sections/cta";
import { getFeaturedProjects, getProducts, getSectors, getSiteSettings } from "@/lib/content";

export const revalidate = 60;

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
      <ProductsStrip products={products} />
      <YouTubeReel videoId={settings.youtubeHeroId || "ScMzIvxBSi4"} />
      <ReelsSection feedId={settings.beholdFeedId} />
      <InstagramSection widgetId={settings.instagramWidgetId} />
      <MadrixStrip />
      <CTA />
    </>
  );
}

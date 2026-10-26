import { Hero } from "@/components/sections/hero";
import { SectorGrid } from "@/components/sections/sector-grid";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { ProductsStrip } from "@/components/sections/products-strip";
import { ReelsSection } from "@/components/sections/reels-section";
import { MadrixStrip } from "@/components/sections/madrix-strip";
import { CTA } from "@/components/sections/cta";
import type { Metadata } from "next";
import { getFeaturedProjects, getProducts, getSectors, getSiteSettings } from "@/lib/content";
import { SITE, BUSINESS } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const revalidate = 60;

const HOME_TITLE = "Leds Concept Lighting | Pixel-mapped LED lighting for clubs, bars & lounges";
const HOME_DESCRIPTION =
  "Leds Concept Lighting designs, supplies & installs pixel-mapped LED lighting for clubs, bars & lounges across India. Madrix-licensed. WhatsApp +91 96396 33366.";

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { url: SITE.url, siteName: BUSINESS.legalName, title: HOME_TITLE, description: HOME_DESCRIPTION },
  twitter: { title: HOME_TITLE, description: HOME_DESCRIPTION },
};

export default async function HomePage() {
  const [sectors, projects, products, settings] = await Promise.all([
    getSectors(),
    getFeaturedProjects(),
    getProducts(),
    getSiteSettings(),
  ]);

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Leds Concept Lighting",
    alternateName: "Leds Concept",
    url: "https://ledsconcept.com",
    logo: "https://ledsconcept.com/icon.svg",
    telephone: "+91-96396-33366",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-96396-33366",
      contactType: "sales",
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
    ...(settings.instagram ? { sameAs: [settings.instagram] } : {}),
  };

  return (
    <>
      <JsonLd data={organizationLd} />
      <Hero youtubeId={settings.youtubeHeroId} videoUrl={settings.heroVideo} />
      {sectors.length > 0 && <SectorGrid sectors={sectors} />}
      {projects.length > 0 && <FeaturedProjects projects={projects} />}
      <ReelsSection feedId={settings.beholdFeedId || "awDA3WLI489BQxzHqzAX"} />
      {products.length > 0 && <ProductsStrip products={products} />}
      <MadrixStrip />
      <CTA />
    </>
  );
}

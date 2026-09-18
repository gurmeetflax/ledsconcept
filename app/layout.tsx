import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { JsonLd } from "@/components/json-ld";
import { getSiteSettings } from "@/lib/content";
import { SITE, absoluteUrl, ogImage } from "@/lib/seo";

const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const description = settings.metaDescription?.trim() || SITE.description;
  const keywords = settings.keywords?.length ? settings.keywords : SITE.keywords;
  const title = `${SITE.name} — ${settings.tagline || SITE.tagline}`;
  // A custom OG image from Sanity overrides the auto-generated card.
  const images = settings.ogImage ? [{ url: ogImage(settings.ogImage)!, width: 1200, height: 630 }] : undefined;

  return {
    metadataBase: new URL(SITE.url),
    title: { default: title, template: `%s · ${SITE.name}` },
    description,
    keywords: [...keywords],
    applicationName: SITE.name,
    alternates: { canonical: "/" },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    openGraph: {
      type: "website",
      url: SITE.url,
      siteName: SITE.name,
      locale: SITE.locale,
      title,
      description,
      ...(images ? { images } : {}),
    },
    twitter: { card: "summary_large_image", title, description, ...(images ? { images: images.map((i) => i.url) } : {}) },
  };
}

function organizationLd(settings: Awaited<ReturnType<typeof getSiteSettings>>) {
  const sameAs = [settings.instagram, settings.youtube, settings.facebook, settings.twitter].filter(
    Boolean,
  ) as string[];
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE.url}/#business`,
    name: SITE.name,
    url: SITE.url,
    image: settings.ogImage ? ogImage(settings.ogImage) : absoluteUrl("/opengraph-image"),
    description: settings.metaDescription?.trim() || SITE.description,
    slogan: settings.tagline || SITE.tagline,
    ...(settings.email ? { email: settings.email } : {}),
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(settings.address
      ? { address: { "@type": "PostalAddress", streetAddress: settings.address, addressCountry: "IN" } }
      : { areaServed: "IN" }),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <JsonLd data={organizationLd(settings)} />
        <SiteNav />
        <main>{children}</main>
        <SiteFooter settings={settings} />
        <WhatsAppButton
          number={settings.whatsapp || settings.phone}
          message={settings.whatsappMessage}
        />
      </body>
    </html>
  );
}

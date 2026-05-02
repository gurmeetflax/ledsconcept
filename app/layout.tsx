import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { getSiteSettings } from "@/lib/content";

const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ledsconcept.com"),
  title: { default: "LEDs Concept — The world of pixels is limitless", template: "%s · LEDs Concept" },
  description:
    "Architectural, event and nightclub LED lighting solutions. Madrix licensed associates designing and installing pixel-mapped experiences.",
  openGraph: {
    type: "website",
    siteName: "LEDs Concept",
    title: "LEDs Concept",
    description: "The world of pixels is limitless.",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <SiteNav />
        <main>{children}</main>
        <SiteFooter settings={settings} />
      </body>
    </html>
  );
}

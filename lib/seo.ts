// Central SEO configuration and helpers.
// Keeps titles, descriptions, canonical URLs and structured data consistent
// across every route.

export const SITE = {
  name: "LEDs Concept",
  url: "https://www.ledsconcept.com",
  // Default tagline mirrors the Sanity `siteSettings.tagline`.
  tagline: "The world of lights is limitless",
  description:
    "Architectural, event and nightclub LED lighting. Madrix-licensed associates designing, installing and controlling pixel-mapped light experiences across India.",
  keywords: [
    "LED lighting",
    "pixel mapping",
    "Madrix",
    "nightclub lighting",
    "architectural lighting",
    "home theatre lighting",
    "DMX",
    "stage lighting India",
  ],
  locale: "en_IN",
} as const;

/** Resolve a path (or already-absolute URL) to an absolute site URL. */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE.url}${path.startsWith("/") ? "" : "/"}${path}`;
}

/**
 * Turn a Sanity image URL into a 1200×630 social-share crop.
 * Non-Sanity URLs are returned unchanged.
 */
export function ogImage(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (!url.includes("cdn.sanity.io")) return url;
  const [base, query = ""] = url.split("?");
  const params = new URLSearchParams(query);
  params.set("w", "1200");
  params.set("h", "630");
  params.set("fit", "crop");
  params.set("auto", "format");
  return `${base}?${params.toString()}`;
}

/** Clamp a description to a search-friendly length without cutting mid-word. */
export function metaDescription(text?: string | null, fallback = SITE.description): string {
  const s = (text || "").trim();
  if (!s) return fallback;
  if (s.length <= 160) return s;
  return s.slice(0, 157).replace(/\s+\S*$/, "") + "…";
}

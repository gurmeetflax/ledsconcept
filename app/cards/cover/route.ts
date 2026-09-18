import { ImageResponse } from "next/og";
import { getFeaturedProjects, getSectors, getSiteSettings } from "@/lib/content";
import { CoverCard, CARD_W, CARD_H } from "@/lib/card-og";

export const runtime = "nodejs";
export const revalidate = 3600;

function sectorLine(names: string[]): string {
  const list = (names.length ? names : ["nightclubs"]).map((n) => n.toLowerCase());
  if (list.length === 1) return list[0];
  return `${list.slice(0, -1).join(", ")} & ${list[list.length - 1]}`;
}

export async function GET() {
  const [projects, sectors, settings] = await Promise.all([
    getFeaturedProjects(),
    getSectors(),
    getSiteSettings(),
  ]);

  const tagline = (settings.tagline || "The world of lights is limitless").replace(/\.\s*$/, "");

  return new ImageResponse(
    CoverCard({
      projects: projects.map((p) => ({ title: p.title, sector: p.sector, location: p.location })),
      tagline,
      website: "www.ledsconcept.com",
      email: settings.email,
      sectorLine: sectorLine(sectors.map((s) => s.name)),
    }),
    {
      width: CARD_W,
      height: CARD_H,
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400" },
    },
  );
}

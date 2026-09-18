import { ImageResponse } from "next/og";
import { getAllProjects, getSiteSettings } from "@/lib/content";
import { ProjectCard, heroPortrait, CARD_W, CARD_H } from "@/lib/card-og";

export const runtime = "nodejs";
export const revalidate = 3600;

// Fetch the hero photo ourselves and inline it as a data URL. This keeps the
// card resilient — if the image host is unreachable we render the neon
// fallback background instead of failing the whole image.
async function loadPhoto(url?: string): Promise<string | undefined> {
  const src = heroPortrait(url);
  if (!src) return undefined;
  try {
    const res = await fetch(src, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return undefined;
    const type = res.headers.get("content-type") || "image/jpeg";
    if (!type.startsWith("image/")) return undefined;
    const b64 = Buffer.from(await res.arrayBuffer()).toString("base64");
    return `data:${type};base64,${b64}`;
  } catch {
    return undefined;
  }
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [projects, settings] = await Promise.all([getAllProjects(), getSiteSettings()]);
  const project = projects.find((p) => p.slug === slug);
  if (!project) return new Response("Card not found", { status: 404 });

  const tagline = (settings.tagline || "The world of lights is limitless").replace(/\.\s*$/, "");
  const photoSrc = await loadPhoto(project.image);

  return new ImageResponse(
    ProjectCard({
      project: {
        title: project.title,
        sector: project.sector,
        location: project.location,
        year: project.year,
        image: project.image,
      },
      photoSrc,
      tagline,
      website: "www.ledsconcept.com",
    }),
    {
      width: CARD_W,
      height: CARD_H,
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400" },
    },
  );
}

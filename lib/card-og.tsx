import type { ReactElement } from "react";

// Shared 1080×1350 WhatsApp-card layouts, rendered on the server with next/og
// (Satori). Kept in one place so the per-project route and the cover route
// stay visually identical to the offline generator in scripts/whatsapp-cards.mjs.

export const CARD_W = 1080;
export const CARD_H = 1350;

const MAGENTA = "#ff2bd6";
const CYAN = "#22e2ff";
const INK = "#0a0a0a";
const GRAD = `linear-gradient(90deg,${MAGENTA},${CYAN})`;
const gradText = { backgroundImage: GRAD, backgroundClip: "text", color: "transparent" } as const;

/** Portrait crop of a Sanity image sized for the card hero. */
export function heroPortrait(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (!url.includes("cdn.sanity.io")) return url;
  const [base, query = ""] = url.split("?");
  const params = new URLSearchParams(query);
  params.set("w", String(CARD_W));
  params.set("h", String(CARD_H));
  params.set("fit", "crop");
  // Force JPEG — the OG renderer (Satori/resvg) can't decode webp/avif.
  params.set("fm", "jpg");
  params.set("q", "80");
  return `${base}?${params.toString()}`;
}

function wordmark(size = 34): ReactElement {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: size, fontWeight: 700 }}>
      <div style={{ width: size * 0.7, height: size * 0.7, borderRadius: 6, backgroundImage: GRAD }} />
      <div style={{ display: "flex", gap: 10 }}>
        <span style={gradText}>LEDs</span>
        <span>Concept</span>
      </div>
    </div>
  );
}

function scrim(from = 0.15): ReactElement {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: CARD_W,
        height: CARD_H,
        display: "flex",
        backgroundImage: `linear-gradient(to bottom, rgba(10,10,10,${from}), rgba(10,10,10,0.55) 55%, rgba(10,10,10,0.97))`,
      }}
    />
  );
}

export type CardProject = {
  title: string;
  sector?: string;
  location?: string;
  year?: number;
  image?: string;
};

export function ProjectCard({
  project,
  photoSrc,
  tagline,
  website,
}: {
  project: CardProject;
  photoSrc?: string;
  tagline: string;
  website: string;
}): ReactElement {
  const meta = [project.location, project.year].filter(Boolean).join("  ·  ");
  return (
    <div
      style={{
        position: "relative",
        width: CARD_W,
        height: CARD_H,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#070707",
        // Neon fallback shown when there is no photo (or it failed to load).
        backgroundImage:
          "linear-gradient(135deg, rgba(255,43,214,0.42), rgba(255,43,214,0) 46%)," +
          "linear-gradient(315deg, rgba(34,226,255,0.38), rgba(34,226,255,0) 46%)",
        color: "#fafafa",
        fontFamily: "sans-serif",
      }}
    >
      {photoSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photoSrc} width={CARD_W} height={CARD_H} alt="" style={{ position: "absolute", top: 0, left: 0 }} />
      ) : null}
      {scrim()}
      <div style={{ position: "absolute", top: 0, left: 0, width: CARD_W, height: 8, display: "flex", backgroundImage: GRAD }} />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: CARD_W,
          height: CARD_H,
          padding: 64,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {wordmark(34)}
          <div
            style={{
              display: "flex",
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: 3,
              padding: "10px 18px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.16)",
              backgroundColor: "rgba(255,255,255,0.08)",
            }}
          >
            PROJECT SPOTLIGHT
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {project.sector ? (
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                fontSize: 20,
                fontWeight: 600,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: CYAN,
                border: `1px solid rgba(34,226,255,0.5)`,
                backgroundColor: "rgba(34,226,255,0.08)",
                padding: "8px 18px",
                borderRadius: 999,
                marginBottom: 24,
              }}
            >
              {project.sector}
            </div>
          ) : null}
          <div style={{ display: "flex", fontSize: 104, fontWeight: 700, lineHeight: 1, letterSpacing: -2 }}>
            {project.title}
          </div>
          {meta ? (
            <div style={{ display: "flex", marginTop: 26, fontSize: 30, color: "rgba(255,255,255,0.85)" }}>{meta}</div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.14)",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 22, fontWeight: 600 }}>{tagline}</div>
            <div style={{ display: "flex", fontSize: 18, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>{website}</div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              fontWeight: 600,
              color: INK,
              backgroundImage: GRAD,
              padding: "14px 24px",
              borderRadius: 999,
            }}
          >
            Message us ›
          </div>
        </div>
      </div>
    </div>
  );
}

export function CoverCard({
  projects,
  tagline,
  website,
  email,
  sectorLine,
}: {
  projects: CardProject[];
  tagline: string;
  website: string;
  email?: string;
  sectorLine: string;
}): ReactElement {
  return (
    <div
      style={{
        position: "relative",
        width: CARD_W,
        height: CARD_H,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 64,
        backgroundColor: "#070707",
        backgroundImage:
          "linear-gradient(135deg, rgba(255,43,214,0.42), rgba(255,43,214,0) 46%)," +
          "linear-gradient(315deg, rgba(34,226,255,0.38), rgba(34,226,255,0) 46%)",
        color: "#fafafa",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, width: CARD_W, height: 8, display: "flex", backgroundImage: GRAD }} />
      {wordmark(40)}

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", fontSize: 18, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: CYAN }}>
          Featured Work
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", marginTop: 16, fontSize: 92, fontWeight: 700, lineHeight: 1, letterSpacing: -2 }}>
          <span>Pixel-mapped</span>
          <span style={{ ...gradText, marginLeft: 20 }}>LED experiences</span>
        </div>
        <div style={{ display: "flex", marginTop: 22, fontSize: 27, color: "rgba(255,255,255,0.78)", maxWidth: 860 }}>
          Pixel-mapped lighting for {sectorLine} — designed and installed by Madrix-licensed associates.
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {projects.slice(0, 6).map((p, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 0",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", fontSize: 34, fontWeight: 600 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, backgroundImage: GRAD, marginRight: 16, display: "flex" }} />
              {p.title}
            </div>
            <div style={{ display: "flex", fontSize: 20, color: "rgba(255,255,255,0.55)" }}>
              {[p.sector, p.location].filter(Boolean).join(" · ")}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 22, fontWeight: 600 }}>{tagline}</div>
          <div style={{ display: "flex", fontSize: 18, color: "rgba(255,255,255,0.55)", marginTop: 4 }}>
            {website}
            {email ? ` · ${email}` : ""}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 20, fontWeight: 600, color: INK, backgroundImage: GRAD, padding: "14px 24px", borderRadius: 999 }}>
          Get a quote ›
        </div>
      </div>
    </div>
  );
}

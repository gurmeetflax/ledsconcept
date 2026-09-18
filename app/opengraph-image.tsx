import { ImageResponse } from "next/og";
import { SITE } from "@/lib/seo";

// Default social share card for every route that doesn't set its own.
export const runtime = "nodejs";
export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const grad = "linear-gradient(90deg,#ff2bd6,#22e2ff)";
const gradText = { backgroundImage: grad, backgroundClip: "text", color: "transparent" } as const;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#070707",
          backgroundImage:
            "linear-gradient(135deg, rgba(255,43,214,0.42), rgba(255,43,214,0) 46%)," +
            "linear-gradient(315deg, rgba(34,226,255,0.38), rgba(34,226,255,0) 46%)",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 40, fontWeight: 700 }}>
          <div style={{ width: 26, height: 26, borderRadius: 6, backgroundImage: grad }} />
          <div style={{ display: "flex", gap: 14 }}>
            <span style={gradText}>LEDs</span>
            <span>Concept</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", flexWrap: "wrap", fontSize: 84, fontWeight: 700, lineHeight: 1.02, letterSpacing: -2 }}>
            <span>The world of</span>
            <span style={{ ...gradText, margin: "0 24px" }}>lights</span>
            <span>is limitless</span>
          </div>
          <div style={{ fontSize: 30, color: "rgba(255,255,255,0.72)", maxWidth: 900 }}>
            Pixel-mapped LED for nightclubs, architecture & home theatres — Madrix-licensed.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "rgba(255,255,255,0.6)" }}>
          <span>www.ledsconcept.com</span>
          <span>Madrix Licensed Associates</span>
        </div>
      </div>
    ),
    size,
  );
}

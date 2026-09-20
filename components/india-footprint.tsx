"use client";

import { useMemo, useState } from "react";
import { INDIA_OUTLINE, type FootprintCity } from "@/lib/footprint";

const K = Math.cos((22 * Math.PI) / 180);
const SCALE = 19;
const PAD = 34;

export function IndiaFootprint({ cities }: { cities: FootprintCity[] }) {
  const [active, setActive] = useState<string | null>(null);

  const geo = useMemo(() => {
    const proj = (lon: number, lat: number): [number, number] => [lon * K, -lat];
    const all: [number, number][] = [
      ...INDIA_OUTLINE,
      ...cities.map((c) => [c.lon, c.lat] as [number, number]),
    ];
    const P = all.map(([lo, la]) => proj(lo, la));
    const minX = Math.min(...P.map((p) => p[0]));
    const minY = Math.min(...P.map((p) => p[1]));
    const maxX = Math.max(...P.map((p) => p[0]));
    const maxY = Math.max(...P.map((p) => p[1]));
    const toXY = (lon: number, lat: number): [number, number] => {
      const [x, y] = proj(lon, lat);
      return [(x - minX) * SCALE + PAD, (y - minY) * SCALE + PAD];
    };
    const W = (maxX - minX) * SCALE + PAD * 2;
    const H = (maxY - minY) * SCALE + PAD * 2;
    const d =
      "M" +
      INDIA_OUTLINE.map(([lo, la], i) => {
        const [x, y] = toXY(lo, la);
        return `${i ? "L" : ""}${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(" ") +
      "Z";
    const grat: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let lat = 10; lat <= 35; lat += 5) {
      const a = toXY(67, lat);
      const b = toXY(98, lat);
      grat.push({ x1: a[0], y1: a[1], x2: b[0], y2: b[1] });
    }
    for (let lon = 70; lon <= 95; lon += 5) {
      const a = toXY(lon, 7);
      const b = toXY(lon, 36);
      grat.push({ x1: a[0], y1: a[1], x2: b[0], y2: b[1] });
    }
    const pins = cities.map((c) => {
      const [x, y] = toXY(c.lon, c.lat);
      const n = c.projects.length;
      return { ...c, x, y, r: 6 + n * 2, n };
    });
    return { d, grat, pins, W, H };
  }, [cities]);

  const sorted = useMemo(() => [...cities].sort((a, b) => b.lat - a.lat), [cities]);
  const documented = cities.filter((c) => c.projects.length).length;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_.9fr]">
      <style>{`
        @keyframes fp-pulse{0%{transform:scale(.5);opacity:.7}70%{transform:scale(1.85);opacity:0}100%{opacity:0}}
        .fp-ring{transform-box:fill-box;transform-origin:center;animation:fp-pulse 2.8s ease-out infinite}
        @media (prefers-reduced-motion:reduce){.fp-ring{animation:none;opacity:.28}}
        .fp-dot{transition:transform .18s;transform-box:fill-box;transform-origin:center}
      `}</style>

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-3">
        <svg
          viewBox={`0 0 ${geo.W} ${geo.H}`}
          role="img"
          aria-label="Map of India showing LEDs Concept project cities"
          className="block w-full"
          style={{ overflow: "visible" }}
        >
          <defs>
            <linearGradient id="fpLand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="rgba(255,255,255,.07)" />
              <stop offset="1" stopColor="rgba(255,255,255,.015)" />
            </linearGradient>
            <linearGradient id="fpEdge" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ff2bd6" />
              <stop offset="1" stopColor="#22e2ff" />
            </linearGradient>
            <radialGradient id="fpPin" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#ff2bd6" />
              <stop offset="1" stopColor="#22e2ff" />
            </radialGradient>
          </defs>

          {geo.grat.map((g, i) => (
            <line key={i} {...g} stroke="rgba(255,255,255,.05)" strokeWidth={0.6} />
          ))}
          <path
            d={geo.d}
            fill="url(#fpLand)"
            stroke="url(#fpEdge)"
            strokeWidth={1.4}
            style={{ filter: "drop-shadow(0 0 22px rgba(34,226,255,.20))" }}
          />

          {geo.pins.map((p) => {
            const on = active === p.city;
            return (
              <g
                key={p.city}
                onMouseEnter={() => setActive(p.city)}
                onMouseLeave={() => setActive(null)}
                style={{ cursor: "pointer" }}
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={p.r + 9}
                  fill="url(#fpPin)"
                  opacity={on ? 0.9 : 0.28}
                  style={{ filter: "blur(6px)", transition: "opacity .2s" }}
                />
                <circle cx={p.x} cy={p.y} r={p.r + 3} className="fp-ring" fill="none" stroke="#22e2ff" strokeWidth={1.3} opacity={0.55} />
                <circle cx={p.x} cy={p.y} r={p.r} className="fp-dot" fill="url(#fpPin)" stroke="#0a0a0a" strokeWidth={1.4} style={{ transform: on ? "scale(1.2)" : "scale(1)" }} />
                <text
                  x={p.x + p.dx}
                  y={p.y + p.dy + 4}
                  textAnchor={p.anchor}
                  fontSize={on ? 15 : 13.5}
                  fontWeight={700}
                  fill={on ? "#fff" : "#f4f4f6"}
                  opacity={on ? 1 : 0.92}
                  style={{ paintOrder: "stroke", stroke: "rgba(0,0,0,.6)", strokeWidth: 3 }}
                >
                  {p.city}
                </text>
                <circle cx={p.x} cy={p.y} r={p.r + 13} fill="transparent" />
              </g>
            );
          })}
        </svg>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02]">
        <div className="flex items-baseline justify-between px-5 pt-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">Project cities</h2>
          <span className="text-xs text-white/40">
            {cities.length} cities · {documented} documented
          </span>
        </div>
        <div className="mt-2">
          {sorted.map((c) => {
            const on = active === c.city;
            const has = c.projects.length > 0;
            return (
              <button
                key={c.city}
                type="button"
                onMouseEnter={() => setActive(c.city)}
                onMouseLeave={() => setActive(null)}
                className={`flex w-full items-start gap-3 border-t border-white/10 px-5 py-3 text-left transition ${
                  on ? "bg-cyan-400/[0.06]" : "hover:bg-white/[0.03]"
                }`}
              >
                <span
                  className={`mt-1.5 size-2.5 flex-none rounded-full ${
                    has ? "bg-neon-grad shadow-[0_0_10px_rgba(255,43,214,.7)]" : "border border-neon-cyan bg-white/20"
                  }`}
                />
                <span className="min-w-0">
                  <span className="flex items-baseline gap-2 font-display text-[15px] font-semibold">
                    {c.city}
                    {c.projects.length > 1 && (
                      <span className="rounded-full bg-neon-cyan px-1.5 text-[10px] font-bold text-ink">
                        {c.projects.length}
                      </span>
                    )}
                  </span>
                  <span className={`mt-0.5 block text-[13px] ${has ? "text-white/55" : "italic text-white/40"}`}>
                    {has ? c.projects.map((p) => (p.year ? `${p.title} (${p.year})` : p.title)).join(", ") : "Project location"}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

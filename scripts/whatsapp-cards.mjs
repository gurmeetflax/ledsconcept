// WhatsApp forward card generator for LEDs Concept.
//
// Renders branded, share-ready PNGs (1080×1350 portrait) for the featured
// projects plus a brand cover card, using the pre-installed Chromium.
//
//   node scripts/whatsapp-cards.mjs
//
// Project data is read from lib/sample-data.ts so the cards stay in sync with
// the site's fallback content. Once Sanity is live you can point this at the
// real project images by swapping in reachable image URLs — each card embeds
// the photo when its URL is fetchable and falls back to an on-brand neon
// pixel-grid background otherwise.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

// Resolve Playwright whether it's a local dep or installed globally.
const require = createRequire(import.meta.url);
async function loadPlaywright() {
  const candidates = [];
  try {
    candidates.push(require.resolve("playwright"));
  } catch {}
  try {
    const g = execSync("npm root -g", { encoding: "utf8" }).trim();
    candidates.push(path.join(g, "playwright", "index.js"));
  } catch {}
  for (const c of candidates) {
    // Prefer the ESM entry so named exports (chromium) resolve correctly.
    const variants = [c.replace(/index\.js$/, "index.mjs"), c];
    for (const v of variants) {
      try {
        const mod = await import(pathToFileURL(v).href);
        const chromium = mod.chromium || mod.default?.chromium;
        if (chromium) return { chromium };
      } catch {}
    }
  }
  throw new Error("Could not locate the 'playwright' package (local or global).");
}
const { chromium } = await loadPlaywright();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "marketing", "whatsapp");

// ---- Brand tokens (mirrors tailwind.config.ts / globals.css) ----------------
const BRAND = {
  ink: "#0a0a0a",
  paper: "#fafafa",
  magenta: "#ff2bd6",
  cyan: "#22e2ff",
  lime: "#c4ff3d",
  grad: "linear-gradient(90deg, #ff2bd6 0%, #22e2ff 100%)",
  tagline: "The world of pixels is limitless",
};
const W = 1080;
const H = 1350;

// ---- Load project data from lib/sample-data.ts ------------------------------
async function loadData() {
  const srcPath = path.join(root, "lib", "sample-data.ts");
  const raw = fs.readFileSync(srcPath, "utf8");
  // Strip the trailing `export type ...` lines so the file is plain JS.
  const js = raw
    .split("\n")
    .filter((l) => !l.trimStart().startsWith("export type"))
    .join("\n");
  const url = "data:text/javascript;base64," + Buffer.from(js).toString("base64");
  return import(url);
}

// ---- Best-effort image fetch → data URI -------------------------------------
async function fetchAsDataUri(url) {
  if (!url) return null;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) return null;
    const type = res.headers.get("content-type") || "image/jpeg";
    if (!type.startsWith("image/")) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return `data:${type};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

// Deterministic 0..1 from a string, for stable per-project accent hues.
function seed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

const fontFaces = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');
`;

const baseStyles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root { color-scheme: dark; }
  body {
    width: ${W}px; height: ${H}px; overflow: hidden;
    background: ${BRAND.ink}; color: ${BRAND.paper};
    font-family: 'Inter', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .card { position: relative; width: ${W}px; height: ${H}px; overflow: hidden; }
  .display { font-family: 'Space Grotesk', system-ui, sans-serif; }
  .neon-text {
    background: ${BRAND.grad};
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }
  .grad-bar { position: absolute; left: 0; right: 0; height: 8px; background: ${BRAND.grad}; }
  /* on-brand fallback: neon pixel grid + soft blobs */
  .pixel-bg {
    position: absolute; inset: 0;
    background-color: #070707;
    background-image:
      radial-gradient(120% 90% at 15% 8%, rgba(255,43,214,.30), transparent 55%),
      radial-gradient(110% 90% at 88% 30%, rgba(34,226,255,.28), transparent 55%),
      radial-gradient(90% 70% at 50% 108%, rgba(196,255,61,.10), transparent 60%),
      linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px);
    background-size: 100% 100%, 100% 100%, 100% 100%, 45px 45px, 45px 45px;
  }
  .pixel-scatter { position: absolute; inset: 0; opacity: .9; }
  .pixel-scatter i { position: absolute; width: 22px; height: 22px; border-radius: 4px; }
  .photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .scrim {
    position: absolute; inset: 0;
    background: linear-gradient(180deg,
      rgba(10,10,10,.15) 0%, rgba(10,10,10,.35) 42%,
      rgba(10,10,10,.82) 78%, rgba(10,10,10,.97) 100%);
  }
`;

function pixelScatter(s) {
  const colors = [BRAND.magenta, BRAND.cyan, BRAND.lime];
  const cells = [];
  let x = s;
  const rnd = () => (x = (x * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 26; i++) {
    const top = Math.round(rnd() * 100);
    const left = Math.round(rnd() * 100);
    const c = colors[Math.floor(rnd() * colors.length)];
    const op = (0.25 + rnd() * 0.5).toFixed(2);
    const sz = 10 + Math.round(rnd() * 20);
    cells.push(
      `<i style="top:${top}%;left:${left}%;width:${sz}px;height:${sz}px;background:${c};opacity:${op};box-shadow:0 0 18px ${c}"></i>`,
    );
  }
  return `<div class="pixel-scatter">${cells.join("")}</div>`;
}

function wordmark(size = 34) {
  return `<div class="display" style="font-size:${size}px;font-weight:700;letter-spacing:-.5px;line-height:1">
    <span class="neon-text">LEDs</span> Concept
  </div>`;
}

function projectCard({ project, photo }) {
  const s = seed(project.slug || project.title);
  const bg = photo
    ? `<img class="photo" src="${photo}" /><div class="scrim"></div>`
    : `<div class="pixel-bg"></div>${pixelScatter(s)}<div class="scrim"></div>`;
  return `<div class="card">
    ${bg}
    <div class="grad-bar" style="top:0"></div>

    <div style="position:absolute;top:52px;left:56px;right:56px;display:flex;align-items:center;justify-content:space-between">
      ${wordmark(34)}
      <div style="font-family:'Space Grotesk';font-size:15px;font-weight:600;letter-spacing:3px;
        color:#fff;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);
        padding:9px 16px;border-radius:999px">PROJECT SPOTLIGHT</div>
    </div>

    <div style="position:absolute;left:56px;right:56px;bottom:150px">
      <div style="display:inline-block;font-size:16px;font-weight:600;letter-spacing:2px;text-transform:uppercase;
        color:${BRAND.cyan};border:1px solid rgba(34,226,255,.5);padding:7px 15px;border-radius:999px;
        background:rgba(34,226,255,.08)">${project.sector}</div>

      <div class="display" style="margin-top:22px;font-size:88px;font-weight:700;line-height:.98;letter-spacing:-2px;
        text-wrap:balance;text-shadow:0 4px 40px rgba(0,0,0,.6)">${project.title}</div>

      <div style="margin-top:26px;display:flex;align-items:center;gap:16px;font-size:26px;color:rgba(255,255,255,.82)">
        <span style="display:inline-flex;align-items:center;gap:9px">
          <span style="width:9px;height:9px;border-radius:2px;background:${BRAND.magenta};box-shadow:0 0 10px ${BRAND.magenta}"></span>
          ${project.location}
        </span>
        <span style="width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.35)"></span>
        <span>${project.year}</span>
      </div>
    </div>

    <div style="position:absolute;left:56px;right:56px;bottom:52px;
      display:flex;align-items:center;justify-content:space-between;
      border-top:1px solid rgba(255,255,255,.12);padding-top:26px">
      <div>
        <div class="display" style="font-size:19px;font-weight:600;color:#fff">${BRAND.tagline}</div>
        <div style="font-size:17px;color:rgba(255,255,255,.55);margin-top:4px">www.ledsconcept.com</div>
      </div>
      <div style="font-family:'Space Grotesk';font-size:18px;font-weight:600;color:${BRAND.ink};
        background:${BRAND.grad};padding:14px 22px;border-radius:999px;white-space:nowrap">
        Message us ›
      </div>
    </div>
  </div>`;
}

function coverCard({ projects, settings }) {
  const rows = projects
    .slice(0, 6)
    .map(
      (p) => `<div style="display:flex;align-items:baseline;justify-content:space-between;gap:20px;
        padding:18px 0;border-bottom:1px solid rgba(255,255,255,.1)">
        <div style="display:flex;align-items:baseline;gap:16px;min-width:0">
          <span style="width:10px;height:10px;border-radius:2px;background:${BRAND.grad};flex:none;transform:translateY(-2px)"></span>
          <span class="display" style="font-size:34px;font-weight:600;letter-spacing:-.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.title}</span>
        </div>
        <span style="font-size:19px;color:rgba(255,255,255,.55);white-space:nowrap;flex:none">${p.sector} · ${p.location}</span>
      </div>`,
    )
    .join("");

  return `<div class="card">
    <div class="pixel-bg"></div>
    ${pixelScatter(0.42)}
    <div class="scrim" style="background:linear-gradient(180deg,rgba(10,10,10,.55),rgba(10,10,10,.78))"></div>
    <div class="grad-bar" style="top:0"></div>

    <div style="position:absolute;top:64px;left:64px;right:64px">
      ${wordmark(42)}
    </div>

    <div style="position:absolute;top:230px;left:64px;right:64px">
      <div style="font-size:18px;font-weight:600;letter-spacing:4px;text-transform:uppercase;color:${BRAND.cyan}">
        Featured Work
      </div>
      <div class="display" style="margin-top:18px;font-size:104px;font-weight:700;line-height:.92;letter-spacing:-3px">
        Pixel-mapped<br/><span class="neon-text">LED experiences</span>
      </div>
      <div style="margin-top:26px;font-size:27px;line-height:1.4;color:rgba(255,255,255,.78);max-width:820px">
        Architectural facades, live events &amp; nightclubs — designed and installed by Madrix-licensed associates.
      </div>
    </div>

    <div style="position:absolute;left:64px;right:64px;bottom:190px">
      ${rows}
    </div>

    <div style="position:absolute;left:64px;right:64px;bottom:56px;
      display:flex;align-items:center;justify-content:space-between">
      <div>
        <div class="display" style="font-size:22px;font-weight:600">${BRAND.tagline}</div>
        <div style="font-size:18px;color:rgba(255,255,255,.55);margin-top:4px">
          www.ledsconcept.com · ${settings.email}
        </div>
      </div>
      <div style="font-family:'Space Grotesk';font-size:19px;font-weight:600;color:${BRAND.ink};
        background:${BRAND.grad};padding:15px 24px;border-radius:999px;white-space:nowrap">
        Get a quote ›
      </div>
    </div>
  </div>`;
}

function page(inner) {
  return `<!doctype html><html><head><meta charset="utf-8">
    <style>${fontFaces}${baseStyles}</style></head>
    <body>${inner}</body></html>`;
}

async function main() {
  const data = await loadData();
  const projects = data.sampleProjects;
  const settings = data.sampleSiteSettings;

  fs.mkdirSync(outDir, { recursive: true });

  console.log("Fetching project images (falls back to neon pixel art if blocked)…");
  const photos = await Promise.all(projects.map((p) => fetchAsDataUri(p.image)));
  photos.forEach((ph, i) =>
    console.log(`  ${projects[i].slug}: ${ph ? "photo embedded" : "pixel fallback"}`),
  );

  const executablePath =
    process.env.CHROMIUM_PATH ||
    "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
  const browser = await chromium.launch({
    executablePath: fs.existsSync(executablePath) ? executablePath : undefined,
    args: ["--no-sandbox", "--force-color-profile=srgb"],
  });
  const context = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: 2, // crisp 2160×2700 output
  });

  const shots = [];
  const render = async (name, html) => {
    const p = await context.newPage();
    await p.setContent(page(html), { waitUntil: "networkidle" });
    // give webfonts a beat to settle
    await p.waitForTimeout(400);
    const file = path.join(outDir, name);
    await p.screenshot({ path: file, type: "png" });
    await p.close();
    shots.push(path.relative(root, file));
    console.log("  ✓", path.relative(root, file));
  };

  console.log("Rendering cards…");
  await render("00-cover.png", coverCard({ projects, settings }));
  for (let i = 0; i < projects.length; i++) {
    const n = String(i + 1).padStart(2, "0");
    await render(`${n}-${projects[i].slug}.png`, projectCard({ project: projects[i], photo: photos[i] }));
  }

  await browser.close();
  console.log(`\nDone — ${shots.length} images in marketing/whatsapp/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

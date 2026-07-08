// Build a lightweight gallery HTML from the WhatsApp cards by downscaling each
// PNG to a JPEG data URI (via the browser canvas) and inlining it, so the page
// is self-contained and CSP-safe for publishing as an Artifact.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const cardsDir = path.join(root, "marketing", "whatsapp");
const outFile = path.join(root, "marketing", "preview.html");

const require = createRequire(import.meta.url);
async function loadPlaywright() {
  const candidates = [];
  try { candidates.push(require.resolve("playwright")); } catch {}
  try {
    const g = execSync("npm root -g", { encoding: "utf8" }).trim();
    candidates.push(path.join(g, "playwright", "index.js"));
  } catch {}
  for (const c of candidates) {
    for (const v of [c.replace(/index\.js$/, "index.mjs"), c]) {
      try {
        const mod = await import(pathToFileURL(v).href);
        const chromium = mod.chromium || mod.default?.chromium;
        if (chromium) return chromium;
      } catch {}
    }
  }
  throw new Error("playwright not found");
}

const files = fs.readdirSync(cardsDir).filter((f) => f.endsWith(".png")).sort();

const chromium = await loadPlaywright();
const exe = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const browser = await chromium.launch({
  executablePath: fs.existsSync(exe) ? exe : undefined,
  args: ["--no-sandbox"],
});
const page = await browser.newPage();

const cards = [];
for (const f of files) {
  const b64 = fs.readFileSync(path.join(cardsDir, f)).toString("base64");
  const jpeg = await page.evaluate(async (src) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const w = 720;
    const h = Math.round((img.height / img.width) * w);
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    c.getContext("2d").drawImage(img, 0, 0, w, h);
    return c.toDataURL("image/jpeg", 0.82);
  }, `data:image/png;base64,${b64}`);
  const label = f.replace(/^\d+-?/, "").replace(/\.png$/, "").replace(/-/g, " ") || "cover";
  cards.push({ file: f, label, jpeg });
  console.log("  packed", f, (jpeg.length / 1024 | 0) + "KB");
}
await browser.close();

const title = (s) => s.replace(/\b\w/g, (m) => m.toUpperCase());

const cardHtml = cards
  .map(
    (c) => `<figure>
      <img src="${c.jpeg}" alt="${c.label}" loading="lazy" />
      <figcaption>${c.file === "00-cover.png" ? "Cover" : title(c.label)}</figcaption>
    </figure>`,
  )
  .join("\n");

const html = `<title>LEDs Concept — WhatsApp cards</title>
<style>
  :root { --ink:#0a0a0a; --paper:#fafafa; }
  * { box-sizing: border-box; }
  body { margin:0; background:#070707; color:var(--paper);
    font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; }
  header { padding: 40px 24px 8px; text-align:center; }
  h1 { margin:0; font-size: clamp(22px,5vw,34px); letter-spacing:-.5px; }
  h1 .n { background:linear-gradient(90deg,#ff2bd6,#22e2ff);
    -webkit-background-clip:text; background-clip:text; color:transparent; }
  p.sub { margin:8px auto 0; max-width:640px; color:#ffffff99; font-size:15px; line-height:1.5; }
  .grad { height:4px; background:linear-gradient(90deg,#ff2bd6,#22e2ff); margin:24px 0 0; }
  main { display:grid; gap:22px; padding:28px 20px 64px; max-width:1200px; margin:0 auto;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }
  figure { margin:0; }
  img { width:100%; height:auto; display:block; border-radius:14px;
    border:1px solid #ffffff14; box-shadow:0 10px 40px #0009; }
  figcaption { margin-top:10px; text-align:center; font-size:14px; color:#ffffffb0; }
  footer { text-align:center; color:#ffffff66; font-size:13px; padding:0 20px 48px; }
</style>
<header>
  <h1><span class="n">LEDs</span> Concept — WhatsApp forward cards</h1>
  <p class="sub">Long-press any image to save, then share on WhatsApp. Sized 1080×1350
  (portrait) at 2× so they stay crisp on any phone. Previews below are compressed —
  the full-resolution PNGs live in <code>marketing/whatsapp/</code>.</p>
  <div class="grad"></div>
</header>
<main>
${cardHtml}
</main>
<footer>The world of pixels is limitless · www.ledsconcept.com</footer>`;

fs.writeFileSync(outFile, html);
console.log("\nWrote", path.relative(root, outFile), (html.length / 1024 | 0) + "KB");

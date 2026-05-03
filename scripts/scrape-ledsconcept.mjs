#!/usr/bin/env node
// One-off importer: scrape image URLs from ledsconcept.com and upload
// each unique image to the Sanity asset library. Reads SANITY env vars
// from .env.local. Run with: node scripts/scrape-ledsconcept.mjs

import { readFileSync } from "node:fs";
import path from "node:path";

const env = Object.fromEntries(
  readFileSync(path.resolve(".env.local"), "utf8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const [k, ...rest] = l.split("=");
      return [k.trim(), rest.join("=").trim()];
    }),
);

const PROJECT_ID = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = env.NEXT_PUBLIC_SANITY_DATASET || "production";
const TOKEN = env.SANITY_API_TOKEN;
if (!PROJECT_ID || !TOKEN) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN in .env.local");
  process.exit(1);
}

const BASE = "https://ledsconcept.com";
const PAGES = ["/", "/about.php", "/projects.php", "/products.php", "/gallery.php"];

const SKIP = /(logo|favicon|sprite|icon-|placeholder|loader|btn-|arrow|whatsapp|facebook|instagram|youtube|twitter|linkedin)/i;

async function fetchHtml(url) {
  const res = await fetch(url, { headers: { "user-agent": "ledsconcept-importer/1.0" } });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  return res.text();
}

function extractImageUrls(html, pageUrl) {
  const urls = new Set();
  const patterns = [
    /<img[^>]+src=["']([^"']+)["']/gi,
    /<source[^>]+srcset=["']([^"' ]+)/gi,
    /background(?:-image)?\s*:\s*url\(["']?([^"')]+)/gi,
    /data-src=["']([^"']+)["']/gi,
    /data-bg=["']([^"']+)["']/gi,
  ];
  for (const re of patterns) {
    for (const m of html.matchAll(re)) {
      let u = m[1];
      if (!u || u.startsWith("data:")) continue;
      if (u.startsWith("//")) u = "https:" + u;
      else if (u.startsWith("/")) u = BASE + u;
      else if (!u.startsWith("http")) u = new URL(u, pageUrl).href;
      if (!/\.(jpe?g|png|webp|gif|avif)(\?|$)/i.test(u)) continue;
      if (SKIP.test(u)) continue;
      urls.add(u);
    }
  }
  return urls;
}

function inferContentType(url) {
  const ext = url.split("?")[0].split(".").pop().toLowerCase();
  return {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    avif: "image/avif",
  }[ext] || "image/jpeg";
}

async function uploadToSanity(buffer, filename, contentType) {
  const url = `https://${PROJECT_ID}.api.sanity.io/v2021-06-07/assets/images/${DATASET}?filename=${encodeURIComponent(filename)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": contentType,
    },
    body: buffer,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sanity upload ${res.status}: ${text.slice(0, 300)}`);
  }
  return res.json();
}

async function main() {
  const allUrls = new Set();
  for (const p of PAGES) {
    const pageUrl = BASE + p;
    try {
      console.log(`Crawling ${pageUrl}`);
      const html = await fetchHtml(pageUrl);
      const found = extractImageUrls(html, pageUrl);
      console.log(`  ${found.size} images`);
      for (const u of found) allUrls.add(u);
    } catch (e) {
      console.warn(`  failed: ${e.message}`);
    }
  }
  console.log(`\nUnique images: ${allUrls.size}\n`);

  let uploaded = 0;
  let failed = 0;
  for (const u of allUrls) {
    const filename = decodeURIComponent(u.split("/").pop().split("?")[0]);
    try {
      const r = await fetch(u, { headers: { "user-agent": "ledsconcept-importer/1.0", referer: BASE } });
      if (!r.ok) throw new Error(`fetch ${r.status}`);
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length < 4096) {
        console.log(`SKIP ${filename} (${buf.length}b too small)`);
        continue;
      }
      const contentType = inferContentType(u);
      const result = await uploadToSanity(buf, filename, contentType);
      uploaded++;
      console.log(`OK   ${filename} -> ${result.document._id}`);
    } catch (e) {
      failed++;
      console.warn(`FAIL ${filename}: ${e.message}`);
    }
  }

  console.log(`\nUploaded: ${uploaded}  Failed: ${failed}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

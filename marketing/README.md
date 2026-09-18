# Marketing collateral

## WhatsApp forward cards (`marketing/whatsapp/`)

Share-ready, branded PNGs of the featured projects — sized **1080×1350**
(portrait) and rendered at 2× (2160×2700) so they stay crisp on any phone.
They forward cleanly on WhatsApp, Instagram Stories and status updates.

| File | What it is |
|---|---|
| `00-cover.png` | Brand cover — tagline + a list of all featured projects |
| `NN-<slug>.png` | One spotlight card per project (title, sector, location, year) |

### Regenerate

```bash
pnpm whatsapp:cards      # or: node scripts/whatsapp-cards.mjs
```

The generator (`scripts/whatsapp-cards.mjs`) renders with the project's neon
brand palette (magenta → cyan gradient, Space Grotesk / Inter) using a headless
Chromium.

### Where the content comes from

The generator loads featured projects + site settings in this order:

1. **Live Sanity** — when `NEXT_PUBLIC_SANITY_PROJECT_ID` is set (and the Sanity
   API is reachable). Set it before running to pull the real, current portfolio:
   ```bash
   NEXT_PUBLIC_SANITY_PROJECT_ID=6p56vgvm pnpm whatsapp:cards
   ```
2. **`marketing/sanity-snapshot.json`** — a cached copy of the live content, so
   the real project names/locations/years render even without network/env.
3. **`lib/sample-data.ts`** — the site's built-in sample content, last resort.

### Project photos

Each card embeds the project's hero image when that URL is reachable, and falls
back to an on-brand **neon pixel-grid** background when it isn't. Sanity's image
CDN (`cdn.sanity.io`) is blocked by egress policy inside Claude's sandbox, so
cards generated there use the pixel fallback. **Run `pnpm whatsapp:cards` on your
own machine (or in CI/Vercel) with the env var set** and the spotlight cards
render with the real project photos.

To refresh the snapshot after adding/editing projects in Sanity, re-query the
featured projects + site settings and update `marketing/sanity-snapshot.json`.

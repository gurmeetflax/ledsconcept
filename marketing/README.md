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

The generator (`scripts/whatsapp-cards.mjs`) reads project data straight from
`lib/sample-data.ts`, so the cards stay in sync with the site's content. It
renders with the project's neon brand palette (magenta → cyan gradient,
Space Grotesk / Inter) using a headless Chromium.

### Project photos

Each card embeds the project's `image` when that URL is reachable, and falls
back to an on-brand **neon pixel-grid** background when it isn't (e.g. offline,
or when a host blocks server-side fetches). Once Sanity is live and serving
real project photos, re-run the command and the spotlight cards will feature
those images automatically.

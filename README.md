# LEDs Concept — website

Next.js 15 + TypeScript + Tailwind, Sanity for content, Supabase for leads.

## Quick start

```bash
pnpm install            # or npm install
cp .env.example .env.local
pnpm dev                # http://localhost:3000
```

The site renders with built-in sample content out of the box. Connect Sanity + Supabase below to go live.

## Stack

| Concern | Tool |
|---|---|
| Framework | Next.js 15 (App Router, React Server Components) |
| Styling | Tailwind CSS, custom dark theme with neon gradient |
| CMS | [Sanity](https://www.sanity.io/) — Studio mounted at `/studio` |
| DB / lead capture | [Supabase](https://supabase.com/) Postgres |
| Embeds | `lite-youtube` (custom element), Elfsight Instagram widget |
| Hosting | Vercel |

## Pages

- `/` Home — hero reel, sectors, featured projects, products, YouTube reel, Instagram, Madrix, CTA
- `/projects` + `/projects/[slug]` — case-study grid + detail
- `/products` + `/products/[slug]` — catalog with category filter
- `/gallery` — masonry from project images
- `/about` — story + Madrix partnership
- `/contact` — form posting to Supabase + contact info
- `/studio` — Sanity Studio (auth-gated by Sanity)

## Project credentials

**Supabase**

- Project URL: `https://fekkytjlcmjenwcrxxmt.supabase.co`
- anon (public) key:
  ```
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZla2t5dGpsY21qZW53Y3J4eG10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MzAzODIsImV4cCI6MjA5MzMwNjM4Mn0.K0bDrczehPA3-Q0TSCE6dyL2OSiGgHm5Tp4wtT4EDzs
  ```

> The anon key is public-by-design — Supabase Row Level Security (already enabled on `leads`) is what protects the data. **Never commit the `service_role` key.** Put it only in `.env.local` (gitignored) and in Vercel project env vars.

## Environment

Fill `.env.local` with:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=                 # only needed for previews / drafts

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server-only

NEXT_PUBLIC_ELFSIGHT_WIDGET_ID=
NEXT_PUBLIC_YOUTUBE_HERO_ID=
```

If Sanity env vars are missing, the site falls back to sample content automatically.
If Supabase env vars are missing, `/api/contact` logs the payload server-side and returns OK.

## Supabase setup

1. Create a project at supabase.com (already done).
2. Open the SQL editor and run [`supabase/migrations/0001_leads.sql`](supabase/migrations/0001_leads.sql) — creates the `leads` table with RLS locked to the service role.
3. Copy your project URL, anon key and service-role key into `.env.local` and Vercel.
4. View leads in Supabase Studio → Table editor → `leads`.

## Sanity setup

1. `npx sanity@latest init --bare` (or use sanity.io/manage) to create a project — pick dataset `production`.
2. Put `projectId` into `NEXT_PUBLIC_SANITY_PROJECT_ID`.
3. Visit `/studio` locally, log in with your Sanity account, add content (start with a `Site settings` doc, sectors, then projects).
4. Add your URL (e.g. `https://your-domain.com`) to **CORS origins** in sanity.io/manage.

## Adding a new project (editor flow)

`/studio` → **Project** → **+ Create**

- Title, slug, sector, year, location
- Hero image, gallery
- Summary + body (rich text)
- YouTube video ID (just the ID)
- Tick "Featured on home" if it should appear on the homepage grid
- Publish — appears on `/projects` within 60s (ISR)

## Deployment

```bash
vercel link
vercel env add ...        # all envs from .env.example
vercel --prod
```

## Scripts

- `pnpm dev` — dev server
- `pnpm build` — production build
- `pnpm start` — run prod build
- `pnpm typecheck` — TS check
- `pnpm lint` — ESLint

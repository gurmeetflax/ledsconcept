// Global next/image loader (referenced from next.config.ts). Runs on server
// and client, so it must be a plain, dependency-free function.
//
// It resizes + reformats images on the source CDN (Sanity, Unsplash) instead
// of routing full-size originals through the Next.js optimizer. Wiring it via
// `images.loaderFile` — rather than a per-<Image> `loader` prop — avoids
// passing a function across the Server/Client Component boundary.

type LoaderArgs = { src: string; width: number; quality?: number };

export default function imageLoader({ src, width, quality }: LoaderArgs): string {
  const q = quality ?? 72;
  const base = src.split("?")[0];

  // Sanity CDN and Unsplash both honour w / q / auto=format.
  if (base.includes("cdn.sanity.io") || base.includes("images.unsplash.com")) {
    return `${base}?w=${width}&q=${q}&auto=format&fit=max`;
  }

  // Unknown host (e.g. a data URI or a source we can't transform): serve as-is.
  return src;
}

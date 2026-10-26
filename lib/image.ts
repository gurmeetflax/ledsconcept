// Build a resized image URL from a full-size source (Sanity CDN or Unsplash).
// Used where next/image isn't in play — e.g. a <video> poster or a lightbox
// slide — so we never ship the multi-megapixel original.
export function sanitySized(
  url: string | undefined | null,
  width: number,
  quality = 72,
): string | undefined {
  if (!url) return undefined;
  const base = url.split("?")[0];
  const common = `w=${width}&q=${quality}&auto=format`;
  // Both Sanity's CDN and Unsplash honour w/q/auto=format.
  return base.includes("cdn.sanity.io") ? `${base}?${common}&fit=max` : `${base}?${common}`;
}

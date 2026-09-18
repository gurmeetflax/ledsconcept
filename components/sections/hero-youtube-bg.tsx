"use client";

import { useEffect, useState } from "react";

// Defers the YouTube background iframe until after first paint / browser idle,
// so the third-party embed never blocks the hero's Largest Contentful Paint.
// A dark gradient stands in until the iframe mounts.
export function HeroYouTubeBg({ youtubeId }: { youtubeId: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const idle =
      typeof window !== "undefined" && "requestIdleCallback" in window
        ? window.requestIdleCallback
        : (cb: () => void) => window.setTimeout(cb, 400);
    const id = idle(() => setShow(true));
    return () => {
      if (typeof window !== "undefined" && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(id as number);
      } else {
        clearTimeout(id as number);
      }
    };
  }, []);

  if (!show) return null;

  return (
    <iframe
      title="Background reel"
      className="pointer-events-none absolute inset-0 h-full w-full scale-[1.4]"
      src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&playsinline=1&playlist=${youtubeId}`}
      allow="autoplay; encrypted-media"
      aria-hidden
      loading="lazy"
    />
  );
}

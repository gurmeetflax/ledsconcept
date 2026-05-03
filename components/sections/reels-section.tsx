"use client";

import { useEffect } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "behold-widget": { "feed-id"?: string; class?: string };
    }
  }
}

export function ReelsSection({ feedId }: { feedId?: string }) {
  useEffect(() => {
    if (!feedId) return;
    if (document.querySelector('script[data-behold]')) return;
    const s = document.createElement("script");
    s.type = "module";
    s.src = "https://w.behold.so/widget.js";
    s.dataset.behold = "true";
    document.head.append(s);
  }, [feedId]);

  if (!feedId) return null;

  return (
    <section className="container-page py-14 md:py-28">
      <div className="mb-8 max-w-2xl md:mb-12">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Reels</p>
        <h2 className="mt-2 font-display text-2xl sm:text-3xl md:text-5xl">Live from our feed.</h2>
      </div>
      <behold-widget feed-id={feedId} />
    </section>
  );
}

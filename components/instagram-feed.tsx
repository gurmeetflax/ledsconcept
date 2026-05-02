"use client";

import Script from "next/script";

export function InstagramFeed({ widgetId }: { widgetId?: string }) {
  if (!widgetId) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-sm text-white/50">
        Instagram feed will appear here once the Elfsight widget ID is set in site settings.
      </div>
    );
  }
  return (
    <>
      <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
      <div className={`elfsight-app-${widgetId}`} data-elfsight-app-lazy />
    </>
  );
}

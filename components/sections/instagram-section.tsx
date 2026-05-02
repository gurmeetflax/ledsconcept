import { InstagramFeed } from "@/components/instagram-feed";

export function InstagramSection({ widgetId }: { widgetId?: string }) {
  return (
    <section className="container-page py-20 md:py-28">
      <div className="mb-8 flex items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">@ledsconcept</p>
          <h2 className="mt-2 font-display text-3xl md:text-5xl">Latest from Instagram.</h2>
        </div>
        <a href="https://instagram.com/ledsconcept" className="text-sm text-white/70 hover:text-white">
          Follow →
        </a>
      </div>
      <InstagramFeed widgetId={widgetId} />
    </section>
  );
}

import { LiteYouTube } from "@/components/lite-youtube";

export function YouTubeReel({ videoId }: { videoId: string }) {
  return (
    <section className="container-page py-14 md:py-28">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Reel</p>
        <h2 className="mt-2 font-display text-2xl sm:text-3xl md:text-5xl">See it move.</h2>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <LiteYouTube videoId={videoId} title="LEDs Concept reel" />
      </div>
    </section>
  );
}

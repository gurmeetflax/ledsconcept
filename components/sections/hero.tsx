import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero({ youtubeId }: { youtubeId?: string }) {
  return (
    <section className="relative min-h-[88vh] overflow-hidden">
      {youtubeId ? (
        <iframe
          className="pointer-events-none absolute inset-0 h-full w-full scale-[1.4]"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&playsinline=1&playlist=${youtubeId}`}
          allow="autoplay; encrypted-media"
          aria-hidden
        />
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=2000&q=80)" }}
          aria-hidden
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/20 to-ink" aria-hidden />
      <div className="relative z-10 container-page flex min-h-[88vh] flex-col justify-end pb-20 pt-32">
        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-white/60">Pixel · Light · Control</p>
        <h1 className="max-w-4xl font-display text-5xl leading-[1.05] text-balance md:text-7xl lg:text-8xl">
          The world of pixels is{" "}
          <span className="neon-text">limitless</span>.
        </h1>
        <p className="mt-6 max-w-xl text-base text-white/70 md:text-lg">
          Architectural, events and nightclub lighting designed, installed and controlled by Madrix-licensed associates.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/projects" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-ink hover:opacity-90">
            See our work <ArrowRight className="size-4" />
          </Link>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white hover:bg-white/5">
            Get a quote
          </Link>
        </div>
      </div>
    </section>
  );
}

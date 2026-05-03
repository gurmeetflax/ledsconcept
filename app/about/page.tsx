import Link from "next/link";

export const metadata = { title: "About" };

const values = [
  { t: "Concept", d: "We start with the idea — what should this space feel like at peak moment?" },
  { t: "Design", d: "Pixel maps, fixture layouts, control topology and content storyboards." },
  { t: "Install", d: "On-site mounting, calibration and rigorous burn-in before handover." },
  { t: "Control", d: "Madrix-driven shows, training and remote support after go-live." },
];

export default function AboutPage() {
  return (
    <div>
      <section className="container-page py-14 md:py-28">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">About</p>
        <h1 className="mt-3 max-w-4xl font-display text-3xl text-balance sm:text-5xl md:text-7xl">
          We design with <span className="neon-text">light</span>, paint with <span className="neon-text">pixels</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-white/70 md:text-lg">
          LEDs Concept is a specialist lighting studio working across architectural, events and nightclub installations.
          As Madrix licensed associates, we cover the full pipeline — from concept and supply to install, control and
          long-term support.
        </p>
      </section>

      <section className="container-page grid gap-4 pb-12 sm:grid-cols-2 md:grid-cols-4 md:pb-16">
        {values.map((v) => (
          <div key={v.t} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h3 className="font-display text-xl">{v.t}</h3>
            <p className="mt-2 text-sm text-white/65">{v.d}</p>
          </div>
        ))}
      </section>

      <section className="container-page pb-14 md:pb-20">
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-10 md:p-14">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl">Madrix Licensed Associates</h2>
          <p className="mt-4 max-w-2xl text-white/70">
            Authorised to supply, train and support Madrix licenses — the world's leading pixel-mapping software for
            architectural and entertainment environments.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-full bg-neon-grad px-6 py-3 text-sm font-medium text-ink"
          >
            Talk to us
          </Link>
        </div>
      </section>
    </div>
  );
}

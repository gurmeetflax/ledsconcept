import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="container-page py-24">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-10 md:p-16">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-neon-magenta/30 blur-3xl" aria-hidden />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-neon-cyan/30 blur-3xl" aria-hidden />
        <div className="relative">
          <h2 className="max-w-2xl font-display text-3xl text-balance md:text-5xl">
            Ready to light up your space?
          </h2>
          <p className="mt-4 max-w-xl text-white/70">
            Tell us about the project — we'll respond within one business day with a concept and quote.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-neon-grad px-6 py-3 text-sm font-medium text-ink hover:opacity-90"
          >
            Start a project <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

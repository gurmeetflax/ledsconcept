import Link from "next/link";
import type { Product } from "@/lib/sample-data";

export function ProductsStrip({ products }: { products: Product[] }) {
  return (
    <section className="border-y border-white/5 bg-white/[0.02] py-14 md:py-20">
      <div className="container-page mb-8 flex items-end justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Hardware & control</p>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl md:text-5xl">Products we supply.</h2>
        </div>
        <Link href="/products" className="text-sm text-white/70 hover:text-white">Browse catalog →</Link>
      </div>
      <div className="container-page -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-8">
        <div className="flex gap-4 pb-2">
          {products.map((p) => (
            <Link
              key={p._id}
              href={`/products/${p.slug}`}
              className="group min-w-[260px] max-w-[280px] flex-shrink-0 rounded-2xl border border-white/10 bg-ink p-3 hover:border-white/30"
            >
              <div
                className="aspect-square w-full rounded-xl bg-cover bg-center"
                style={{ backgroundImage: `url(${p.image})` }}
              />
              <div className="px-1 pb-1 pt-3">
                <p className="text-[10px] uppercase tracking-widest text-white/50">{p.category}</p>
                <h3 className="mt-1 font-display text-lg">{p.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-white/60">{p.shortDesc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

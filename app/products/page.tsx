import Link from "next/link";
import { SanityImage } from "@/components/sanity-image";
import { getProductCategories, getProducts } from "@/lib/content";

export const revalidate = 60;
export const metadata = { title: "Products" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([getProducts(), getProductCategories()]);
  const filtered = params.category ? products.filter((p) => p.categorySlug === params.category) : products;

  return (
    <div className="container-page py-16 md:py-24">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Hardware & control</p>
      <h1 className="mt-2 font-display text-3xl sm:text-4xl md:text-6xl">Products</h1>

      <div className="mt-10 grid gap-10 md:grid-cols-[220px_1fr]">
        <aside className="space-y-1 md:sticky md:top-24 md:h-fit">
          <Link
            href="/products"
            className={`block rounded-md px-3 py-2 text-sm ${!params.category ? "bg-white text-ink" : "text-white/70 hover:bg-white/5"}`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c._id}
              href={`/products?category=${c.slug}`}
              className={`block rounded-md px-3 py-2 text-sm ${params.category === c.slug ? "bg-white text-ink" : "text-white/70 hover:bg-white/5"}`}
            >
              {c.name}
            </Link>
          ))}
        </aside>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Link
              key={p._id}
              href={`/products/${p.slug}`}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-3 hover:border-white/30"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                <SanityImage
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="px-1 pt-3">
                <p className="text-[10px] uppercase tracking-widest text-white/50">{p.category}</p>
                <h3 className="mt-1 font-display text-lg">{p.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-white/60">{p.shortDesc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

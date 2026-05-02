import Link from "next/link";
import { notFound } from "next/navigation";
import { getProducts } from "@/lib/content";
import { sampleProducts } from "@/lib/sample-data";

export const revalidate = 60;

export async function generateStaticParams() {
  return sampleProducts.map((p) => ({ slug: p.slug }));
}

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = await getProducts();
  const p = products.find((x) => x.slug === slug);
  if (!p) notFound();

  return (
    <div className="container-page py-16 md:py-24">
      <Link href="/products" className="text-sm text-white/60 hover:text-white">← Products</Link>
      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="aspect-square rounded-2xl bg-cover bg-center" style={{ backgroundImage: `url(${p.image})` }} />
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">{p.category}</p>
          <h1 className="mt-2 font-display text-3xl md:text-5xl">{p.title}</h1>
          <p className="mt-4 text-white/70">{p.shortDesc}</p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-full bg-neon-grad px-6 py-3 text-sm font-medium text-ink"
          >
            Request a quote
          </Link>
        </div>
      </div>
    </div>
  );
}

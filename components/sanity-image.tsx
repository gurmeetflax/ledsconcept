import Image, { type ImageProps } from "next/image";

type Props = Omit<ImageProps, "src" | "alt"> & {
  src: string | undefined | null;
  alt?: string;
};

function normalize(src: string): string {
  if (!src.includes("cdn.sanity.io")) return src;
  const [base, query = ""] = src.split("?");
  const params = new URLSearchParams(query);
  params.delete("w");
  params.delete("h");
  params.set("auto", "format");
  params.set("fit", "max");
  return params.toString() ? `${base}?${params.toString()}` : base;
}

export function SanityImage({ src, alt = "", quality = 75, sizes, ...rest }: Props) {
  if (!src) return null;
  return (
    <Image
      {...rest}
      src={normalize(src)}
      alt={alt}
      quality={quality}
      sizes={sizes}
    />
  );
}

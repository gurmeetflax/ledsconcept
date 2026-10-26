import Image, { type ImageProps } from "next/image";

// Thin wrapper over next/image for Sanity/remote sources. Resizing and
// reformatting is handled globally by lib/image-loader.ts (configured via
// next.config.ts `images.loaderFile`), so nothing is passed per-image here —
// that keeps this usable from Server Components.

type Props = Omit<ImageProps, "src" | "alt"> & {
  src: string | undefined | null;
  alt?: string;
};

export function SanityImage({ src, alt = "", quality = 72, sizes, ...rest }: Props) {
  if (!src) return null;
  return <Image {...rest} src={src.split("?")[0]} alt={alt} quality={quality} sizes={sizes} />;
}

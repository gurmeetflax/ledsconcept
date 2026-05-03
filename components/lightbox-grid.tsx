"use client";

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import { SanityImage } from "./sanity-image";

type Layout = "grid" | "masonry";

const ASPECTS = ["aspect-[3/4]", "aspect-square", "aspect-[4/5]"];

export function LightboxGrid({ items, layout }: { items: string[]; layout: Layout }) {
  const [index, setIndex] = useState(-1);

  if (!items.length) return null;

  const slides = items.map((src) => ({ src }));

  const tileSizes =
    layout === "masonry"
      ? "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
      : "(min-width: 768px) 33vw, 50vw";

  return (
    <>
      <div
        className={
          layout === "masonry"
            ? "columns-2 gap-3 md:columns-3 lg:columns-4 [&>*]:mb-3 [&>*]:break-inside-avoid"
            : "grid grid-cols-2 gap-3 md:grid-cols-3"
        }
      >
        {items.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={`group relative w-full overflow-hidden rounded-xl ${
              layout === "masonry" ? ASPECTS[i % ASPECTS.length] : "aspect-[4/3]"
            }`}
          >
            <SanityImage
              src={src}
              alt=""
              fill
              sizes={tileSizes}
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={slides}
        plugins={[Zoom, Counter]}
        carousel={{ finite: false }}
        controller={{ closeOnBackdropClick: true }}
      />
    </>
  );
}

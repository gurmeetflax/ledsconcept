"use client";

import { useEffect } from "react";

declare global {
  interface HTMLElementTagNameMap {
    "lite-youtube": HTMLElement;
  }
}

export function LiteYouTube({ videoId, title = "Video" }: { videoId: string; title?: string }) {
  useEffect(() => {
    if (!customElements.get("lite-youtube")) {
      class LiteYT extends HTMLElement {
        connectedCallback() {
          const id = this.getAttribute("videoid") || "";
          this.style.backgroundImage = `url('https://i.ytimg.com/vi/${id}/hqdefault.jpg')`;
          const btn = document.createElement("button");
          btn.className = "lty-playbtn";
          btn.setAttribute("aria-label", "Play video");
          this.appendChild(btn);
          this.addEventListener(
            "click",
            () => {
              const iframe = document.createElement("iframe");
              iframe.width = "560";
              iframe.height = "315";
              iframe.style.width = "100%";
              iframe.style.height = "100%";
              iframe.style.position = "absolute";
              iframe.style.inset = "0";
              iframe.allow =
                "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
              iframe.allowFullscreen = true;
              iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
              this.appendChild(iframe);
              this.classList.add("lyt-activated");
            },
            { once: true },
          );
        }
      }
      customElements.define("lite-youtube", LiteYT);
    }
  }, []);

  return (
    // @ts-expect-error custom element
    <lite-youtube videoid={videoId} title={title} />
  );
}

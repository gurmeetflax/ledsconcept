"use client";

import { useEffect, useState } from "react";

function buildHref(number: string, message?: string) {
  const digits = number.replace(/\D/g, "");
  const url = new URL(`https://wa.me/${digits}`);
  if (message) url.searchParams.set("text", message);
  return url.toString();
}

export function WhatsAppButton({ number, message }: { number?: string; message?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 600);
    return () => clearTimeout(t);
  }, []);

  if (!number) return null;

  return (
    <a
      href={buildHref(number, message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={[
        "group fixed bottom-5 right-5 z-50 flex items-center gap-3",
        "rounded-full bg-[#25D366] py-3 pl-3 pr-4 text-white",
        "shadow-[0_10px_30px_-10px_rgba(37,211,102,0.7)]",
        "ring-1 ring-white/20",
        "transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_14px_40px_-10px_rgba(37,211,102,0.9)]",
        "sm:bottom-7 sm:right-7",
        mounted ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      ].join(" ")}
    >
      <span aria-hidden className="absolute inset-0 -z-10 rounded-full bg-[#25D366]/40 blur-xl" />
      <span aria-hidden className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40 [animation-duration:2.4s]" />

      <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
        <svg viewBox="0 0 32 32" className="h-5 w-5 fill-white" aria-hidden>
          <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.873 2.722.873.358 0 2.13-.515 2.13-1.834 0-.13.014-.602-.16-.717-.547-.34-1.847-.945-1.997-.945z"/><path d="M16.05 0a16 16 0 0 0-13.83 24.087L0 32l8.18-2.137A16 16 0 1 0 16.05 0zm0 29.124a13.06 13.06 0 0 1-6.65-1.815l-.477-.282-4.853 1.27 1.292-4.74-.31-.49a13.067 13.067 0 1 1 11 6.057z"/>
        </svg>
      </span>

      <span className="hidden text-sm font-medium tracking-wide sm:inline">
        Chat on WhatsApp
      </span>
    </a>
  );
}

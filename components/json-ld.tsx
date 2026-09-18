// Renders a JSON-LD structured-data block. `data` is serialized safely for
// embedding in a <script> tag.
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify escapes the payload; we additionally neutralize "<" so a
      // stray "</script>" in content can never break out of the tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

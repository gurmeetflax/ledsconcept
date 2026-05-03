import { PortableText, type PortableTextBlock, type PortableTextComponents } from "@portabletext/react";

type Section = { title: string | null; blocks: PortableTextBlock[] };

function splitByH2(body: PortableTextBlock[]): Section[] {
  const sections: Section[] = [];
  let current: Section = { title: null, blocks: [] };
  for (const block of body) {
    const isH2 =
      (block as { _type?: string }).type === undefined &&
      (block as { _type?: string })._type === "block" &&
      (block as { style?: string }).style === "h2";
    if (isH2) {
      if (current.title || current.blocks.length) sections.push(current);
      const title = ((block as { children?: { text?: string }[] }).children ?? [])
        .map((c) => c.text ?? "")
        .join("")
        .trim();
      current = { title: title || "Section", blocks: [] };
    } else {
      current.blocks.push(block);
    }
  }
  if (current.title || current.blocks.length) sections.push(current);
  return sections;
}

const components: PortableTextComponents = {
  block: {
    h3: ({ children }) => (
      <h3 className="mt-8 text-xs uppercase tracking-[0.3em] text-white/60">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="mt-4 text-base leading-relaxed text-white/80">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mt-4 space-y-2">{children}</ul>,
    number: ({ children }) => <ol className="mt-4 list-decimal space-y-2 pl-5">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="border-b border-white/10 pb-2 text-white/80">{children}</li>
    ),
    number: ({ children }) => <li className="text-white/80">{children}</li>,
  },
};

export function CaseStudy({ body }: { body?: PortableTextBlock[] }) {
  if (!body?.length) return null;
  const sections = splitByH2(body);

  return (
    <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
      {sections.map((s, i) => {
        const inner = (
          <div className="pb-6">
            <PortableText value={s.blocks} components={components} />
          </div>
        );
        if (!s.title) {
          return (
            <div key={i} className="py-6">
              {inner}
            </div>
          );
        }
        return (
          <details key={i} open={i === 0} className="group py-2">
            <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-display text-xl text-white transition-colors hover:text-neon-cyan sm:text-2xl">
              <span>{s.title}</span>
              <span
                aria-hidden
                className="ml-4 text-neon-cyan transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            {inner}
          </details>
        );
      })}
    </div>
  );
}

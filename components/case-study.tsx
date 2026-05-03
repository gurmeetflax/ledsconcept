import { PortableText, type PortableTextBlock, type PortableTextComponents } from "@portabletext/react";

type Zone = { zone: string; treatment: string };

type Section = { title: string | null; blocks: PortableTextBlock[] };

function splitByH2(body: PortableTextBlock[]): Section[] {
  const sections: Section[] = [];
  let current: Section = { title: null, blocks: [] };
  for (const block of body) {
    const isH2 = (block as { _type?: string; style?: string })._type === "block" && (block as { style?: string }).style === "h2";
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
    number: ({ children }) => <ol className="mt-4 space-y-2 list-decimal pl-5">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="border-b border-white/10 pb-2 text-white/80">{children}</li>
    ),
    number: ({ children }) => <li className="text-white/80">{children}</li>,
  },
};

export function CaseStudy({ body, zones }: { body?: PortableTextBlock[]; zones?: Zone[] }) {
  const hasBody = !!body?.length;
  const hasZones = !!zones?.length;
  if (!hasBody && !hasZones) return null;

  const sections = hasBody ? splitByH2(body!) : [];

  return (
    <section className="container-page py-16">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Case study</p>

      {hasZones && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.03]">
                <th className="px-4 py-3 text-xs uppercase tracking-[0.2em] text-white/50">Zone</th>
                <th className="px-4 py-3 text-xs uppercase tracking-[0.2em] text-white/50">Treatment</th>
              </tr>
            </thead>
            <tbody>
              {zones!.map((z, i) => (
                <tr key={i} className="border-b border-white/10 last:border-0">
                  <td className="px-4 py-3 font-display text-white">{z.zone}</td>
                  <td className="px-4 py-3 text-white/70">{z.treatment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {sections.length > 0 && (
        <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
          {sections.map((s, i) => {
            const inner = (
              <div className="pb-6">
                <PortableText value={s.blocks} components={components} />
              </div>
            );
            if (!s.title) {
              return <div key={i} className="py-6">{inner}</div>;
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
      )}
    </section>
  );
}

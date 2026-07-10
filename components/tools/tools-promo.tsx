import Link from "next/link";

import { TOOLS } from "@/lib/tools/registry";

const PRIORITY_SLUGS = ["senales-contradictorias", "sandbox-escenarios"] as const;

export function ToolsPromo() {
  const priority = PRIORITY_SLUGS.map((slug) => TOOLS.find((tool) => tool.slug === slug)).filter(
    (tool): tool is (typeof TOOLS)[number] => Boolean(tool),
  );
  const rest = TOOLS.filter(
    (tool) => !PRIORITY_SLUGS.includes(tool.slug as (typeof PRIORITY_SLUGS)[number]),
  )
    .sort((a, b) => a.impactOrder - b.impactOrder)
    .slice(0, 2);
  const featured = [...priority, ...rest];

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-heading text-xl font-semibold">Herramientas interactivas</h2>
          <p className="text-sm text-muted-foreground">
            Señales contradictorias y sandbox de escenarios para lectura técnica.
          </p>
        </div>
        <Link
          href="/herramientas"
          className="text-sm font-medium text-primary underline-offset-2 hover:underline"
        >
          Ver las 10 →
        </Link>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((tool) => (
          <Link
            key={tool.slug}
            href={`/herramientas/${tool.slug}`}
            className="rounded-xl border border-border/60 bg-card/60 px-3 py-3 text-sm transition-colors hover:border-primary/40"
          >
            <span className="mr-1" aria-hidden>
              {tool.emoji}
            </span>
            {tool.title}
          </Link>
        ))}
      </div>
    </section>
  );
}

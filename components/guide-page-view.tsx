import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { CATEGORY_LABELS, type MacroConcept } from "@/lib/macro-education";
import type { GuidePageConfig } from "@/lib/guide-pages";

type GuidePageViewProps = {
  guide: GuidePageConfig;
  concepts: MacroConcept[];
};

export function GuidePageView({ guide, concepts }: GuidePageViewProps) {
  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="font-heading text-3xl font-bold tracking-tight">{guide.title}</h1>
        <p className="text-muted-foreground">{guide.description}</p>
        <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          {guide.intro.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      </header>

      {concepts.map((concept) => (
        <section
          key={concept.slug}
          id={concept.slug}
          className="scroll-mt-24 flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/40 p-5"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{CATEGORY_LABELS[concept.category]}</Badge>
            <span className="text-xs text-muted-foreground">Fuente: {concept.source}</span>
          </div>
          <h2 className="font-heading text-xl font-semibold">{concept.title}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{concept.enCristiano}</p>

          {concept.analogia ? (
            <p className="rounded-lg border border-border/60 bg-muted/30 px-4 py-3 text-sm italic text-muted-foreground">
              {concept.analogia}
            </p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Para qué sirve</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {concept.paraQueSirve}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Cómo leerlo</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {concept.comoLeerlo}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">En tu vida diaria</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {concept.enTuVida}
            </p>
          </div>

          {concept.erroresComunes ? (
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Error común: {concept.erroresComunes}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              href={`/aprende/${concept.slug}`}
              className="text-primary underline-offset-2 hover:underline"
            >
              Ver en el glosario
            </Link>
            {concept.indicatorSlug ? (
              <Link
                href={`/indicador/${concept.indicatorSlug}`}
                className="text-primary underline-offset-2 hover:underline"
              >
                Ver datos en vivo
              </Link>
            ) : null}
          </div>
        </section>
      ))}
    </article>
  );
}

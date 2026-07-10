import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CATEGORY_LABELS,
  type MacroConcept,
} from "@/lib/macro-education";

type IndicatorLearnPanelProps = {
  concept: MacroConcept;
  showRelated?: boolean;
};

const SECTIONS: {
  key: keyof Pick<
    MacroConcept,
    "enCristiano" | "paraQueSirve" | "comoLeerlo" | "enTuVida"
  >;
  title: string;
}[] = [
  { key: "enCristiano", title: "En simple" },
  { key: "paraQueSirve", title: "Para qué sirve" },
  { key: "comoLeerlo", title: "Cómo leer el número" },
  { key: "enTuVida", title: "En tu vida diaria" },
];

export function IndicatorLearnPanel({
  concept,
  showRelated = true,
}: IndicatorLearnPanelProps) {
  return (
    <article className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">{CATEGORY_LABELS[concept.category]}</Badge>
        <span className="text-xs text-muted-foreground">Fuente: {concept.source}</span>
      </div>

      {concept.analogia ? (
        <p className="rounded-lg border border-border/60 bg-muted/30 px-4 py-3 text-sm italic text-muted-foreground">
          {concept.analogia}
        </p>
      ) : null}

      <div className="flex flex-col gap-4">
        {SECTIONS.map((section) => (
          <div
            key={section.key}
            className="rounded-xl border border-border/60 bg-card/60 px-4 py-3"
          >
            <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {concept[section.key]}
            </p>
          </div>
        ))}
      </div>

      {concept.erroresComunes ? (
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Error común</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {concept.erroresComunes}
          </CardContent>
        </Card>
      ) : null}

      {showRelated && concept.relatedSlugs && concept.relatedSlugs.length > 0 ? (
        <>
          <Separator />
          <div className="flex flex-col gap-2">
            <CardDescription>Conceptos relacionados</CardDescription>
            <div className="flex flex-wrap gap-2">
              {concept.relatedSlugs.map((slug) => (
                <Link
                  key={slug}
                  href={`/aprende/${slug}`}
                  className="rounded-md border border-border/60 px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {slug.replace(/-/g, " ")}
                </Link>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </article>
  );
}

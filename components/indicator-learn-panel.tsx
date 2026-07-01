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
  { key: "enCristiano", title: "En criollo" },
  { key: "paraQueSirve", title: "Para qué sirve" },
  { key: "comoLeerlo", title: "Cómo leer el número" },
  { key: "enTuVida", title: "En tu vida diaria" },
];

export function IndicatorLearnPanel({
  concept,
  showRelated = true,
}: IndicatorLearnPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">{CATEGORY_LABELS[concept.category]}</Badge>
        <span className="text-xs text-muted-foreground">Fuente: {concept.source}</span>
      </div>

      {concept.analogia ? (
        <p className="rounded-lg border border-border/60 bg-muted/30 px-4 py-3 text-sm italic text-muted-foreground">
          {concept.analogia}
        </p>
      ) : null}

      <div className="flex flex-col gap-3">
        {SECTIONS.map((section) => (
          <details
            key={section.key}
            className="group rounded-xl border border-border/60 bg-card/60"
            open={section.key === "enCristiano"}
          >
            <summary className="cursor-pointer list-none px-4 py-3 font-medium marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-2">
                {section.title}
                <span className="text-xs text-muted-foreground transition-transform group-open:rotate-180">
                  ▼
                </span>
              </span>
            </summary>
            <div className="border-t border-border/40 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
              {concept[section.key]}
            </div>
          </details>
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
    </div>
  );
}

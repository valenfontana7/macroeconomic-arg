import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LearnMoreLink } from "@/components/learn-more-link";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { DollarSnapshot } from "@/types/external";
import { cn } from "@/lib/utils";

type DollarPanelProps = {
  dollar: DollarSnapshot;
  embedded?: boolean;
};

const CASA_ORDER = [
  "oficial",
  "mayorista",
  "blue",
  "bolsa",
  "contadoconliqui",
  "tarjeta",
] as const;

const CASA_LABELS: Record<string, string> = {
  oficial: "Oficial",
  mayorista: "Mayorista",
  blue: "Blue",
  bolsa: "MEP",
  contadoconliqui: "CCL",
  tarjeta: "Tarjeta",
};

function brechaBadgeClass(pct: number | null): string {
  if (pct === null) return "border-muted-foreground/30 text-muted-foreground";
  if (pct < 10) return "border-emerald-300 text-emerald-700";
  if (pct < 25) return "border-amber-300 text-amber-700";
  return "border-red-300 text-red-700";
}

export function DollarPanel({ dollar, embedded = false }: DollarPanelProps) {
  const oficial = dollar.quotes.find((q) => q.casa === "oficial")?.venta ?? null;
  const sorted = [...dollar.quotes].sort((a, b) => {
    const ai = CASA_ORDER.indexOf(a.casa as (typeof CASA_ORDER)[number]);
    const bi = CASA_ORDER.indexOf(b.casa as (typeof CASA_ORDER)[number]);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return (
    <section className="flex flex-col gap-6">
      {!embedded ? (
        <div className="flex max-w-3xl flex-col gap-2">
          <h2 className="font-heading text-xl font-semibold tracking-tight">Panel del dólar</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Cotizaciones en tiempo casi real (DolarAPI). La brecha mide cuánto más
            caro está cada dólar paralelo vs. el oficial.
          </p>
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((quote) => {
          const brecha =
            oficial && quote.casa !== "oficial" && quote.casa !== "mayorista"
              ? ((quote.venta - oficial) / oficial) * 100
              : null;

          return (
            <Card
              key={quote.casa}
              className="border-border/60 bg-card/60 [--card-spacing:--spacing(5)]"
            >
              <CardHeader className="gap-3 pb-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <CardTitle className="text-base leading-snug">
                    {CASA_LABELS[quote.casa] ?? quote.nombre}
                  </CardTitle>
                  {brecha !== null ? (
                    <Badge
                      variant="outline"
                      className={cn("shrink-0 tabular-nums", brechaBadgeClass(brecha))}
                    >
                      +{brecha.toFixed(1)}% brecha
                    </Badge>
                  ) : null}
                </div>
                <CardDescription className="text-xs">Compra / Venta</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-1 pt-4">
                <p className="text-xl font-semibold tabular-nums sm:text-2xl">
                  {formatCurrency(quote.venta)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Compra: {formatCurrency(quote.compra)}
                </p>
              </CardContent>
              <CardFooter className="border-t border-border/50 bg-transparent pt-4">
                <p className="text-xs text-muted-foreground">DolarAPI</p>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={brechaBadgeClass(dollar.brechaBluePct)}>
            Brecha Blue: {dollar.brechaBluePct !== null ? formatPercent(dollar.brechaBluePct) : "—"}
          </Badge>
          <LearnMoreLink slug="brecha-blue" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={brechaBadgeClass(dollar.brechaMepPct)}>
            Brecha MEP: {dollar.brechaMepPct !== null ? formatPercent(dollar.brechaMepPct) : "—"}
          </Badge>
          <LearnMoreLink slug="brecha-mep" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={brechaBadgeClass(dollar.brechaCclPct)}>
            Brecha CCL: {dollar.brechaCclPct !== null ? formatPercent(dollar.brechaCclPct) : "—"}
          </Badge>
          <LearnMoreLink slug="brecha-ccl" />
        </div>
        <LearnMoreLink slug="dolar-oficial" className="text-sm text-primary underline-offset-2 hover:underline" />
      </div>
    </section>
  );
}

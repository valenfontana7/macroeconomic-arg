import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LearnMoreLink } from "@/components/learn-more-link";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { DollarSnapshot } from "@/types/external";
import { cn } from "@/lib/utils";

type DollarPanelProps = {
  dollar: DollarSnapshot;
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

export function DollarPanel({ dollar }: DollarPanelProps) {
  const oficial = dollar.quotes.find((q) => q.casa === "oficial")?.venta ?? null;
  const sorted = [...dollar.quotes].sort((a, b) => {
    const ai = CASA_ORDER.indexOf(a.casa as (typeof CASA_ORDER)[number]);
    const bi = CASA_ORDER.indexOf(b.casa as (typeof CASA_ORDER)[number]);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-xl font-semibold">Panel del dólar</h2>
        <p className="text-sm text-muted-foreground">
          Cotizaciones en tiempo casi real (DolarAPI). La brecha mide cuánto más
          caro está cada dólar paralelo vs. el oficial.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((quote) => {
          const brecha =
            oficial && quote.casa !== "oficial" && quote.casa !== "mayorista"
              ? ((quote.venta - oficial) / oficial) * 100
              : null;

          return (
            <Card key={quote.casa} className="border-border/60 bg-card/60">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base">
                    {CASA_LABELS[quote.casa] ?? quote.nombre}
                  </CardTitle>
                  {brecha !== null ? (
                    <Badge
                      variant="outline"
                      className={cn("tabular-nums", brechaBadgeClass(brecha))}
                    >
                      +{brecha.toFixed(1)}% brecha
                    </Badge>
                  ) : null}
                </div>
                <CardDescription>Compra / Venta</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-1">
                <p className="text-2xl font-semibold tabular-nums">
                  {formatCurrency(quote.venta)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Compra: {formatCurrency(quote.compra)}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Badge variant="outline" className={brechaBadgeClass(dollar.brechaBluePct)}>
          Brecha Blue: {dollar.brechaBluePct !== null ? formatPercent(dollar.brechaBluePct) : "—"}
        </Badge>
        <LearnMoreLink slug="brecha-blue" />
        <Badge variant="outline" className={brechaBadgeClass(dollar.brechaMepPct)}>
          Brecha MEP: {dollar.brechaMepPct !== null ? formatPercent(dollar.brechaMepPct) : "—"}
        </Badge>
        <LearnMoreLink slug="brecha-mep" />
        <Badge variant="outline" className={brechaBadgeClass(dollar.brechaCclPct)}>
          Brecha CCL: {dollar.brechaCclPct !== null ? formatPercent(dollar.brechaCclPct) : "—"}
        </Badge>
        <LearnMoreLink slug="brecha-ccl" />
        <LearnMoreLink slug="dolar-oficial" className="text-sm text-primary underline-offset-2 hover:underline" />
      </div>
    </section>
  );
}

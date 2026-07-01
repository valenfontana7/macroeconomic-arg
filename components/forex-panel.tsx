import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LearnMoreLink } from "@/components/learn-more-link";
import { FOREX_LABELS, type ForexCurrency } from "@/lib/dolar-api-client";
import { formatCurrency, formatDate } from "@/lib/format";
import type { ForeignQuote } from "@/types/external";

type ForexPanelProps = {
  quotes: ForeignQuote[];
};

const CURRENCY_FLAGS: Record<ForexCurrency, string> = {
  eur: "🇪🇺",
  brl: "🇧🇷",
  clp: "🇨🇱",
  uyu: "🇺🇾",
};

export function ForexPanel({ quotes }: ForexPanelProps) {
  if (quotes.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-xl font-semibold">Otras monedas</h2>
        <p className="text-sm text-muted-foreground">
          Cotizaciones oficiales en pesos (DolarAPI). Útil para viajes y
          comparar con la región.{" "}
          <LearnMoreLink slug="forex-eur" className="text-sm" />
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quotes.map((quote) => {
          const code = quote.moneda.toLowerCase() as ForexCurrency;
          const flag = CURRENCY_FLAGS[code] ?? "💱";
          const label = FOREX_LABELS[code] ?? quote.nombre;

          return (
            <Card key={quote.moneda} className="border-border/60 bg-card/60">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <span aria-hidden>{flag}</span>
                  {label}
                </CardTitle>
                <CardDescription>{quote.moneda}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-1">
                <p className="font-mono text-2xl font-semibold tabular-nums">
                  {formatCurrency(quote.venta)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Compra: {formatCurrency(quote.compra)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(quote.fechaActualizacion)}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

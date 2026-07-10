import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
    <section className="flex flex-col gap-6">
      <div className="flex max-w-3xl flex-col gap-2">
        <h2 className="font-heading text-xl font-semibold tracking-tight">Otras monedas</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Cotizaciones oficiales en pesos (DolarAPI). Útil para viajes y
          comparar con la región.{" "}
          <LearnMoreLink slug="forex-eur" className="text-sm" />
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {quotes.map((quote) => {
          const code = quote.moneda.toLowerCase() as ForexCurrency;
          const flag = CURRENCY_FLAGS[code] ?? "💱";
          const label = FOREX_LABELS[code] ?? quote.nombre;

          return (
            <Card
              key={quote.moneda}
              className="border-border/60 bg-card/60 [--card-spacing:--spacing(5)]"
            >
              <CardHeader className="gap-2 pb-0">
                <CardTitle className="flex items-center gap-2 text-base leading-snug">
                  <span aria-hidden>{flag}</span>
                  {label}
                </CardTitle>
                <CardDescription className="text-xs">{quote.moneda}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-1 pt-4">
                <p className="font-mono text-xl font-semibold tabular-nums sm:text-2xl">
                  {formatCurrency(quote.venta)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Compra: {formatCurrency(quote.compra)}
                </p>
              </CardContent>
              <CardFooter className="border-t border-border/50 bg-transparent pt-4">
                <p className="text-xs text-muted-foreground">
                  DolarAPI · {formatDate(quote.fechaActualizacion)}
                </p>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

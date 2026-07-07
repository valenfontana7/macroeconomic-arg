import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import type { DollarSnapshot } from "@/types/external";
import { cn } from "@/lib/utils";

type DollarHeroProps = {
  dollar: DollarSnapshot;
};

const GRID_ORDER = ["oficial", "bolsa", "contadoconliqui", "tarjeta", "mayorista"] as const;

const CASA_LABELS: Record<string, string> = {
  oficial: "Dólar Oficial",
  mayorista: "Dólar Mayorista",
  blue: "Dólar Blue",
  bolsa: "Dólar MEP",
  contadoconliqui: "Contado con Liqui",
  tarjeta: "Dólar Tarjeta",
};

const updatedAtFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Argentina/Buenos_Aires",
});

function brechaBadgeClass(pct: number): string {
  if (pct < 10) return "border-emerald-300 bg-emerald-50 text-emerald-700";
  if (pct < 25) return "border-amber-300 bg-amber-50 text-amber-700";
  return "border-red-300 bg-red-50 text-red-700";
}

export function DollarHero({ dollar }: DollarHeroProps) {
  const blue = dollar.quotes.find((quote) => quote.casa === "blue") ?? null;
  const oficialVenta =
    dollar.quotes.find((quote) => quote.casa === "oficial")?.venta ?? null;

  const gridQuotes = GRID_ORDER.map((casa) =>
    dollar.quotes.find((quote) => quote.casa === casa),
  ).filter((quote): quote is NonNullable<typeof quote> => Boolean(quote));

  const updatedLabel = dollar.updatedAt
    ? updatedAtFormatter.format(new Date(dollar.updatedAt))
    : null;

  return (
    <section className="flex flex-col gap-4" aria-label="Cotizaciones del dólar hoy">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_2fr]">
        {/* Dólar Blue protagonista */}
        {blue ? (
          <Link href="/dolar" className="group">
            <Card className="h-full overflow-visible border-2 border-primary/25 bg-card transition-colors group-hover:border-primary/50">
              <CardContent className="flex h-full flex-col justify-between gap-4 p-6">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-heading text-lg font-bold text-foreground">
                    Dólar Blue
                  </h2>
                  {dollar.brechaBluePct !== null ? (
                    <Badge
                      variant="outline"
                      className={cn("tabular-nums", brechaBadgeClass(dollar.brechaBluePct))}
                    >
                      Brecha {dollar.brechaBluePct.toFixed(1)}%
                    </Badge>
                  ) : null}
                </div>
                <div className="flex flex-col gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Compra
                    </p>
                    <p className="font-mono text-2xl font-bold leading-tight tabular-nums text-foreground sm:text-3xl">
                      {formatCurrency(blue.compra)}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Venta
                    </p>
                    <p className="font-mono text-3xl font-bold leading-tight tabular-nums text-primary sm:text-4xl">
                      {formatCurrency(blue.venta)}
                    </p>
                  </div>
                </div>
                {updatedLabel ? (
                  <p className="text-xs text-muted-foreground">
                    Última actualización: {updatedLabel} hs
                  </p>
                ) : null}
              </CardContent>
            </Card>
          </Link>
        ) : null}

        {/* Resto de las cotizaciones */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {gridQuotes.map((quote) => {
            const brecha =
              oficialVenta !== null &&
              quote.casa !== "oficial" &&
              quote.casa !== "mayorista" &&
              quote.casa !== "tarjeta"
                ? ((quote.venta - oficialVenta) / oficialVenta) * 100
                : null;

            return (
              <Link key={quote.casa} href="/dolar" className="group min-w-0">
                <Card className="h-full overflow-visible border-border bg-card transition-colors group-hover:border-primary/40">
                  <CardContent className="flex h-full flex-col gap-3 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="min-w-0 text-sm font-semibold leading-snug text-foreground">
                        {CASA_LABELS[quote.casa] ?? quote.nombre}
                      </h3>
                      {brecha !== null ? (
                        <Badge
                          variant="outline"
                          className={cn(
                            "shrink-0 text-[10px] tabular-nums",
                            brechaBadgeClass(brecha),
                          )}
                        >
                          +{brecha.toFixed(1)}%
                        </Badge>
                      ) : null}
                    </div>
                    <div className="mt-auto flex flex-col gap-2.5">
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          Compra
                        </p>
                        <p className="font-mono text-sm font-semibold leading-tight tabular-nums">
                          {formatCurrency(quote.compra)}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          Venta
                        </p>
                        <p className="font-mono text-base font-bold leading-tight tabular-nums text-foreground">
                          {formatCurrency(quote.venta)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>Fuente: DolarAPI · Datos orientativos, verificá antes de operar.</span>
        <Link href="/dolar" className="font-medium text-primary hover:underline">
          Ver análisis completo del dólar →
        </Link>
      </div>
    </section>
  );
}

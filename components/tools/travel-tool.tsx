"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/format";
import type { ForeignQuote } from "@/types/external";

const DESTINATIONS: Record<string, { flag: string; label: string; code: string }> = {
  BRL: { flag: "🇧🇷", label: "Brasil", code: "brl" },
  CLP: { flag: "🇨🇱", label: "Chile", code: "clp" },
  UYU: { flag: "🇺🇾", label: "Uruguay", code: "uyu" },
  EUR: { flag: "🇪🇺", label: "Europa (EUR)", code: "eur" },
};

type TravelToolProps = {
  quotes: ForeignQuote[];
};

export function TravelTool({ quotes }: TravelToolProps) {
  const [amountForeign, setAmountForeign] = useState(100);

  return (
    <div className="flex flex-col gap-4">
      <label className="flex max-w-xs flex-col gap-2 text-sm">
        Cantidad de moneda extranjera
        <input
          type="number"
          min={1}
          value={amountForeign}
          onChange={(e) => setAmountForeign(Number(e.target.value) || 1)}
          className="rounded-md border border-border/60 bg-background px-3 py-2 font-mono"
        />
      </label>
      <p className="text-sm text-muted-foreground">
        Costo en pesos de comprar{" "}
        <span className="font-mono font-medium text-foreground">{amountForeign}</span>{" "}
        unidades de moneda extranjera hoy (cotización venta DolarAPI).
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {quotes.map((quote) => {
          const meta = DESTINATIONS[quote.moneda];
          const costToday = quote.venta * amountForeign;
          return (
            <Card key={quote.moneda} className="border-border/60 bg-card/60">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <span aria-hidden>{meta?.flag ?? "💱"}</span>
                  {meta?.label ?? quote.nombre}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 text-sm">
                <p className="text-2xl font-semibold tabular-nums">
                  {formatCurrency(costToday)}
                </p>
                <p className="text-muted-foreground">
                  Tipo de cambio: {formatCurrency(quote.venta)} / {quote.moneda}
                </p>
                <p className="text-xs text-muted-foreground">
                  Ref. {formatDate(quote.fechaActualizacion)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Compará con el mes pasado en el dashboard (forex) para ver si
                  el viaje encareció o no en pesos.
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {quotes.length === 0 ? (
        <p className="text-sm text-muted-foreground">Cotizaciones no disponibles ahora.</p>
      ) : null}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/format";
import { findDollarOnDate } from "@/lib/tools/calculations";

type DollarHistory = {
  oficial: { fecha: string; valor: number }[];
  blue: { fecha: string; valor: number }[];
  bolsa: { fecha: string; valor: number }[];
  ccl: { fecha: string; valor: number }[];
};

const CASA_LABELS = {
  oficial: "Oficial",
  blue: "Blue",
  bolsa: "MEP",
  ccl: "CCL",
} as const;

type DollarizationToolProps = {
  histories: DollarHistory;
  currentRates: {
    oficial: number | null;
    blue: number | null;
    bolsa: number | null;
    ccl: number | null;
  };
};

export function DollarizationTool({ histories, currentRates }: DollarizationToolProps) {
  const minDate = histories.oficial[0]?.fecha?.slice(0, 10) ?? "2020-01-01";
  const maxDate = histories.oficial.at(-1)?.fecha?.slice(0, 10) ?? new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState(
    histories.oficial.at(-90)?.fecha?.slice(0, 10) ?? maxDate,
  );
  const [amount, setAmount] = useState(100000);

  const simulation = useMemo(() => {
    const casas = ["oficial", "blue", "bolsa", "ccl"] as const;
    return casas.map((casa) => {
      const then = findDollarOnDate(histories[casa], date);
      const now = currentRates[casa];
      if (!then || !now) {
        return { casa, then: null, now: null, usdThen: null, pesosNow: null, gainPct: null };
      }
      const usdThen = amount / then;
      const pesosNow = usdThen * now;
      const gainPct = ((pesosNow - amount) / amount) * 100;
      return { casa, then, now, usdThen, pesosNow, gainPct };
    });
  }, [histories, currentRates, date, amount]);

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-border/60 bg-card/60">
        <CardContent className="flex flex-col gap-4 pt-6">
          <label className="flex flex-col gap-2 text-sm">
            Fecha en la que &quot;dolarizarías&quot;
            <input
              type="date"
              min={minDate}
              max={maxDate}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-md border border-border/60 bg-background px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            Pesos que habrías convertido
            <input
              type="number"
              min={1000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="rounded-md border border-border/60 bg-background px-3 py-2 font-mono"
            />
          </label>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {simulation.map((row) => (
          <Card key={row.casa} className="border-border/60 bg-card/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{CASA_LABELS[row.casa]}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              {row.usdThen !== null && row.pesosNow !== null ? (
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground">
                    Dólar ese día: {formatCurrency(row.then!)}
                  </p>
                  <p>Comprabas: USD {formatNumber(row.usdThen, 2)}</p>
                  <p className="font-semibold">
                    Hoy valdría: {formatCurrency(row.pesosNow)}
                  </p>
                  <p
                    className={
                      (row.gainPct ?? 0) >= 0 ? "text-emerald-400" : "text-red-400"
                    }
                  >
                    {(row.gainPct ?? 0) >= 0 ? "+" : ""}
                    {row.gainPct?.toFixed(1)}% en pesos
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">Sin datos para esa fecha</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Simulación con cotizaciones históricas (ArgentinaDatos). No incluye costos,
        impuestos ni spread de compra/venta.
      </p>
    </div>
  );
}

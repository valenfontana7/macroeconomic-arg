import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VolatilityEntry } from "@/lib/tools/types";
import { cn } from "@/lib/utils";

const LEVEL_STYLES = {
  baja: "border-emerald-300 bg-emerald-50 text-emerald-700",
  normal: "border-amber-300 bg-amber-50 text-amber-700",
  alta: "border-red-300 bg-red-50 text-red-700",
} as const;

const LEVEL_LABELS = {
  baja: "Más calmo de lo habitual",
  normal: "Dentro de lo normal",
  alta: "Más volátil de lo habitual",
} as const;

type UncertaintyMapToolProps = {
  entries: VolatilityEntry[];
};

export function UncertaintyMapTool({ entries }: UncertaintyMapToolProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {entries.map((entry) => (
        <Card
          key={entry.id}
          className={cn("border", LEVEL_STYLES[entry.level])}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{entry.label}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <p className="font-medium">{LEVEL_LABELS[entry.level]}</p>
            {entry.volatility30d !== null ? (
              <p className="opacity-90">
                Volatilidad 30d: {entry.volatility30d.toFixed(2)}%
                {entry.volatility90d !== null
                  ? ` · 90d: ${entry.volatility90d.toFixed(2)}%`
                  : ""}
              </p>
            ) : null}
            {entry.change30d !== null ? (
              <p className="opacity-90">Cambio 30d: {entry.change30d.toFixed(1)}%</p>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

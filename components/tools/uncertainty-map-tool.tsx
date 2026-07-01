import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { VolatilityEntry } from "@/lib/tools/types";
import { cn } from "@/lib/utils";

const LEVEL_STYLES = {
  baja: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  normal: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  alta: "border-red-500/30 bg-red-500/10 text-red-400",
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

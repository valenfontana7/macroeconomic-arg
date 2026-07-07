import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MOOD_LABELS } from "@/lib/macro-score";
import { scoreToGaugeColor } from "@/lib/thermometer-color";
import type { DashboardData } from "@/lib/dashboard-data";
import { formatChange, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type DailyPulseHeroProps = {
  data: DashboardData;
};

export function DailyPulseHero({ data }: DailyPulseHeroProps) {
  const { macroScore, digest } = data;
  const accent = scoreToGaugeColor(macroScore.score);
  const headline = digest[0] ?? "Resumen del día";
  const inflation = data.indicators.find((i) => i.slug === "inflacion");
  const dollar = data.indicators.find((i) => i.slug === "tc-mayorista");

  const deltaItems: { label: string; display: string }[] = [];
  if (inflation?.change1d != null) {
    deltaItems.push({ label: "Inflación (serie)", display: formatChange(inflation.change1d) });
  }
  if (dollar?.change1d != null) {
    deltaItems.push({ label: "Dólar mayorista", display: formatChange(dollar.change1d) });
  }
  if (data.dollar?.brechaCclPct != null) {
    deltaItems.push({
      label: "Brecha CCL",
      display: `${data.dollar.brechaCclPct.toFixed(1)}%`,
    });
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-card/60">
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <Badge variant="outline" className="w-fit">
              Resumen de hoy
            </Badge>
            <p className="max-w-2xl text-sm leading-relaxed text-foreground/90">{headline}</p>
            <p className="text-xs text-muted-foreground">
              Actualizado {formatDate(data.fetchedAt)}
            </p>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold tabular-nums" style={{ color: accent }}>
              {macroScore.score}
            </span>
            <span className="pb-1 text-sm text-muted-foreground">/ 100</span>
            <Badge variant="outline" className="mb-1">
              {MOOD_LABELS[macroScore.mood]}
            </Badge>
          </div>
        </div>

        {deltaItems.length > 0 ? (
          <div className="flex flex-wrap gap-3 text-sm">
            {deltaItems.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-border/50 bg-background/50 px-3 py-2"
              >
                <span className="text-muted-foreground">{item.label}: </span>
                <span className="font-medium tabular-nums">{item.display}</span>
              </div>
            ))}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Link href="/herramientas/pulso-del-dia" className={cn(buttonVariants({ size: "sm" }))}>
            Compartir resumen
          </Link>
          <Link
            href="/herramientas"
            className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
          >
            Más herramientas
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

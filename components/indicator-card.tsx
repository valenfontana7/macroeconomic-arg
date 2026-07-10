"use client";

import Link from "next/link";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  YAxis,
} from "recharts";

import { DataFreshnessBadge } from "@/components/data-freshness-badge";
import { SourceLink } from "@/components/source-link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatChange, formatDate, formatNumber } from "@/lib/format";
import {
  signalFromChange,
  signalFromInflation,
  type SignalLevel,
} from "@/lib/macro-score";
import { getConceptForIndicator } from "@/lib/macro-education";
import { INDICATOR_BY_SLUG } from "@/lib/indicators";
import { indicatorSourceUrl } from "@/lib/source-links";
import type { FreshnessKind } from "@/lib/data-freshness";
import type { IndicatorSnapshot } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

type IndicatorCardProps = {
  indicator: IndicatorSnapshot;
};

const SIGNAL_STYLES: Record<SignalLevel, string> = {
  good: "bg-emerald-50 text-emerald-700 border-emerald-300",
  warning: "bg-amber-50 text-amber-700 border-amber-300",
  danger: "bg-red-50 text-red-700 border-red-300",
};

function formatIndicatorValue(slug: string, value: number): string {
  if (slug === "inflacion" || slug === "m2-privado" || slug === "badlar" || slug === "prestamos-personales") {
    return `${formatNumber(value, 1)}%`;
  }
  if (slug === "tc-mayorista" || slug === "tc-minorista" || slug === "uva") {
    return `$ ${formatNumber(value, 2)}`;
  }
  if (slug === "reservas" || slug === "base-monetaria") {
    return formatNumber(value, 0);
  }
  return formatNumber(value, 2);
}

function getSignal(indicator: IndicatorSnapshot): SignalLevel {
  if (indicator.slug === "inflacion") {
    return signalFromInflation(indicator.latestValue);
  }
  return signalFromChange(indicator.change30d, indicator.higherIsBetter);
}

export function IndicatorCard({ indicator }: IndicatorCardProps) {
  const signal = getSignal(indicator);
  const concept = getConceptForIndicator(indicator.slug);
  const config = INDICATOR_BY_SLUG[indicator.slug];
  const sourceLabel = config ? "BCRA" : "—";
  const sourceUrl = indicatorSourceUrl(indicator.slug);
  const freshnessKind: FreshnessKind =
    indicator.slug === "inflacion" ? "indec_monthly" : "bcra_daily";
  const showBcraInflationNote = indicator.slug === "inflacion";
  const chartData = indicator.sparkline.map((point) => ({
    fecha: point.fecha,
    valor: point.valor,
  }));

  return (
    <Card className="flex h-full flex-col border-border/60 bg-card/60 transition-colors hover:border-primary/30 [--card-spacing:--spacing(5)]">
      <CardHeader className="gap-3 pb-0">
        <div className="flex flex-col gap-3">
          <Link href={`/indicador/${indicator.slug}`} className="group/title flex flex-col gap-1.5">
            <CardTitle className="text-base leading-snug group-hover/title:text-primary">
              {indicator.label}
            </CardTitle>
            <CardDescription className="text-xs">{indicator.unit}</CardDescription>
          </Link>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline" className={cn(SIGNAL_STYLES[signal])}>
              {signal === "good" ? "OK" : signal === "warning" ? "Atento" : "Alerta"}
            </Badge>
            <DataFreshnessBadge date={indicator.latestDate} kind={freshnessKind} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 pt-4">
        <Link href={`/indicador/${indicator.slug}`} className="flex flex-col gap-1">
          <p className="text-xl font-semibold tabular-nums tracking-tight sm:text-2xl">
            {formatIndicatorValue(indicator.slug, indicator.latestValue)}
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
            <span>7d: {formatChange(indicator.change7d)}</span>
            <span>30d: {formatChange(indicator.change30d)}</span>
          </div>
        </Link>

        <Link href={`/indicador/${indicator.slug}`} className="block h-20 w-full pt-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <YAxis hide domain={["dataMin", "dataMax"]} />
              <Area
                type="monotone"
                dataKey="valor"
                stroke="var(--color-chart-2)"
                fill="var(--color-chart-2)"
                fillOpacity={0.15}
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Link>

        {concept ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground/80">En simple:</span>{" "}
            {concept.enCristiano}
          </p>
        ) : null}

        {showBcraInflationNote ? (
          <p className="text-[11px] leading-relaxed text-amber-800">
            Referencia BCRA. El IPC oficial es el de INDEC (ver contexto abajo).
          </p>
        ) : null}
      </CardContent>

      <CardFooter className="mt-auto flex-col items-stretch gap-3 border-t border-border/50 bg-transparent pt-4">
        <p className="text-xs leading-relaxed text-muted-foreground">
          {sourceLabel} · {formatDate(indicator.latestDate)}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          {sourceUrl ? <SourceLink href={sourceUrl} className="text-xs" /> : null}
          <Tooltip>
            <TooltipTrigger className="hidden underline decoration-dotted underline-offset-2 sm:inline">
              ¿Qué es?
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p>{indicator.description}</p>
            </TooltipContent>
          </Tooltip>
          <Link
            href={`/aprende/${indicator.slug}`}
            className="underline decoration-dotted underline-offset-2 sm:hidden"
          >
            ¿Qué es?
          </Link>
          <Link
            href={`/aprende/${indicator.slug}`}
            className="text-primary underline-offset-2 hover:underline"
          >
            Aprendé más
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

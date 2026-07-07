"use client";

import Link from "next/link";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
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

function truncate(text: string, max = 80): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

export function IndicatorCard({ indicator }: IndicatorCardProps) {
  const signal = getSignal(indicator);
  const concept = getConceptForIndicator(indicator.slug);
  const config = INDICATOR_BY_SLUG[indicator.slug];
  const sourceLabel = config ? "BCRA" : "—";
  const chartData = indicator.sparkline.map((point) => ({
    fecha: point.fecha,
    valor: point.valor,
  }));

  return (
    <Card className="flex h-full flex-col border-border/60 bg-card/60 transition-colors hover:border-primary/30">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/indicador/${indicator.slug}`} className="group/title flex flex-col gap-1">
            <CardTitle className="text-base group-hover/title:text-primary">
              {indicator.label}
            </CardTitle>
            <CardDescription>{indicator.unit}</CardDescription>
          </Link>
          <Badge variant="outline" className={cn("shrink-0", SIGNAL_STYLES[signal])}>
            {signal === "good" ? "OK" : signal === "warning" ? "Atento" : "Alerta"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <Link href={`/indicador/${indicator.slug}`} className="flex items-end justify-between gap-2">
          <p className="text-2xl font-semibold tabular-nums">
            {formatIndicatorValue(indicator.slug, indicator.latestValue)}
          </p>
          <div className="flex flex-col items-end text-xs text-muted-foreground">
            <span>7d: {formatChange(indicator.change7d)}</span>
            <span>30d: {formatChange(indicator.change30d)}</span>
          </div>
        </Link>

        <Link href={`/indicador/${indicator.slug}`} className="block h-16 w-full">
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
            {truncate(concept.enCristiano)}
          </p>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            {sourceLabel} · {formatDate(indicator.latestDate)}
          </span>
          <div className="flex items-center gap-2">
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
              className="hidden text-primary underline-offset-2 hover:underline sm:inline"
            >
              Aprendé más
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

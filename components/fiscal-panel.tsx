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
import type { FiscalIndicatorSnapshot } from "@/lib/dashboard-data";
import { formatChange, formatDate, formatNumber } from "@/lib/format";
import { FISCAL_INDICATOR_BY_SLUG } from "@/lib/fiscal-indicators";
import { isFiscalDataStale } from "@/lib/fiscal-client";
import { getConceptBySlug } from "@/lib/macro-education";
import { fiscalIndicatorSourceUrl } from "@/lib/source-links";
import {
  signalFromChange,
  type SignalLevel,
} from "@/lib/macro-score";
import { cn } from "@/lib/utils";

type FiscalPanelProps = {
  indicators: FiscalIndicatorSnapshot[];
};

const SIGNAL_STYLES: Record<SignalLevel, string> = {
  good: "bg-emerald-50 text-emerald-700 border-emerald-300",
  warning: "bg-amber-50 text-amber-700 border-amber-300",
  danger: "bg-red-50 text-red-700 border-red-300",
};

function formatFiscalValue(slug: string, value: number): string {
  if (slug === "deuda-externa-yoy") {
    return `${formatNumber(value, 1)}%`;
  }
  if (slug === "deuda-externa-usd") {
    return formatNumber(value, 0);
  }
  return formatNumber(value, 0);
}

function getSignal(indicator: FiscalIndicatorSnapshot): SignalLevel {
  if (indicator.slug === "resultado-primario" || indicator.slug === "deficit-financiero") {
    return indicator.latestValue >= 0 ? "good" : indicator.latestValue >= -500_000 ? "warning" : "danger";
  }
  return signalFromChange(indicator.change30d ?? indicator.latestValue, indicator.higherIsBetter);
}

function FiscalIndicatorCard({ indicator }: { indicator: FiscalIndicatorSnapshot }) {
  const signal = getSignal(indicator);
  const config = FISCAL_INDICATOR_BY_SLUG[indicator.slug];
  const concept = getConceptBySlug(indicator.slug);
  const stale = isFiscalDataStale(indicator.latestDate);
  const sourceUrl = fiscalIndicatorSourceUrl(indicator.slug);
  const simpleText = concept?.enCristiano ?? indicator.impact;
  const chartData = indicator.sparkline.map((point) => ({
    fecha: point.fecha,
    valor: point.valor,
  }));

  return (
    <Card className="flex h-full flex-col border-border/60 bg-card/60 transition-colors hover:border-primary/30 [--card-spacing:--spacing(5)]">
      <CardHeader className="gap-3 pb-0">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <CardTitle className="text-base leading-snug">{indicator.label}</CardTitle>
            <CardDescription className="text-xs">{indicator.unit}</CardDescription>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline" className={cn(SIGNAL_STYLES[signal])}>
              {signal === "good" ? "OK" : signal === "warning" ? "Atento" : "Alerta"}
            </Badge>
            {stale ? (
              <Badge variant="outline" className="border-amber-300 bg-amber-50 text-[10px] text-amber-800">
                Dato antiguo
              </Badge>
            ) : (
              <DataFreshnessBadge date={indicator.latestDate} kind="fiscal_quarterly" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 pt-4">
        <div className="flex flex-col gap-1">
          <p className="text-xl font-semibold tabular-nums tracking-tight sm:text-2xl">
            {formatFiscalValue(indicator.slug, indicator.latestValue)}
          </p>
          {indicator.change30d !== null ? (
            <p className="text-xs text-muted-foreground">
              vs período anterior: {formatChange(indicator.change30d)}
            </p>
          ) : null}
        </div>

        {chartData.length > 1 ? (
          <div className="h-20 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <YAxis hide domain={["dataMin", "dataMax"]} />
                <Area
                  type="monotone"
                  dataKey="valor"
                  stroke="var(--color-chart-4)"
                  fill="var(--color-chart-4)"
                  fillOpacity={0.15}
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : null}

        <p className="text-xs leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground/80">En simple:</span>{" "}
          {simpleText}
        </p>
      </CardContent>

      <CardFooter className="mt-auto flex-col items-stretch gap-3 border-t border-border/50 bg-transparent pt-4">
        <p className="text-xs leading-relaxed text-muted-foreground">
          {config.source} · {formatDate(indicator.latestDate)}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          {sourceUrl ? <SourceLink href={sourceUrl} className="text-xs" /> : null}
          <Tooltip>
            <TooltipTrigger className="underline decoration-dotted underline-offset-2">
              ¿Qué es?
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p>{indicator.description}</p>
            </TooltipContent>
          </Tooltip>
          <Link
            href={`/aprende/${indicator.slug === "deuda-externa-yoy" ? "deuda-externa" : indicator.slug}`}
            className="text-primary underline-offset-2 hover:underline"
          >
            Aprendé más
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

export function FiscalPanel({ indicators }: FiscalPanelProps) {
  if (indicators.length === 0) return null;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex max-w-3xl flex-col gap-2">
        <h2 className="font-heading text-xl font-semibold tracking-tight">
          Finanzas públicas
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Resultado fiscal y deuda externa del sector público (IMIG e INDEC). La deuda
          externa se publica con rezago trimestral.{" "}
          <Link href="/finanzas-publicas" className="text-primary underline-offset-2 hover:underline">
            Ver hub fiscal
          </Link>
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-4">
        {indicators.map((indicator) => (
          <FiscalIndicatorCard key={indicator.slug} indicator={indicator} />
        ))}
      </div>
    </section>
  );
}

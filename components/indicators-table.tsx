"use client";

import Link from "next/link";
import { Download } from "lucide-react";
import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataFreshnessBadge } from "@/components/data-freshness-badge";
import { SourceLink } from "@/components/source-link";
import type { FiscalIndicatorSnapshot, IndicatorSnapshot } from "@/lib/dashboard-data";
import type { FreshnessKind } from "@/lib/data-freshness";
import { downloadCsv } from "@/lib/csv-export";
import { formatChange, formatDate, formatNumber } from "@/lib/format";
import { FISCAL_INDICATOR_BY_SLUG } from "@/lib/fiscal-indicators";
import {
  signalFromChange,
  signalFromInflation,
  type SignalLevel,
} from "@/lib/macro-score";
import { fiscalIndicatorSourceUrl, indicatorSourceUrl } from "@/lib/source-links";

type TableRow = {
  id: string;
  label: string;
  href: string;
  value: string;
  change7d: string;
  change30d: string;
  source: string;
  sourceUrl: string | null;
  date: string;
  signal: SignalLevel;
  freshnessKind: FreshnessKind;
};

type IndicatorsTableProps = {
  indicators: IndicatorSnapshot[];
  fiscalIndicators: FiscalIndicatorSnapshot[];
};

const SIGNAL_LABELS: Record<SignalLevel, string> = {
  good: "OK",
  warning: "Atento",
  danger: "Alerta",
};

function formatBcraValue(slug: string, value: number): string {
  if (
    slug === "inflacion" ||
    slug === "m2-privado" ||
    slug === "badlar" ||
    slug === "prestamos-personales"
  ) {
    return `${formatNumber(value, 1)}%`;
  }
  if (slug === "tc-mayorista" || slug === "tc-minorista" || slug === "uva") {
    return `$ ${formatNumber(value, 2)}`;
  }
  return formatNumber(value, 0);
}

function formatFiscalValue(slug: string, value: number): string {
  if (slug === "deuda-externa-yoy") return `${formatNumber(value, 1)}%`;
  return formatNumber(value, 0);
}

function buildRows(
  indicators: IndicatorSnapshot[],
  fiscalIndicators: FiscalIndicatorSnapshot[],
): TableRow[] {
  const bcraRows = indicators.map((indicator) => {
    const signal =
      indicator.slug === "inflacion"
        ? signalFromInflation(indicator.latestValue)
        : signalFromChange(indicator.change30d, indicator.higherIsBetter);

    return {
      id: indicator.slug,
      label: indicator.label,
      href: `/indicador/${indicator.slug}`,
      value: formatBcraValue(indicator.slug, indicator.latestValue),
      change7d: indicator.change7d != null ? formatChange(indicator.change7d) : "—",
      change30d: indicator.change30d != null ? formatChange(indicator.change30d) : "—",
      source: "BCRA",
      sourceUrl: indicatorSourceUrl(indicator.slug),
      date: indicator.latestDate,
      signal,
      freshnessKind:
        indicator.slug === "inflacion" ? ("indec_monthly" as const) : ("bcra_daily" as const),
    };
  });

  const fiscalRows = fiscalIndicators.map((indicator) => ({
    id: indicator.slug,
    label: indicator.label,
    href: "/finanzas-publicas",
    value: formatFiscalValue(indicator.slug, indicator.latestValue),
    change7d: "—",
    change30d: indicator.change30d != null ? formatChange(indicator.change30d) : "—",
    source: FISCAL_INDICATOR_BY_SLUG[indicator.slug].source,
    sourceUrl: fiscalIndicatorSourceUrl(indicator.slug),
    date: indicator.latestDate,
    signal:
      indicator.slug === "resultado-primario" || indicator.slug === "deficit-financiero"
        ? indicator.latestValue >= 0
          ? ("good" as const)
          : indicator.latestValue >= -500_000
            ? ("warning" as const)
            : ("danger" as const)
        : signalFromChange(
            indicator.change30d ?? indicator.latestValue,
            indicator.higherIsBetter,
          ),
    freshnessKind: "fiscal_quarterly" as const,
  }));

  return [...bcraRows, ...fiscalRows];
}

export function IndicatorsTable({ indicators, fiscalIndicators }: IndicatorsTableProps) {
  const rows = useMemo(
    () => buildRows(indicators, fiscalIndicators),
    [indicators, fiscalIndicators],
  );

  const exportCsv = () => {
    const header = "Indicador,Valor,Delta 7d,Delta 30d,Fuente,Fecha,Semáforo\n";
    const body = rows
      .map((row) =>
        [
          row.label,
          row.value,
          row.change7d,
          row.change30d,
          row.source,
          row.date,
          SIGNAL_LABELS[row.signal],
        ]
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");
    downloadCsv("indicadores-la-brecha.csv", header + body);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Button type="button" variant="outline" size="sm" onClick={exportCsv}>
          <Download className="size-4" aria-hidden />
          Exportar CSV
        </Button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border/60">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-muted/40 text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 font-medium">Indicador</th>
              <th className="px-3 py-2 font-medium">Valor</th>
              <th className="px-3 py-2 font-medium">Δ7d</th>
              <th className="px-3 py-2 font-medium">Δ30d</th>
              <th className="px-3 py-2 font-medium">Fuente</th>
              <th className="px-3 py-2 font-medium">Fecha</th>
              <th className="px-3 py-2 font-medium">Semáforo</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-border/40">
                <td className="px-3 py-2">
                  <Link href={row.href} className="font-medium hover:text-primary">
                    {row.label}
                  </Link>
                </td>
                <td className="px-3 py-2 tabular-nums">{row.value}</td>
                <td className="px-3 py-2 tabular-nums text-muted-foreground">{row.change7d}</td>
                <td className="px-3 py-2 tabular-nums text-muted-foreground">{row.change30d}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap items-center gap-1">
                    {row.sourceUrl ? (
                      <SourceLink href={row.sourceUrl} label={row.source} className="text-xs" />
                    ) : (
                      row.source
                    )}
                    <DataFreshnessBadge date={row.date} kind={row.freshnessKind} />
                  </div>
                </td>
                <td className="px-3 py-2 text-muted-foreground">{formatDate(row.date)}</td>
                <td className="px-3 py-2">
                  <Badge variant="outline">{SIGNAL_LABELS[row.signal]}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

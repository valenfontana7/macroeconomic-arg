import Link from "next/link";

import { MacroCalendarPanel } from "@/components/macro-calendar-panel";
import { TrendChart } from "@/components/trend-chart";
import { formatChange, formatDate, formatNumber } from "@/lib/format";
import type { DashboardData, IndicatorSnapshot } from "@/lib/dashboard-data";
import { getConceptForIndicator } from "@/lib/macro-education";
import { MOOD_LABELS } from "@/lib/macro-score";
import { PILLAR_LABELS, type IndicatorPillar } from "@/lib/indicators";
import { scoreToGaugeColor } from "@/lib/thermometer-color";

type MarketsDeskProps = {
  data: DashboardData;
};

function formatValue(indicator: IndicatorSnapshot): string {
  const { slug, latestValue } = indicator;
  if (slug === "inflacion" || slug === "m2-privado" || slug === "badlar" || slug === "prestamos-personales") {
    return `${formatNumber(latestValue, 1)}%`;
  }
  if (slug === "tc-mayorista" || slug === "tc-minorista" || slug === "uva") {
    return `$ ${formatNumber(latestValue, 2)}`;
  }
  if (slug === "reservas" || slug === "base-monetaria") {
    return formatNumber(latestValue, 0);
  }
  return formatNumber(latestValue, 2);
}

function groupByPillar(
  indicators: IndicatorSnapshot[],
  pillars: IndicatorPillar[],
): Record<IndicatorPillar, IndicatorSnapshot[]> {
  const map: Record<IndicatorPillar, IndicatorSnapshot[]> = {
    externo: [],
    cambio: [],
    precios: [],
    monetario: [],
    fiscal: [],
  };
  for (const item of indicators) {
    if (pillars.includes(item.pillar as IndicatorPillar)) {
      map[item.pillar as IndicatorPillar].push(item);
    }
  }
  return map;
}

export function MarketsDesk({ data }: MarketsDeskProps) {
  const score = data.macroScore;
  const moodColor = scoreToGaugeColor(score.score);
  const dateLabel = formatDate(data.fetchedAt);

  const grouped = groupByPillar(data.indicators, ["cambio", "precios", "fiscal", "monetario"]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-4 flex flex-col gap-1">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Mercados</h1>
        <p className="text-sm text-muted-foreground">Actualizado {dateLabel}</p>
      </header>

      {/* Apertura: cotizaciones + clima compacto */}
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Cotizaciones */}
        {data.dollar ? (
          <div>
            <h2 className="font-heading text-base font-semibold uppercase tracking-wide text-foreground/70">
              Cotizaciones principales
            </h2>
            <div className="divide-y divide-border/70 overflow-hidden rounded-md border border-border/70 bg-card/60">
              {["oficial", "blue", "bolsa", "contadoconliqui"].map((casa) => {
                const q = data.dollar!.quotes.find((q) => q.casa === casa);
                if (!q) return null;
                const label =
                  casa === "oficial" ? "Oficial" : casa === "blue" ? "Blue" : casa === "bolsa" ? "MEP" : "CCL";
                return (
                  <div key={casa} className="flex items-center justify-between px-3 py-2 text-sm">
                    <span className="text-foreground/70">{label}</span>
                    <span className="font-semibold tabular-nums">${q.venta.toLocaleString("es-AR")}</span>
                  </div>
                );
              })}
              {data.dollar.brechaCclPct != null ? (
                <div className="flex items-center justify-between bg-muted/40 px-3 py-2 text-sm">
                  <span className="text-foreground/70">Brecha CCL</span>
                  <span className="font-semibold tabular-nums">{data.dollar.brechaCclPct.toFixed(1)}%</span>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* Clima de mercado compacto */}
        <div className="flex flex-col gap-2">
          <h2 className="font-heading text-base font-semibold uppercase tracking-wide text-foreground/70">
            Clima de mercado
          </h2>
          <p className="text-sm">
            <span className="font-semibold tabular-nums" style={{ color: moodColor }}>
              {score.score}
            </span>{" "}
            / 100 — <span className="text-muted-foreground">{MOOD_LABELS[score.mood]}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Metodología y cálculo en{" "}
            <Link href="/acerca" className="underline underline-offset-2 hover:text-foreground">
              /acerca
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Indicadores como tablas de diario */}
      <section className="mt-8 flex flex-col gap-10">
        {(Object.keys(grouped) as IndicatorPillar[]).map((pillar) => {
          const items = grouped[pillar];
          if (!items || items.length === 0) return null;
          return (
            <div key={pillar} className="flex flex-col gap-3">
              <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground/70">
                {PILLAR_LABELS[pillar]}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-sm">
                  <thead>
                    <tr className="border-b border-border/70 text-left text-[12px] uppercase tracking-wide text-foreground/70">
                      <th className="px-3 py-2 font-semibold">Indicador</th>
                      <th className="px-3 py-2 font-semibold">Valor</th>
                      <th className="px-3 py-2 font-semibold">Δ</th>
                      <th className="px-3 py-2 font-semibold">En simple</th>
                      <th className="px-3 py-2 font-semibold">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((indicator) => {
                      const concept = getConceptForIndicator(indicator.slug);
                      const delta =
                        indicator.change30d != null
                          ? formatChange(indicator.change30d)
                          : indicator.change7d != null
                            ? formatChange(indicator.change7d)
                            : "—";
                      return (
                        <tr key={indicator.slug} className="border-b border-border/40">
                          <td className="px-3 py-2">
                            <Link
                              href={`/indicador/${indicator.slug}`}
                              className="font-medium hover:underline"
                            >
                              {indicator.label}
                            </Link>
                          </td>
                          <td className="px-3 py-2 tabular-nums">{formatValue(indicator)}</td>
                          <td className="px-3 py-2 tabular-nums text-muted-foreground">{delta}</td>
                          <td className="px-3 py-2 text-muted-foreground">
                            {concept?.enCristiano ?? indicator.description}
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">{formatDate(indicator.latestDate)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </section>

      {/* Gráficos como figuras con encabezado, no “tiles” */}
      <section className="mt-10 flex flex-col gap-4">
        <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground/70">
          Señales en gráficos
        </h3>
        <div className="grid gap-6 lg:grid-cols-2">
          <TrendChart
            title="Brecha CCL vs oficial"
            subtitle="Diferencia porcentual histórica (ArgentinaDatos)"
            series={data.featuredSeries.brechaCcl}
            format="percent"
            color="#dc2626"
          />
          <TrendChart
            title="Inflación interanual (INDEC)"
            subtitle="Variación de precios en 12 meses — fuente oficial"
            series={data.featuredSeries.indecInflationAnnual}
            format="percent"
            color="#d97706"
          />
          <TrendChart
            title="Dólar mayorista (BCRA)"
            subtitle="Tipo de cambio oficial de referencia"
            series={data.featuredSeries.dollar}
            format="currency"
            color="#1d4ed8"
          />
          <TrendChart
            title="Inflación mensual (BCRA)"
            subtitle="Referencia BCRA — ver IPC INDEC en contexto para dato oficial"
            series={data.featuredSeries.inflation}
            format="percent"
            color="#7c3aed"
          />
        </div>
      </section>

      {/* Agenda de la edición */}
      <section className="mt-10 flex flex-col gap-3">
        <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground/70">
          Agenda de la edición
        </h3>
        <MacroCalendarPanel compact />
      </section>
    </div>
  );
}


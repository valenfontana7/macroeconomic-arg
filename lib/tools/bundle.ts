import { getDollarHistory } from "@/lib/argentinadatos-client";
import type { MacroScoreInput } from "@/lib/macro-score";
import { buildMacroScoreInput } from "@/lib/macro-score";
import { getVariableSeries } from "@/lib/bcra-client";
import { getDashboardData } from "@/lib/dashboard-data";
import { getIndecInflationSeries } from "@/lib/datos-gobar-client";
import {
  findValueDaysAgo,
  percentChange,
  sliceSeriesByDays,
  volatilityPercent,
} from "@/lib/series-utils";
import type { ToolsBundle, VolatilityEntry } from "@/lib/tools/types";

function classifyVolatility(v30: number | null, v90: number | null): VolatilityEntry["level"] {
  if (v30 === null || v90 === null) return "normal";
  if (v30 > v90 * 1.4) return "alta";
  if (v30 < v90 * 0.7) return "baja";
  return "normal";
}

function buildVolatilityEntry(
  id: string,
  label: string,
  series: { fecha: string; valor: number }[],
): VolatilityEntry {
  const s30 = sliceSeriesByDays(series, 30);
  const s90 = sliceSeriesByDays(series, 90);
  const v30 = volatilityPercent(s30);
  const v90 = volatilityPercent(s90);
  const latest = series.at(-1)?.valor;
  const past30 = findValueDaysAgo(series, 30)?.valor;

  return {
    id,
    label,
    volatility30d: v30,
    volatility90d: v90,
    level: classifyVolatility(v30, v90),
    change30d: latest !== undefined ? percentChange(latest, past30) : null,
  };
}

export async function getToolsBundle(): Promise<ToolsBundle> {
  const desde = new Date();
  desde.setFullYear(desde.getFullYear() - 1);
  const desdeStr = desde.toISOString().slice(0, 10);

  const [dashboard, ipcSeries, oficial, blue, bolsa, ccl, reservesSeries, monetarySeries, badlarSeries, m2Series] =
    await Promise.all([
      getDashboardData(),
      getIndecInflationSeries(),
      getDollarHistory("oficial", 365),
      getDollarHistory("blue", 365),
      getDollarHistory("bolsa", 365),
      getDollarHistory("contadoconliqui", 365),
      getVariableSeries(1, desdeStr),
      getVariableSeries(15, desdeStr),
      getVariableSeries(7, desdeStr),
      getVariableSeries(25, desdeStr),
    ]);

  const macroInput = buildMacroScoreInput({
    inflation: dashboard.featuredSeries.inflation,
    reserves: reservesSeries,
    dollar: dashboard.featuredSeries.dollar,
    monetaryBase: monetarySeries,
    badlar: badlarSeries,
    m2: m2Series,
    brechaCclPct: dashboard.dollar?.brechaCclPct ?? null,
    countryRisk: dashboard.countryRisk?.valor ?? null,
    inflationAnnual: dashboard.indec?.ipcAnnual ?? null,
    primaryBalance3m: dashboard.fiscal?.primaryBalance3m ?? null,
    externalDebtChangeYoY: dashboard.fiscal?.externalDebtChangeYoY ?? null,
  });

  const inflation = dashboard.featuredSeries.inflation;
  const dollar = dashboard.featuredSeries.dollar;
  const brecha = dashboard.featuredSeries.brechaCcl;
  const reserves = dashboard.indicators.find((i) => i.slug === "reservas");

  const volatilityMap: VolatilityEntry[] = [
    buildVolatilityEntry("dolar", "Dólar mayorista", dollar),
    buildVolatilityEntry("brecha", "Brecha CCL", brecha),
    buildVolatilityEntry("inflacion", "Inflación mensual", inflation),
    buildVolatilityEntry("blue", "Dólar blue", blue),
    {
      id: "reservas",
      label: "Reservas BCRA",
      volatility30d: reserves?.change30d !== null ? Math.abs(reserves?.change30d ?? 0) : null,
      volatility90d: null,
      level:
        reserves?.change30d != null && Math.abs(reserves.change30d) > 5
          ? "alta"
          : "normal",
      change30d: reserves?.change30d ?? null,
    },
  ];

  return {
    dashboard,
    macroInput,
    ipcMonthlySeries: ipcSeries.ipcMonthly,
    dollarHistories: { oficial, blue, bolsa, ccl },
    volatilityMap,
  };
}

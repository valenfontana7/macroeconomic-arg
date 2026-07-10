import {
  getBrechaCclSeries,
  getCountryRisk,
  getInflacionIndecHistory,
} from "@/lib/argentinadatos-client";
import {
  getCotizaciones,
  getVariableSeries,
} from "@/lib/bcra-client";
import {
  buildContextInsights,
  buildExtendedDigest,
} from "@/lib/context-analysis";
import { getIndecSnapshot, getIndecInflationSeries } from "@/lib/datos-gobar-client";
import { getDollarSnapshot, getForeignQuotes } from "@/lib/dolar-api-client";
import {
  buildFiscalSnapshot,
  getFiscalSeries,
  type FiscalSeriesBundle,
} from "@/lib/fiscal-client";
import {
  FISCAL_INDICATORS,
  type FiscalIndicatorSlug,
} from "@/lib/fiscal-indicators";
import { INDICATORS, type IndicatorSlug } from "@/lib/indicators";
import {
  buildMacroScoreInput,
  calculateMacroScore,
  type MacroScoreResult,
} from "@/lib/macro-score";
import {
  findValueDaysAgo,
  percentChange,
  sliceSeriesByDays,
} from "@/lib/series-utils";
import type {
  ContextInsight,
  CountryRiskSnapshot,
  DollarSnapshot,
  FiscalSnapshot,
  ForeignQuote,
  IndecSnapshot,
} from "@/types/external";
import type { BcraDataPoint } from "@/types/bcra";

export type IndicatorSnapshot = {
  slug: IndicatorSlug;
  label: string;
  unit: string;
  pillar: string;
  description: string;
  impact: string;
  higherIsBetter: boolean;
  latestValue: number;
  latestDate: string;
  change1d: number | null;
  change7d: number | null;
  change30d: number | null;
  sparkline: BcraDataPoint[];
};

export type FiscalIndicatorSnapshot = {
  slug: FiscalIndicatorSlug;
  label: string;
  unit: string;
  description: string;
  impact: string;
  higherIsBetter: boolean;
  latestValue: number;
  latestDate: string;
  change30d: number | null;
  sparkline: BcraDataPoint[];
};

export type DashboardData = {
  fetchedAt: string;
  usdOfficial: number | null;
  usdDate: string | null;
  dollar: DollarSnapshot | null;
  forex: ForeignQuote[];
  indec: IndecSnapshot | null;
  countryRisk: CountryRiskSnapshot | null;
  fiscal: FiscalSnapshot | null;
  indicators: IndicatorSnapshot[];
  fiscalIndicators: FiscalIndicatorSnapshot[];
  macroScore: MacroScoreResult;
  digest: string[];
  insights: ContextInsight[];
  featuredSeries: {
    dollar: BcraDataPoint[];
    inflation: BcraDataPoint[];
    brechaCcl: BcraDataPoint[];
    indecInflationAnnual: BcraDataPoint[];
  };
  partialErrors: string[];
  error?: string;
};

async function fetchIndicatorSnapshot(
  indicator: (typeof INDICATORS)[number],
): Promise<IndicatorSnapshot | null> {
  const desde = new Date();
  desde.setFullYear(desde.getFullYear() - 1);
  const desdeStr = desde.toISOString().slice(0, 10);

  const series = await getVariableSeries(
    indicator.id,
    desdeStr,
    undefined,
    indicator.revalidateSeconds,
  );

  if (series.length === 0) return null;

  const latest = series.at(-1)!;
  const past1 = findValueDaysAgo(series, 1)?.valor;
  const past7 = findValueDaysAgo(series, 7)?.valor;
  const past30 = findValueDaysAgo(series, 30)?.valor;

  return {
    slug: indicator.slug,
    label: indicator.label,
    unit: indicator.unit,
    pillar: indicator.pillar,
    description: indicator.description,
    impact: indicator.impact,
    higherIsBetter: indicator.higherIsBetter ?? false,
    latestValue: latest.valor,
    latestDate: latest.fecha,
    change1d: percentChange(latest.valor, past1),
    change7d: percentChange(latest.valor, past7),
    change30d: percentChange(latest.valor, past30),
    sparkline: sliceSeriesByDays(series, 90),
  };
}

function buildFiscalIndicatorSnapshots(
  fiscal: FiscalSnapshot,
  series: FiscalSeriesBundle,
): FiscalIndicatorSnapshot[] {
  const primarySparkline = series.primaryBalance.slice(-24);
  const financialSparkline = series.financialResult.slice(-12);
  const debtSparkline = series.externalDebt.slice(-12);

  const primaryPrev = primarySparkline.at(-2)?.valor;
  const financialPrev = financialSparkline.at(-2)?.valor;
  const debtPrev = debtSparkline.at(-2)?.valor;

  const configs: FiscalIndicatorSnapshot[] = [];

  if (fiscal.primaryBalanceLatest !== null && fiscal.primaryBalanceDate) {
    configs.push({
      slug: "resultado-primario",
      label: FISCAL_INDICATORS[0].label,
      unit: FISCAL_INDICATORS[0].unit,
      description: FISCAL_INDICATORS[0].description,
      impact: FISCAL_INDICATORS[0].impact,
      higherIsBetter: FISCAL_INDICATORS[0].higherIsBetter,
      latestValue: fiscal.primaryBalanceLatest,
      latestDate: fiscal.primaryBalanceDate,
      change30d: percentChange(fiscal.primaryBalanceLatest, primaryPrev),
      sparkline: primarySparkline,
    });
  }

  if (fiscal.financialResultLatest !== null && fiscal.financialResultDate) {
    configs.push({
      slug: "deficit-financiero",
      label: FISCAL_INDICATORS[1].label,
      unit: FISCAL_INDICATORS[1].unit,
      description: FISCAL_INDICATORS[1].description,
      impact: FISCAL_INDICATORS[1].impact,
      higherIsBetter: FISCAL_INDICATORS[1].higherIsBetter,
      latestValue: fiscal.financialResultLatest,
      latestDate: fiscal.financialResultDate,
      change30d: percentChange(fiscal.financialResultLatest, financialPrev),
      sparkline: financialSparkline,
    });
  }

  if (fiscal.externalDebtUsd !== null && fiscal.externalDebtDate) {
    configs.push({
      slug: "deuda-externa-usd",
      label: FISCAL_INDICATORS[2].label,
      unit: FISCAL_INDICATORS[2].unit,
      description: FISCAL_INDICATORS[2].description,
      impact: FISCAL_INDICATORS[2].impact,
      higherIsBetter: FISCAL_INDICATORS[2].higherIsBetter,
      latestValue: fiscal.externalDebtUsd,
      latestDate: fiscal.externalDebtDate,
      change30d: percentChange(fiscal.externalDebtUsd, debtPrev),
      sparkline: debtSparkline,
    });
  }

  if (fiscal.externalDebtChangeYoY !== null && fiscal.externalDebtDate) {
    configs.push({
      slug: "deuda-externa-yoy",
      label: FISCAL_INDICATORS[3].label,
      unit: FISCAL_INDICATORS[3].unit,
      description: FISCAL_INDICATORS[3].description,
      impact: FISCAL_INDICATORS[3].impact,
      higherIsBetter: FISCAL_INDICATORS[3].higherIsBetter,
      latestValue: fiscal.externalDebtChangeYoY,
      latestDate: fiscal.externalDebtDate,
      change30d: null,
      sparkline: debtSparkline.map((point, index, arr) => {
        if (index < 4) {
          return { fecha: point.fecha, valor: 0 };
        }
        const past = arr[index - 4]?.valor;
        return {
          fecha: point.fecha,
          valor: percentChange(point.valor, past) ?? 0,
        };
      }),
    });
  }

  return configs;
}

async function safe<T>(
  label: string,
  fn: () => Promise<T>,
): Promise<{ data: T | null; error?: string }> {
  try {
    return { data: await fn() };
  } catch (error) {
    return {
      data: null,
      error: `${label}: ${error instanceof Error ? error.message : "error"}`,
    };
  }
}

export async function getDashboardData(): Promise<DashboardData> {
  const partialErrors: string[] = [];

  const [
    indicatorResults,
    cotizacionesResult,
    dollarResult,
    forexResult,
    indecResult,
    countryRiskResult,
    brechaResult,
    indecHistoryResult,
    indecSeriesResult,
    fiscalResult,
  ] = await Promise.all([
    Promise.all(INDICATORS.map((indicator) => fetchIndicatorSnapshot(indicator))),
    safe("BCRA cotizaciones", () => getCotizaciones()),
    safe("DolarAPI", () => getDollarSnapshot()),
    safe("DolarAPI monedas", () => getForeignQuotes()),
    safe("INDEC", () => getIndecSnapshot()),
    safe("Riesgo país", () => getCountryRisk()),
    safe("Brecha CCL", () => getBrechaCclSeries(365)),
    safe("Inflación INDEC histórica", () => getInflacionIndecHistory()),
    safe("INDEC series", () => getIndecInflationSeries()),
    safe("Finanzas públicas", async () => {
      const series = await getFiscalSeries();
      return { series, snapshot: buildFiscalSnapshot(series) };
    }),
  ]);

  for (const result of [
    cotizacionesResult,
    dollarResult,
    forexResult,
    indecResult,
    countryRiskResult,
    brechaResult,
    indecHistoryResult,
    indecSeriesResult,
    fiscalResult,
  ]) {
    if (result.error) partialErrors.push(result.error);
  }

  const indicators = indicatorResults.filter(
    (item): item is IndicatorSnapshot => item !== null,
  );

  const dollarIndicator = indicators.find((item) => item.slug === "tc-mayorista");
  const inflationIndicator = indicators.find((item) => item.slug === "inflacion");
  const reservesIndicator = indicators.find((item) => item.slug === "reservas");
  const badlarIndicator = indicators.find((item) => item.slug === "badlar");

  const desde = new Date();
  desde.setFullYear(desde.getFullYear() - 1);

  let dollarSeries: BcraDataPoint[] = [];
  let inflationSeries: BcraDataPoint[] = [];
  let reservesSeries: BcraDataPoint[] = [];
  let monetarySeries: BcraDataPoint[] = [];
  let badlarSeries: BcraDataPoint[] = [];
  let m2Series: BcraDataPoint[] = [];

  try {
    [dollarSeries, inflationSeries, reservesSeries, monetarySeries, badlarSeries, m2Series] =
      await Promise.all([
        getVariableSeries(5, desde.toISOString().slice(0, 10)),
        getVariableSeries(27, desde.toISOString().slice(0, 10), undefined, 86400),
        getVariableSeries(1, desde.toISOString().slice(0, 10)),
        getVariableSeries(15, desde.toISOString().slice(0, 10)),
        getVariableSeries(7, desde.toISOString().slice(0, 10)),
        getVariableSeries(25, desde.toISOString().slice(0, 10)),
      ]);
  } catch (error) {
    partialErrors.push(
      `BCRA series: ${error instanceof Error ? error.message : "error"}`,
    );
  }

  const indec = indecResult.data;
  const dollar = dollarResult.data;
  const countryRisk = countryRiskResult.data;
  const fiscal = fiscalResult.data?.snapshot ?? null;
  const fiscalSeries = fiscalResult.data?.series;
  const fiscalIndicators =
    fiscal && fiscalSeries ? buildFiscalIndicatorSnapshots(fiscal, fiscalSeries) : [];

  const macroInput = buildMacroScoreInput({
    inflation: inflationSeries,
    reserves: reservesSeries,
    dollar: dollarSeries,
    monetaryBase: monetarySeries,
    badlar: badlarSeries,
    m2: m2Series,
    brechaCclPct: dollar?.brechaCclPct ?? null,
    countryRisk: countryRisk?.valor ?? null,
    inflationAnnual: indec?.ipcAnnual ?? null,
    primaryBalance3m: fiscal?.primaryBalance3m ?? null,
    externalDebtChangeYoY: fiscal?.externalDebtChangeYoY ?? null,
  });

  const macroScore = calculateMacroScore(macroInput);
  const digest = buildExtendedDigest({
    score: macroScore,
    dollarChange7d: dollarIndicator?.change7d ?? null,
    inflationMonthly: indec?.ipcMonthly ?? inflationIndicator?.latestValue ?? null,
    inflationAnnual: indec?.ipcAnnual ?? null,
    reservesChange30d: reservesIndicator?.change30d ?? null,
    brechaCclPct: dollar?.brechaCclPct ?? null,
    countryRisk: countryRisk?.valor ?? null,
    emaeAnnual: indec?.emaeAnnual ?? null,
  });

  const insights = buildContextInsights({
    dollar,
    indec,
    countryRisk,
    fiscal,
    badlar: badlarIndicator?.latestValue ?? null,
    macroScore,
  });

  const cotizaciones = cotizacionesResult.data;
  const usd = cotizaciones?.detalle.find((item) => item.codigoMoneda === "USD");
  const indecHistory = indecHistoryResult.data ?? [];
  const indecSeries = indecSeriesResult.data;
  const hasCoreData = indicators.length > 0 || dollar !== null;

  return {
    fetchedAt: new Date().toISOString(),
    usdOfficial: usd?.tipoCotizacion ?? dollar?.quotes.find((q) => q.casa === "oficial")?.venta ?? null,
    usdDate: cotizaciones?.fecha ?? null,
    dollar,
    forex: forexResult.data ?? [],
    indec,
    countryRisk,
    fiscal,
    indicators,
    fiscalIndicators,
    macroScore,
    digest,
    insights,
    featuredSeries: {
      dollar: dollarSeries,
      inflation: inflationSeries.length > 0 ? inflationSeries : indecHistory.slice(-24),
      brechaCcl: brechaResult.data ?? [],
      indecInflationAnnual: indecSeries?.ipcAnnual ?? [],
    },
    partialErrors,
    error: hasCoreData ? undefined : "No se pudieron cargar datos macro",
  };
}

export async function getIndicatorDetail(slug: IndicatorSlug) {
  const indicator = INDICATORS.find((item) => item.slug === slug);
  if (!indicator) return null;

  const desde = new Date();
  desde.setFullYear(desde.getFullYear() - 2);

  const series = await getVariableSeries(
    indicator.id,
    desde.toISOString().slice(0, 10),
    undefined,
    indicator.revalidateSeconds,
  );

  if (series.length === 0) return null;

  const latest = series.at(-1)!;
  const past7 = findValueDaysAgo(series, 7)?.valor;
  const past30 = findValueDaysAgo(series, 30)?.valor;
  const past365 = findValueDaysAgo(series, 365)?.valor;

  return {
    indicator,
    latestValue: latest.valor,
    latestDate: latest.fecha,
    change7d: percentChange(latest.valor, past7),
    change30d: percentChange(latest.valor, past30),
    change365d: percentChange(latest.valor, past365),
    series,
  };
}

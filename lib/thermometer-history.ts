import { getBrechaCclSeries } from "@/lib/argentinadatos-client";
import { getVariableSeries } from "@/lib/bcra-client";
import { getIndecInflationSeries } from "@/lib/datos-gobar-client";
import {
  calculateMacroScore,
  type MacroMood,
} from "@/lib/macro-score";
import {
  findValueDaysAgoFromDate,
  percentChange,
  sliceSeriesByDaysFromDate,
  sliceSeriesUpTo,
  volatilityPercent,
} from "@/lib/series-utils";
import type { BcraDataPoint } from "@/types/bcra";
import type { MacroScoreInput } from "@/lib/macro-score";

export type ThermometerHistoryPoint = {
  fecha: string;
  score: number;
  mood: MacroMood;
};

function buildMacroScoreInputAtDate(
  endDate: string,
  series: {
    inflation: BcraDataPoint[];
    reserves: BcraDataPoint[];
    dollar: BcraDataPoint[];
    monetaryBase: BcraDataPoint[];
    badlar: BcraDataPoint[];
    brechaCclPct: number | null;
    inflationAnnual: number | null;
  },
): MacroScoreInput {
  const latestInflation = series.inflation.at(-1)?.valor ?? null;
  const latestBadlar = series.badlar.at(-1)?.valor ?? null;
  const annualizedInflation =
    series.inflationAnnual ?? (latestInflation !== null ? latestInflation * 12 : null);
  const badlarRealSpread =
    latestBadlar !== null && annualizedInflation !== null
      ? latestBadlar - annualizedInflation
      : null;

  const reservesNow = series.reserves.at(-1)?.valor;
  const reservesPast = findValueDaysAgoFromDate(series.reserves, 30, endDate)?.valor;
  const dollarSlice = sliceSeriesByDaysFromDate(series.dollar, 30, endDate);
  const monetaryNow = series.monetaryBase.at(-1)?.valor;
  const monetaryPast = findValueDaysAgoFromDate(series.monetaryBase, 30, endDate)?.valor;

  return {
    inflationMonthly: latestInflation,
    reservesChange30d: percentChange(reservesNow ?? 0, reservesPast),
    dollarVolatility30d: volatilityPercent(dollarSlice),
    monetaryBaseChange30d: percentChange(monetaryNow ?? 0, monetaryPast),
    badlarRealSpread,
    brechaCclPct: series.brechaCclPct,
    countryRisk: null,
  };
}

export async function getThermometerHistory(days = 90): Promise<ThermometerHistoryPoint[]> {
  const desde = new Date();
  desde.setFullYear(desde.getFullYear() - 1);
  const desdeStr = desde.toISOString().slice(0, 10);

  const [dollar, inflation, reserves, monetaryBase, badlar, brecha, indecSeries] =
    await Promise.all([
      getVariableSeries(5, desdeStr),
      getVariableSeries(27, desdeStr, undefined, 86400),
      getVariableSeries(1, desdeStr),
      getVariableSeries(15, desdeStr),
      getVariableSeries(7, desdeStr),
      getBrechaCclSeries(365),
      getIndecInflationSeries(),
    ]);

  if (dollar.length === 0) return [];

  const latestDate = dollar.at(-1)!.fecha;
  const sampleDates: string[] = [];

  for (let offset = days; offset >= 0; offset -= 7) {
    const d = new Date(latestDate);
    d.setDate(d.getDate() - offset);
    sampleDates.push(d.toISOString().slice(0, 10));
  }

  const inflationAnnualSeries = indecSeries.ipcAnnual;

  const points: ThermometerHistoryPoint[] = [];

  for (const fecha of sampleDates) {
    const inf = sliceSeriesUpTo(inflation, fecha);
    const res = sliceSeriesUpTo(reserves, fecha);
    const dol = sliceSeriesUpTo(dollar, fecha);
    const mon = sliceSeriesUpTo(monetaryBase, fecha);
    const bad = sliceSeriesUpTo(badlar, fecha);

    if (dol.length < 5) continue;

    const brechaPoint = sliceSeriesUpTo(brecha, fecha).at(-1)?.valor ?? null;
    const annualAt = sliceSeriesUpTo(inflationAnnualSeries, fecha).at(-1)?.valor ?? null;

    const input = buildMacroScoreInputAtDate(fecha, {
      inflation: inf,
      reserves: res,
      dollar: dol,
      monetaryBase: mon,
      badlar: bad,
      brechaCclPct: brechaPoint,
      inflationAnnual: annualAt,
    });

    const result = calculateMacroScore(input);
    points.push({ fecha, score: result.score, mood: result.mood });
  }

  return points;
}
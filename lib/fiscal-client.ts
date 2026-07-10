import { fetchExternalJson } from "@/lib/external-fetch";
import { percentChange } from "@/lib/series-utils";
import {
  datosGobarSeriesResponseSchema,
  type FiscalSnapshot,
} from "@/types/external";
import type { BcraDataPoint } from "@/types/bcra";

const BASE_URL = "https://apis.datos.gob.ar/series/api/series";

export const FISCAL_SERIES = {
  primaryBalanceMonthly: "452.3_RESULTADO_RIO_0_M_18_54",
  financialResultQuarterly: "452.2_RESULTADO_ERO_0_T_20_32",
  externalDebtGovQuarterly: "161.1_TL_DEUDRAL_0_0_28",
} as const;

const COLUMN = {
  primaryBalance: 1,
  financialResult: 2,
  externalDebt: 3,
} as const;

function parseSeries(
  data: (string | number | null)[][],
  columnIndex: number,
): BcraDataPoint[] {
  return data
    .filter((row) => typeof row[columnIndex] === "number")
    .map((row) => ({
      fecha: String(row[0]),
      valor: row[columnIndex] as number,
    }));
}

function latestValue(series: BcraDataPoint[]): { value: number | null; date: string | null } {
  const latest = series.at(-1);
  if (!latest) return { value: null, date: null };
  return { value: latest.valor, date: latest.fecha };
}

export function rollingSumPrimary(series: BcraDataPoint[], months = 3): number | null {
  if (series.length < months) return null;
  return series.slice(-months).reduce((sum, point) => sum + point.valor, 0);
}

export function percentChangeYoY(series: BcraDataPoint[]): number | null {
  if (series.length < 5) return null;
  const latest = series.at(-1)!.valor;
  const past = series.at(-5)?.valor;
  return percentChange(latest, past);
}

export type FiscalSeriesBundle = {
  primaryBalance: BcraDataPoint[];
  financialResult: BcraDataPoint[];
  externalDebt: BcraDataPoint[];
};

export async function getFiscalSeries(): Promise<FiscalSeriesBundle> {
  const response = await fetchExternalJson(
    BASE_URL,
    datosGobarSeriesResponseSchema,
    {
      revalidate: 86400,
      searchParams: {
        ids: [
          FISCAL_SERIES.primaryBalanceMonthly,
          FISCAL_SERIES.financialResultQuarterly,
          FISCAL_SERIES.externalDebtGovQuarterly,
        ].join(","),
        start_date: "2020-01-01",
        limit: 120,
        format: "json",
      },
    },
  );

  return {
    primaryBalance: parseSeries(response.data, COLUMN.primaryBalance),
    financialResult: parseSeries(response.data, COLUMN.financialResult),
    externalDebt: parseSeries(response.data, COLUMN.externalDebt),
  };
}

export function buildFiscalSnapshot(series: FiscalSeriesBundle): FiscalSnapshot {
  const primaryLatest = latestValue(series.primaryBalance);
  const financialLatest = latestValue(series.financialResult);
  const debtLatest = latestValue(series.externalDebt);

  return {
    primaryBalanceLatest: primaryLatest.value,
    primaryBalanceDate: primaryLatest.date,
    primaryBalance3m: rollingSumPrimary(series.primaryBalance, 3),
    financialResultLatest: financialLatest.value,
    financialResultDate: financialLatest.date,
    externalDebtUsd: debtLatest.value,
    externalDebtDate: debtLatest.date,
    externalDebtChangeYoY: percentChangeYoY(series.externalDebt),
  };
}

export async function getFiscalSnapshot(): Promise<FiscalSnapshot> {
  const series = await getFiscalSeries();
  return buildFiscalSnapshot(series);
}

export function isFiscalDataStale(date: string | null, maxAgeMonths = 6): boolean {
  if (!date) return true;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return true;
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - maxAgeMonths);
  return parsed < cutoff;
}

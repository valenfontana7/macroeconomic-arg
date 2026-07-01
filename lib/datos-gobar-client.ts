import { fetchExternalJson } from "@/lib/external-fetch";
import {
  datosGobarSeriesResponseSchema,
  type IndecSnapshot,
} from "@/types/external";

const BASE_URL = "https://apis.datos.gob.ar/series/api/series";

export const INDEC_SERIES = {
  ipcMonthly: "148.3_INIVELNAL_DICI_M_26:percent_change",
  ipcAnnual: "148.3_INIVELNAL_DICI_M_26:percent_change_a_year_ago",
  ipcCore: "103.1_I2N_2016_M_15:percent_change",
  emaeAnnual: "143.3_NO_PR_2004_A_21:percent_change_a_year_ago",
  /** Índice de salarios total (INDEC), variación interanual nominal */
  salaryIndexYoY: "149.1_TL_INDIIOS_OCTU_0_21:percent_change_a_year_ago",
  /** Índice de salarios total, base octubre 2016=100 */
  salaryIndex: "149.1_TL_INDIIOS_OCTU_0_21",
} as const;

const COLUMN = {
  ipcMonthly: 1,
  ipcAnnual: 2,
  ipcCore: 3,
  emaeAnnual: 4,
  salaryIndexYoY: 5,
  salaryIndex: 6,
} as const;

function toPercent(decimal: number | null | undefined): number | null {
  if (decimal === null || decimal === undefined) return null;
  return decimal * 100;
}

function latestRowValue(
  data: (string | number | null)[][],
  columnIndex: number,
  mode: "percent_from_decimal" | "raw" = "percent_from_decimal",
): { value: number | null; date: string | null } {
  for (let i = data.length - 1; i >= 0; i -= 1) {
    const row = data[i];
    const raw = row[columnIndex];
    if (typeof raw !== "number") continue;

    const date = typeof row[0] === "string" ? row[0] : null;
    const value = mode === "percent_from_decimal" ? toPercent(raw) : raw;
    return { value, date };
  }

  return { value: null, date: null };
}

function latestRealSalaryGrowth(
  data: (string | number | null)[][],
): { value: number | null; date: string | null } {
  for (let i = data.length - 1; i >= 0; i -= 1) {
    const row = data[i];
    const salaryYoY = row[COLUMN.salaryIndexYoY];
    const ipcAnnual = row[COLUMN.ipcAnnual];
    if (typeof salaryYoY !== "number" || typeof ipcAnnual !== "number") continue;

    const nominalPct = toPercent(salaryYoY);
    const inflationPct = toPercent(ipcAnnual);
    if (nominalPct === null || inflationPct === null) continue;

    const realPct =
      ((1 + nominalPct / 100) / (1 + inflationPct / 100) - 1) * 100;

    return {
      value: realPct,
      date: typeof row[0] === "string" ? row[0] : null,
    };
  }

  return { value: null, date: null };
}

export async function getIndecSnapshot(): Promise<IndecSnapshot> {
  const response = await fetchExternalJson(
    BASE_URL,
    datosGobarSeriesResponseSchema,
    {
      revalidate: 86400,
      searchParams: {
        ids: [
          INDEC_SERIES.ipcMonthly,
          INDEC_SERIES.ipcAnnual,
          INDEC_SERIES.ipcCore,
          INDEC_SERIES.emaeAnnual,
          INDEC_SERIES.salaryIndexYoY,
          INDEC_SERIES.salaryIndex,
        ].join(","),
        start_date: "2020-01-01",
        limit: 120,
        format: "json",
      },
    },
  );

  const ipcMonthly = latestRowValue(response.data, COLUMN.ipcMonthly);
  const ipcAnnual = latestRowValue(response.data, COLUMN.ipcAnnual);
  const ipcCore = latestRowValue(response.data, COLUMN.ipcCore);
  const emae = latestRowValue(response.data, COLUMN.emaeAnnual);
  const salaryReal = latestRealSalaryGrowth(response.data);
  const salaryIndex = latestRowValue(response.data, COLUMN.salaryIndex, "raw");

  return {
    ipcMonthly: ipcMonthly.value,
    ipcMonthlyDate: ipcMonthly.date,
    ipcAnnual: ipcAnnual.value,
    ipcAnnualDate: ipcAnnual.date,
    ipcCoreMonthly: ipcCore.value,
    ipcCoreDate: ipcCore.date,
    emaeAnnual: emae.value,
    emaeDate: emae.date,
    salaryRealAnnual: salaryReal.value,
    salaryRealDate: salaryReal.date,
    purchasingPowerIndex: salaryIndex.value,
    purchasingPowerDate: salaryIndex.date,
  };
}

export async function getIndecInflationSeries(): Promise<{
  ipcMonthly: { fecha: string; valor: number }[];
  ipcAnnual: { fecha: string; valor: number }[];
}> {
  const response = await fetchExternalJson(
    BASE_URL,
    datosGobarSeriesResponseSchema,
    {
      revalidate: 86400,
      searchParams: {
        ids: `${INDEC_SERIES.ipcMonthly},${INDEC_SERIES.ipcAnnual}`,
        start_date: "2023-01-01",
        limit: 36,
        format: "json",
      },
    },
  );

  return {
    ipcMonthly: response.data.map((row) => ({
      fecha: String(row[0]),
      valor: toPercent(typeof row[1] === "number" ? row[1] : null) ?? 0,
    })),
    ipcAnnual: response.data
      .filter((row) => typeof row[2] === "number")
      .map((row) => ({
        fecha: String(row[0]),
        valor: toPercent(row[2] as number) ?? 0,
      })),
  };
}

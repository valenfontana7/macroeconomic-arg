import type { MacroScoreResult } from "@/lib/macro-score";
import { calculateMacroScore } from "@/lib/macro-score";
import type { MacroScoreInput } from "@/lib/macro-score";

export type PersonalConcern =
  | "inflacion"
  | "dolar"
  | "ahorro"
  | "alquiler"
  | "deuda"
  | "viaje";

export const CONCERN_LABELS: Record<PersonalConcern, string> = {
  inflacion: "Inflación y precios",
  dolar: "Dólar y brecha",
  ahorro: "Ahorro en pesos",
  alquiler: "Alquiler indexado",
  deuda: "Créditos / UVA",
  viaje: "Viajes al exterior",
};

const CONCERN_WEIGHTS: Record<PersonalConcern, Partial<Record<keyof MacroScoreResult["breakdown"], number>>> = {
  inflacion: { inflation: 0.5, monetaryBase: 0.2, badlarReal: 0.15, countryRisk: 0.15 },
  dolar: { brecha: 0.4, dollarVolatility: 0.35, reserves: 0.15, countryRisk: 0.1 },
  ahorro: { badlarReal: 0.45, inflation: 0.35, monetaryBase: 0.2 },
  alquiler: { inflation: 0.5, badlarReal: 0.25, dollarVolatility: 0.15, brecha: 0.1 },
  deuda: { inflation: 0.45, badlarReal: 0.25, dollarVolatility: 0.2, monetaryBase: 0.1 },
  viaje: { brecha: 0.35, dollarVolatility: 0.35, inflation: 0.2, countryRisk: 0.1 },
};

export function calculatePersonalScore(
  breakdown: MacroScoreResult["breakdown"],
  concerns: PersonalConcern[],
): MacroScoreResult {
  if (concerns.length === 0) {
    return calculateMacroScore({
      inflationMonthly: null,
      reservesChange30d: null,
      dollarVolatility30d: null,
      monetaryBaseChange30d: null,
      badlarRealSpread: null,
      brechaCclPct: null,
      countryRisk: null,
    });
  }

  const combined: Record<keyof MacroScoreResult["breakdown"], number> = {
    inflation: 0,
    reserves: 0,
    dollarVolatility: 0,
    monetaryBase: 0,
    badlarReal: 0,
    brecha: 0,
    countryRisk: 0,
  };

  const totals: Record<keyof MacroScoreResult["breakdown"], number> = {
    inflation: 0,
    reserves: 0,
    dollarVolatility: 0,
    monetaryBase: 0,
    badlarReal: 0,
    brecha: 0,
    countryRisk: 0,
  };

  for (const concern of concerns) {
    const weights = CONCERN_WEIGHTS[concern];
    for (const [key, weight] of Object.entries(weights) as [keyof MacroScoreResult["breakdown"], number][]) {
      combined[key] += breakdown[key] * weight;
      totals[key] += weight;
    }
  }

  const keys = Object.keys(combined) as (keyof MacroScoreResult["breakdown"])[];
  let scoreSum = 0;
  let weightSum = 0;
  for (const key of keys) {
    if (totals[key] > 0) {
      scoreSum += combined[key] / totals[key];
      weightSum += 1;
    }
  }

  const score = Math.round(Math.min(100, Math.max(0, scoreSum / Math.max(weightSum, 1))));

  const mood =
    score >= 75 ? "tranquilo" : score >= 55 ? "atento" : score >= 35 ? "turbulento" : "critico";

  return {
    score,
    mood,
    breakdown,
  };
}

export function scenarioScore(
  base: MacroScoreInput,
  overrides: Partial<{
    inflationMonthly: number;
    brechaCclPct: number;
    reservesChange30d: number;
    countryRisk: number;
  }>,
): MacroScoreResult {
  return calculateMacroScore({ ...base, ...overrides });
}

export type SalaryErosionPoint = {
  fecha: string;
  nominal: number;
  real: number;
  cumulativeInflationPct: number;
};

export function computeSalaryErosion(
  initialSalary: number,
  ipcMonthlySeries: { fecha: string; valor: number }[],
  monthsBack: number,
): SalaryErosionPoint[] {
  const series = ipcMonthlySeries.slice(-monthsBack);
  if (series.length === 0) return [];

  let cumulativeFactor = 1;
  const points: SalaryErosionPoint[] = [];

  for (const point of series) {
    const monthlyRate = point.valor / 100;
    cumulativeFactor *= 1 + monthlyRate;
    const real = initialSalary / cumulativeFactor;
    points.push({
      fecha: point.fecha,
      nominal: initialSalary,
      real,
      cumulativeInflationPct: (cumulativeFactor - 1) * 100,
    });
  }

  return points;
}

export function findDollarOnDate(
  series: { fecha: string; valor: number }[],
  dateStr: string,
): number | null {
  const target = new Date(dateStr).getTime();
  let closest: { fecha: string; valor: number } | null = null;
  let diff = Infinity;
  for (const point of series) {
    const d = Math.abs(new Date(point.fecha).getTime() - target);
    if (d < diff) {
      diff = d;
      closest = point;
    }
  }
  if (diff > 7 * 24 * 60 * 60 * 1000) return null;
  return closest?.valor ?? null;
}

import {
  findValueDaysAgo,
  percentChange,
  sliceSeriesByDays,
  volatilityPercent,
} from "@/lib/series-utils";
import type { BcraDataPoint } from "@/types/bcra";

export type MacroMood = "tranquilo" | "atento" | "turbulento" | "critico";

export type MacroScoreInput = {
  inflationMonthly: number | null;
  reservesChange30d: number | null;
  dollarVolatility30d: number | null;
  monetaryBaseChange30d: number | null;
  badlarRealSpread: number | null;
  brechaCclPct: number | null;
  countryRisk: number | null;
};

export type MacroScoreResult = {
  score: number;
  mood: MacroMood;
  breakdown: {
    inflation: number;
    reserves: number;
    dollarVolatility: number;
    monetaryBase: number;
    badlarReal: number;
    brecha: number;
    countryRisk: number;
  };
};

const WEIGHTS = {
  inflation: 0.22,
  reserves: 0.18,
  dollarVolatility: 0.15,
  monetaryBase: 0.12,
  badlarReal: 0.08,
  brecha: 0.15,
  countryRisk: 0.1,
} as const;

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

function scoreInflation(value: number | null): number {
  if (value === null) return 50;
  if (value < 3) return 90;
  if (value < 4.5) return 70;
  if (value < 6) return 45;
  if (value < 8) return 25;
  return 10;
}

function scoreReservesChange(value: number | null): number {
  if (value === null) return 50;
  if (value > 5) return 95;
  if (value > 1) return 75;
  if (value > -1) return 55;
  if (value > -5) return 35;
  return 15;
}

function scoreDollarVolatility(value: number | null): number {
  if (value === null) return 50;
  if (value < 0.5) return 90;
  if (value < 1.5) return 70;
  if (value < 3) return 45;
  if (value < 5) return 25;
  return 10;
}

function scoreMonetaryBaseChange(value: number | null): number {
  if (value === null) return 50;
  if (value < 2) return 85;
  if (value < 5) return 65;
  if (value < 8) return 40;
  if (value < 12) return 25;
  return 10;
}

function scoreBadlarReal(spread: number | null): number {
  if (spread === null) return 50;
  if (spread > 5) return 90;
  if (spread > 0) return 70;
  if (spread > -5) return 45;
  if (spread > -10) return 25;
  return 10;
}

function scoreBrecha(pct: number | null): number {
  if (pct === null) return 50;
  if (pct < 8) return 90;
  if (pct < 15) return 70;
  if (pct < 25) return 45;
  if (pct < 40) return 25;
  return 10;
}

function scoreCountryRisk(value: number | null): number {
  if (value === null) return 50;
  if (value < 500) return 90;
  if (value < 800) return 70;
  if (value < 1200) return 45;
  if (value < 1800) return 25;
  return 10;
}

function moodFromScore(score: number): MacroMood {
  if (score >= 75) return "tranquilo";
  if (score >= 55) return "atento";
  if (score >= 35) return "turbulento";
  return "critico";
}

export const MOOD_LABELS: Record<MacroMood, string> = {
  tranquilo: "Tranquilo",
  atento: "Atento",
  turbulento: "Turbulento",
  critico: "Crítico",
};

export const MOOD_EMOJI: Record<MacroMood, string> = {
  tranquilo: "😌",
  atento: "👀",
  turbulento: "🌪️",
  critico: "🚨",
};

export function calculateMacroScore(input: MacroScoreInput): MacroScoreResult {
  const breakdown = {
    inflation: scoreInflation(input.inflationMonthly),
    reserves: scoreReservesChange(input.reservesChange30d),
    dollarVolatility: scoreDollarVolatility(input.dollarVolatility30d),
    monetaryBase: scoreMonetaryBaseChange(input.monetaryBaseChange30d),
    badlarReal: scoreBadlarReal(input.badlarRealSpread),
    brecha: scoreBrecha(input.brechaCclPct),
    countryRisk: scoreCountryRisk(input.countryRisk),
  };

  const score = clamp(
    breakdown.inflation * WEIGHTS.inflation +
      breakdown.reserves * WEIGHTS.reserves +
      breakdown.dollarVolatility * WEIGHTS.dollarVolatility +
      breakdown.monetaryBase * WEIGHTS.monetaryBase +
      breakdown.badlarReal * WEIGHTS.badlarReal +
      breakdown.brecha * WEIGHTS.brecha +
      breakdown.countryRisk * WEIGHTS.countryRisk,
  );

  return {
    score: Math.round(score),
    mood: moodFromScore(score),
    breakdown,
  };
}

export function buildMacroScoreInput(series: {
  inflation: BcraDataPoint[];
  reserves: BcraDataPoint[];
  dollar: BcraDataPoint[];
  monetaryBase: BcraDataPoint[];
  badlar: BcraDataPoint[];
  brechaCclPct?: number | null;
  countryRisk?: number | null;
  inflationAnnual?: number | null;
}): MacroScoreInput {
  const latestInflation = series.inflation.at(-1)?.valor ?? null;
  const latestBadlar = series.badlar.at(-1)?.valor ?? null;
  const annualizedInflation =
    series.inflationAnnual ?? (latestInflation !== null ? latestInflation * 12 : null);
  const badlarRealSpread =
    latestBadlar !== null && annualizedInflation !== null
      ? latestBadlar - annualizedInflation
      : null;

  const reservesNow = series.reserves.at(-1)?.valor;
  const reservesPast = findValueDaysAgo(series.reserves, 30)?.valor;
  const dollarSlice = sliceSeriesByDays(series.dollar, 30);
  const monetaryNow = series.monetaryBase.at(-1)?.valor;
  const monetaryPast = findValueDaysAgo(series.monetaryBase, 30)?.valor;

  return {
    inflationMonthly: latestInflation,
    reservesChange30d: percentChange(reservesNow ?? 0, reservesPast),
    dollarVolatility30d: volatilityPercent(dollarSlice),
    monetaryBaseChange30d: percentChange(monetaryNow ?? 0, monetaryPast),
    badlarRealSpread,
    brechaCclPct: series.brechaCclPct ?? null,
    countryRisk: series.countryRisk ?? null,
  };
}

export type DigestInput = {
  score: MacroScoreResult;
  dollarChange7d: number | null;
  inflationMonthly: number | null;
  reservesChange30d: number | null;
};

export function buildWeeklyDigest(input: DigestInput): string[] {
  const lines: string[] = [];
  const { score, dollarChange7d, inflationMonthly, reservesChange30d } = input;

  lines.push(
    `Hoy el termómetro marca ${MOOD_LABELS[score.mood]} (${score.score}/100).`,
  );

  if (dollarChange7d !== null) {
    const direction = dollarChange7d > 0 ? "subió" : dollarChange7d < 0 ? "bajó" : "se mantuvo";
    lines.push(
      `El dólar mayorista ${direction} ${Math.abs(dollarChange7d).toFixed(1)}% en la última semana.`,
    );
  }

  if (inflationMonthly !== null) {
    lines.push(`La inflación del último mes fue ${inflationMonthly.toFixed(1)}%.`);
  }

  if (reservesChange30d !== null) {
    const reservesTrend =
      reservesChange30d > 1
        ? "subieron"
        : reservesChange30d < -1
          ? "bajaron"
          : "se mantuvieron relativamente estables";
    lines.push(`Las reservas ${reservesTrend} en el último mes.`);
  }

  switch (score.mood) {
    case "tranquilo":
      lines.push(
        "En simple: el panorama macro da señales de calma, pero conviene seguir el ritmo de precios y del dólar.",
      );
      break;
    case "atento":
      lines.push(
        "En simple: conviene estar atento al tipo de cambio y no subestimar la inflación al fijar precios o gastos.",
      );
      break;
    case "turbulento":
      lines.push(
        "En simple: hay varias señales de tensión. Si podés, evitá decisiones apuradas y priorizá cobertura ante inflación.",
      );
      break;
    case "critico":
      lines.push(
        "En simple: el entorno macro está bajo presión fuerte. Revisá gastos, cobertura cambiaria y plazos de ahorro con cuidado.",
      );
      break;
    default: {
      const _exhaustive: never = score.mood;
      return _exhaustive;
    }
  }

  return lines;
}

export type SignalLevel = "good" | "warning" | "danger";

export function signalFromChange(
  change: number | null,
  higherIsBetter: boolean,
): SignalLevel {
  if (change === null) return "warning";

  const effective = higherIsBetter ? change : -change;

  if (effective > 1) return "good";
  if (effective > -1) return "warning";
  return "danger";
}

export function signalFromInflation(value: number | null): SignalLevel {
  if (value === null) return "warning";
  if (value < 3) return "good";
  if (value < 6) return "warning";
  return "danger";
}

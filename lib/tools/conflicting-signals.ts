import type { MacroScoreResult } from "@/lib/macro-score";
import type { SignalTension } from "@/lib/tools/types";

const SIGNAL_LABELS: Record<keyof MacroScoreResult["breakdown"], string> = {
  inflation: "Inflación",
  reserves: "Reservas",
  dollarVolatility: "Volatilidad del dólar",
  monetaryBase: "Base monetaria",
  badlarReal: "BADLAR real",
  brecha: "Brecha CCL",
  countryRisk: "Riesgo país",
  fiscalBalance: "Resultado primario",
  externalDebt: "Deuda externa",
  m2Growth: "M2 privado",
};

export function analyzeConflictingSignals(
  breakdown: MacroScoreResult["breakdown"],
): SignalTension[] {
  const entries = (
    Object.entries(breakdown) as [keyof MacroScoreResult["breakdown"], number][]
  ).map(([key, score]) => ({
    key,
    label: SIGNAL_LABELS[key],
    score,
  }));

  const good = entries.filter((e) => e.score >= 70).sort((a, b) => b.score - a.score);
  const bad = entries.filter((e) => e.score < 45).sort((a, b) => a.score - b.score);

  const tensions: SignalTension[] = [];

  if (good.length > 0 && bad.length > 0) {
    const best = good[0];
    const worst = bad[0];
    tensions.push({
      id: `${best.key}-${worst.key}`,
      positive: { label: best.label, score: best.score },
      negative: { label: worst.label, score: worst.score },
      summary: `Hoy ${best.label.toLowerCase()} se ve favorable (${best.score}/100), pero ${worst.label.toLowerCase()} preocupa (${worst.score}/100). La macro te manda señales mixtas.`,
    });
  }

  if (good.length >= 2 && bad.length >= 1) {
    const second = good[1];
    const worst = bad[0];
    if (second.key !== good[0].key) {
      tensions.push({
        id: `${second.key}-${worst.key}-2`,
        positive: { label: second.label, score: second.score },
        negative: { label: worst.label, score: worst.score },
        summary: `${second.label} acompaña la calma, mientras ${worst.label.toLowerCase()} sigue en zona tensa.`,
      });
    }
  }

  const spread = Math.max(...entries.map((e) => e.score)) - Math.min(...entries.map((e) => e.score));
  if (spread >= 50 && tensions.length === 0) {
    const best = entries.reduce((a, b) => (a.score > b.score ? a : b));
    const worst = entries.reduce((a, b) => (a.score < b.score ? a : b));
    tensions.push({
      id: "wide-spread",
      positive: { label: best.label, score: best.score },
      negative: { label: worst.label, score: worst.score },
      summary: `Hay una brecha de ${spread} puntos entre la mejor y la peor señal. No es un panorama uniforme.`,
    });
  }

  if (tensions.length === 0) {
    const avg = entries.reduce((s, e) => s + e.score, 0) / entries.length;
    if (avg >= 60) {
      tensions.push({
        id: "aligned-good",
        positive: { label: "Panorama general", score: Math.round(avg) },
        negative: { label: "Tensiones fuertes", score: 0 },
        summary: "Las señales apuntan mayormente en la misma dirección: relativamente favorables.",
      });
    } else if (avg < 45) {
      tensions.push({
        id: "aligned-bad",
        positive: { label: "Alguna excepción", score: Math.max(...entries.map((e) => e.score)) },
        negative: { label: "Panorama general", score: Math.round(avg) },
        summary: "La mayoría de las señales están bajo presión. Pocas variables dan respiro.",
      });
    } else {
      tensions.push({
        id: "neutral",
        positive: { label: "Señales moderadas", score: Math.round(avg) },
        negative: { label: "Extremos", score: 0 },
        summary: "No hay choques fuertes hoy, pero tampoco tranquilidad total. Zona de atención.",
      });
    }
  }

  return tensions.slice(0, 3);
}

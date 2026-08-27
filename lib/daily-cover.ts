import type { DashboardData } from "@/lib/dashboard-data";
import { formatDate, formatPercent } from "@/lib/format";
import { MOOD_LABELS } from "@/lib/macro-score";

export type DailyCoverSection = {
  heading: string;
  paragraphs: string[];
};

export type DailyCover = {
  title: string;
  dateIso: string;
  dateLabel: string;
  description: string;
  sections: DailyCoverSection[];
  wordCount: number;
};

function countWords(text: string): number {
  return text.trim().split(/\s+/).length;
}

/**
 * Construye la tapa del día (300–500 palabras aprox) con 3 secciones fijas:
 * - Qué se movió (hechos con cambios recientes)
 * - Por qué importa el bolsillo (efectos concretos)
 * - Qué haría yo esta semana (decisiones prácticas; no es asesoramiento)
 *
 * Reutiliza digest, insights y variaciones de indicadores ya presentes.
 */
export function buildDailyCover(data: DashboardData): DailyCover {
  const { macroScore, digest, dollar, indec, indicators } = data;

  const inflation = indicators.find((i) => i.slug === "inflacion");
  const dollarWholesale = indicators.find((i) => i.slug === "tc-mayorista");
  const reserves = indicators.find((i) => i.slug === "reservas");
  const badlar = indicators.find((i) => i.slug === "badlar");

  const brechaLabel =
    dollar?.brechaCclPct != null ? `${dollar.brechaCclPct.toFixed(1)}%` : null;

  // 1) Qué se movió: priorizamos cambios disponibles (1d/7d/30d) y el termómetro
  const movedLines: string[] = [];
  movedLines.push(
    `El termómetro marca ${MOOD_LABELS[macroScore.mood].toLowerCase()} (${macroScore.score}/100).`,
  );
  if (dollarWholesale?.change7d != null) {
    const dir = dollarWholesale.change7d > 0 ? "subió" : dollarWholesale.change7d < 0 ? "bajó" : "se mantuvo";
    movedLines.push(
      `El dólar mayorista ${dir} ${Math.abs(dollarWholesale.change7d).toFixed(1)}% en 7 días.`,
    );
  }
  if (brechaLabel) {
    movedLines.push(`La brecha CCL/oficial está en ${brechaLabel}.`);
  }
  if (inflation) {
    if (inflation.change30d != null) {
      const sign = inflation.change30d > 0 ? "aceleró" : inflation.change30d < 0 ? "aflojó" : "se mantuvo";
      movedLines.push(
        `La serie de inflación ${sign} respecto a 30 días (${formatPercent(Math.abs(inflation.change30d), 1)}).`,
      );
    } else if (indec?.ipcMonthly != null) {
      movedLines.push(`La inflación mensual del INDEC ronda ${indec.ipcMonthly.toFixed(1)}%.`);
    }
  } else if (indec?.ipcMonthly != null) {
    movedLines.push(`La inflación mensual del INDEC ronda ${indec.ipcMonthly.toFixed(1)}%.`);
  }
  if (reserves?.change30d != null) {
    const resTrend =
      reserves.change30d > 1 ? "subieron" : reserves.change30d < -1 ? "bajaron" : "están estables";
    movedLines.push(`Las reservas del BCRA ${resTrend} en el último mes.`);
  }

  // Si el digest tiene líneas útiles, agregamos 1–2 para color y contexto
  for (const line of digest) {
    if (movedLines.length >= 5) break;
    if (!/En simple:/.test(line)) {
      movedLines.push(line);
    }
  }

  const movedParagraph = movedLines.join(" ");

  // 2) Por qué importa el bolsillo: usamos señales ya calculadas en data.insights
  const pocketSignals = data.insights.filter((i) =>
    ["precios", "salarios", "ahorro"].includes(i.category),
  );
  const pocketParagraphs: string[] = [];
  if (pocketSignals.length > 0) {
    const top = pocketSignals.slice(0, 2);
    pocketParagraphs.push(
      top.map((i) => `${i.title}. ${i.body}`).join(" "),
    );
  } else {
    // Fallback breve y concreto
    if (indec?.ipcAnnual != null) {
      pocketParagraphs.push(
        `Con ${indec.ipcAnnual.toFixed(1)}% interanual, la inflación guía paritarias y alquileres. `,
      );
    }
    if (badlar?.latestValue != null && indec?.ipcAnnual != null) {
      const spread = badlar.latestValue - indec.ipcAnnual;
      pocketParagraphs.push(
        spread >= 0
          ? `La BADLAR (${badlar.latestValue.toFixed(1)}%) le gana a la inflación: los pesos a tasa fija protegen algo mejor el poder de compra.`
          : `La BADLAR (${badlar.latestValue.toFixed(1)}%) pierde contra la inflación: ahorrar en pesos a tasa fija probablemente quede corto.`,
      );
    }
  }

  // 3) Qué haría yo esta semana: reglas simples según el humor del score
  const actions: string[] = [];
  switch (macroScore.mood) {
    case "tranquilo":
      actions.push(
        "Revisar precios grandes (alquiler, colegio, prepaga) con referencia de IPC y ajustar presupuesto.",
      );
      actions.push(
        "Si tenés gastos en USD, fijá alertas de brecha para cubrirte sin apuros.",
      );
      actions.push(
        "Comparar tasas en pesos contra inflación esperada antes de inmovilizar liquidez.",
      );
      break;
    case "atento":
      actions.push(
        "Evitar decisiones apuradas en dólar o deuda: priorizar liquidez y escalonar movimientos.",
      );
      actions.push(
        "Actualizar proyección de gastos del mes con IPC y mirar variación del mayorista.",
      );
      actions.push(
        "Si cobrás esta semana, separar un margen para gastos imprevistos o subas reguladas.",
      );
      break;
    case "turbulento":
      actions.push(
        "Patear compromisos grandes unos días; si necesitás dolarizar, hacelo por tramos.",
      );
      actions.push(
        "Acotar compras financiadas en pesos si la tasa real es muy negativa.",
      );
      actions.push(
        "Monitorear la brecha CCL/oficial y reservas antes de mover ahorros.",
      );
      break;
    case "critico":
      actions.push(
        "Postergar decisiones no urgentes. Mantener caja y reducir exposición a shocks.",
      );
      actions.push(
        "Si tenés pagos en USD, planificá coberturas cortas y revisalas seguido.",
      );
      actions.push(
        "Evitar endeudarte en tasas variables hasta ver señales de alivio.",
      );
      break;
    default: {
      const _exhaustive: never = macroScore.mood;
      return _exhaustive;
    }
  }
  const actionsParagraph = actions.slice(0, 3).join(" ");

  const sections: DailyCoverSection[] = [
    { heading: "Qué se movió", paragraphs: [movedParagraph] },
    { heading: "Por qué importa el bolsillo", paragraphs: pocketParagraphs },
    { heading: "Qué haría yo esta semana", paragraphs: [actionsParagraph] },
  ];

  const allText = sections.flatMap((s) => s.paragraphs).join(" ");
  const wordCount = countWords(allText);

  const dateIso = data.fetchedAt;
  const dateLabel = formatDate(dateIso);

  // Título y descripción para SEO/teaser
  const title = `Hoy en la economía — ${MOOD_LABELS[macroScore.mood]} (${macroScore.score}/100)`;
  const description = [
    `Termómetro ${macroScore.score}/100.`,
    brechaLabel ? `Brecha CCL ${brechaLabel}.` : null,
    indec?.ipcMonthly != null
      ? `Inflación INDEC ${indec.ipcMonthly.toFixed(1)}% mensual.`
      : null,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    title,
    dateIso,
    dateLabel,
    description,
    sections,
    wordCount,
  };
}


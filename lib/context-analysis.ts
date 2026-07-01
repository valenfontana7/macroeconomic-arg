import { MOOD_LABELS, type MacroScoreResult } from "@/lib/macro-score";
import type {
  ContextInsight,
  CountryRiskSnapshot,
  DollarSnapshot,
  IndecSnapshot,
} from "@/types/external";

type BuildInsightsInput = {
  dollar: DollarSnapshot | null;
  indec: IndecSnapshot | null;
  countryRisk: CountryRiskSnapshot | null;
  badlar: number | null;
  macroScore: MacroScoreResult;
};

function brechaLevel(pct: number | null): "baja" | "media" | "alta" | null {
  if (pct === null) return null;
  if (pct < 10) return "baja";
  if (pct < 25) return "media";
  return "alta";
}

export function buildContextInsights(input: BuildInsightsInput): ContextInsight[] {
  const insights: ContextInsight[] = [];
  const { dollar, indec, countryRisk, badlar, macroScore } = input;

  if (dollar?.brechaCclPct !== null && dollar?.brechaCclPct !== undefined) {
    const level = brechaLevel(dollar.brechaCclPct);
    if (level === "alta") {
      insights.push({
        id: "brecha-alta",
        title: "Brecha cambiaria amplia",
        body: `El CCL cotiza ${dollar.brechaCclPct.toFixed(1)}% por encima del oficial. Eso suele reflejar presión para dolarizarse y puede anticipar ajustes o mayor volatilidad.`,
        level: "alert",
        category: "cambio",
      });
    } else if (level === "media") {
      insights.push({
        id: "brecha-media",
        title: "Brecha cambiaria en zona media",
        body: `La brecha CCL/oficial ronda el ${dollar.brechaCclPct.toFixed(1)}%. No es extrema, pero conviene monitorearla si tenés gastos en dólares o ahorro afuera.`,
        level: "warning",
        category: "cambio",
      });
    } else if (level === "baja") {
      insights.push({
        id: "brecha-baja",
        title: "Brecha cambiaria contenida",
        body: `La brecha entre CCL y oficial está por debajo del 10%. Es una señal de relativa calma en el mercado cambiario paralelo.`,
        level: "info",
        category: "cambio",
      });
    }
  }

  if (indec?.ipcAnnual !== null && indec?.ipcAnnual !== undefined) {
    if (indec.ipcAnnual > 100) {
      insights.push({
        id: "inflacion-muy-alta",
        title: "Inflación interanual muy elevada",
        body: `El INDEC marca ${indec.ipcAnnual.toFixed(1)}% interanual. A esa velocidad, los precios se duplican en poco más de un año si no frena.`,
        level: "alert",
        category: "precios",
      });
    } else if (indec.ipcAnnual > 50) {
      insights.push({
        id: "inflacion-alta",
        title: "Inflación interanual alta",
        body: `La inflación interanual del INDEC es ${indec.ipcAnnual.toFixed(1)}%. Para el bolsillo, es clave actualizar presupuestos y negociar ajustes con esa referencia.`,
        level: "warning",
        category: "precios",
      });
    } else if (indec.ipcAnnual < 30) {
      insights.push({
        id: "inflacion-moderada",
        title: "Inflación en desaceleración relativa",
        body: `Con ${indec.ipcAnnual.toFixed(1)}% interanual, la inflación sigue alta en términos históricos pero muestra una senda menos agresiva.`,
        level: "info",
        category: "precios",
      });
    }
  }

  if (
    indec?.ipcCoreMonthly != null &&
    indec?.ipcMonthly != null &&
    indec.ipcCoreMonthly < indec.ipcMonthly - 0.5
  ) {
    insights.push({
      id: "ipc-nucleo-menor",
      title: "Inflación de base más contenida",
      body: `El IPC núcleo (${indec.ipcCoreMonthly.toFixed(1)}%) está por debajo del IPC general (${indec.ipcMonthly.toFixed(1)}%). Los aumentos de precios regulados o estacionales podrían estar empujando más que la tendencia de fondo.`,
      level: "info",
      category: "precios",
    });
  }

  if (indec?.emaeAnnual !== null && indec?.emaeAnnual !== undefined) {
    if (indec.emaeAnnual < 0) {
      insights.push({
        id: "emae-negativo",
        title: "Actividad económica en contracción",
        body: `El EMAE cae ${Math.abs(indec.emaeAnnual).toFixed(1)}% interanual. Menos actividad suele traducirse en menor empleo y menor dinamismo del consumo.`,
        level: "warning",
        category: "actividad",
      });
    } else if (indec.emaeAnnual > 3) {
      insights.push({
        id: "emae-positivo",
        title: "Economía en expansión",
        body: `El EMAE crece ${indec.emaeAnnual.toFixed(1)}% interanual. Hay más producción y consumo, aunque conviene mirar si eso viene con presión inflacionaria.`,
        level: "info",
        category: "actividad",
      });
    }
  }

  if (countryRisk) {
    if (countryRisk.valor > 1500) {
      insights.push({
        id: "riesgo-pais-alto",
        title: "Riesgo país elevado",
        body: `El EMBI ronda ${countryRisk.valor} puntos básicos. Los inversores externos piden un premio alto por riesgo argentino, lo que encarece el financiamiento del país.`,
        level: "alert",
        category: "externo",
      });
    } else if (countryRisk.valor > 800) {
      insights.push({
        id: "riesgo-pais-medio",
        title: "Riesgo país en zona de tensión",
        body: `Con ${countryRisk.valor} pb de riesgo país, el mercado todavía desconfía del escenario externo. Suele correlacionar con volatilidad cambiaria.`,
        level: "warning",
        category: "externo",
      });
    } else if (countryRisk.valor < 500) {
      insights.push({
        id: "riesgo-pais-bajo",
        title: "Riesgo país relativamente contenido",
        body: `El EMBI en ${countryRisk.valor} pb sugiere menor prima de riesgo que en episodios de crisis. No elimina la volatilidad, pero es una señal más favorable.`,
        level: "info",
        category: "externo",
      });
    }
  }

  if (badlar !== null && indec?.ipcAnnual != null && indec.ipcAnnual > 0) {
    const spread = badlar - indec.ipcAnnual;
    if (spread < -10) {
      insights.push({
        id: "tasa-real-negativa",
        title: "Plazo fijo pierde contra inflación",
        body: `La BADLAR (${badlar.toFixed(1)}%) está muy por debajo de la inflación interanual (${indec.ipcAnnual.toFixed(1)}%). Ahorrar en pesos a tasa fija probablemente reduzca tu poder adquisitivo real.`,
        level: "warning",
        category: "ahorro",
      });
    } else if (spread > 5) {
      insights.push({
        id: "tasa-real-positiva",
        title: "Tasas le ganan a la inflación",
        body: `La BADLAR supera la inflación interanual por ${spread.toFixed(1)} puntos. Es una ventana favorable para instrumentos en pesos que ajusten a esa tasa.`,
        level: "info",
        category: "ahorro",
      });
    }
  }

  if (indec?.salaryRealAnnual != null) {
    if (indec.salaryRealAnnual < -2) {
      insights.push({
        id: "salario-pierde-inflacion",
        title: "Salarios pierden poder de compra",
        body: `El salario real total cayó ${Math.abs(indec.salaryRealAnnual).toFixed(1)}% interanual (índice de salarios descontando inflación). En términos reales, los salarios compran menos que hace un año.`,
        level: "warning",
        category: "salarios",
      });
    } else if (indec.salaryRealAnnual > 2) {
      insights.push({
        id: "salario-gana-inflacion",
        title: "Recuperación de salario real",
        body: `El salario real total subió ${indec.salaryRealAnnual.toFixed(1)}% interanual. Los salarios le ganaron a la inflación en el último año.`,
        level: "info",
        category: "salarios",
      });
    }
  }

  if (macroScore.mood === "critico" || macroScore.mood === "turbulento") {
    insights.push({
      id: "pulso-debil",
      title: "Pulso macro bajo presión",
      body: "Varias señales (precios, cambio, liquidez o tasas reales) apuntan a un entorno exigente. Para decisiones grandes (alquiler, dólar, deuda), tomate unos días extra de análisis.",
      level: macroScore.mood === "critico" ? "alert" : "warning",
      category: "externo",
    });
  }

  return insights.slice(0, 8);
}

export type ExtendedDigestInput = {
  score: MacroScoreResult;
  dollarChange7d: number | null;
  inflationMonthly: number | null;
  inflationAnnual: number | null;
  reservesChange30d: number | null;
  brechaCclPct: number | null;
  countryRisk: number | null;
  emaeAnnual: number | null;
};

export function buildExtendedDigest(input: ExtendedDigestInput): string[] {
  const lines: string[] = [];
  const {
    score,
    dollarChange7d,
    inflationMonthly,
    inflationAnnual,
    reservesChange30d,
    brechaCclPct,
    countryRisk,
    emaeAnnual,
  } = input;

  lines.push(
    `Hoy el pulso macro está en ${MOOD_LABELS[score.mood]} (${score.score}/100).`,
  );

  if (dollarChange7d !== null) {
    const direction =
      dollarChange7d > 0 ? "subió" : dollarChange7d < 0 ? "bajó" : "se mantuvo";
    lines.push(
      `El dólar mayorista ${direction} ${Math.abs(dollarChange7d).toFixed(1)}% en la última semana.`,
    );
  }

  if (brechaCclPct !== null) {
    lines.push(`La brecha CCL/oficial está en ${brechaCclPct.toFixed(1)}%.`);
  }

  if (inflationMonthly !== null) {
    lines.push(`La inflación mensual (INDEC/BCRA) ronda el ${inflationMonthly.toFixed(1)}%.`);
  }

  if (inflationAnnual !== null) {
    lines.push(`En doce meses, los precios subieron ${inflationAnnual.toFixed(1)}% (INDEC).`);
  }

  if (emaeAnnual !== null) {
    const verb = emaeAnnual >= 0 ? "creció" : "cayó";
    lines.push(`La actividad económica (EMAE) ${verb} ${Math.abs(emaeAnnual).toFixed(1)}% interanual.`);
  }

  if (reservesChange30d !== null) {
    const reservesTrend =
      reservesChange30d > 1
        ? "subieron"
        : reservesChange30d < -1
          ? "bajaron"
          : "se mantuvieron relativamente estables";
    lines.push(`Las reservas del BCRA ${reservesTrend} en el último mes.`);
  }

  if (countryRisk !== null) {
    lines.push(`El riesgo país (EMBI) está en ${countryRisk} puntos básicos.`);
  }

  switch (score.mood) {
    case "tranquilo":
      lines.push(
        "En criollo: hay señales de calma relativa, pero en Argentina conviene revisar precios y dólar cada semana.",
      );
      break;
    case "atento":
      lines.push(
        "En criollo: no es momento de ignorar el macro. Actualizá expectativas de gasto y cobertura cambiaria.",
      );
      break;
    case "turbulento":
      lines.push(
        "En criollo: varias variables apuntan a tensión. Evitá decisiones apuradas y priorizá liquidez.",
      );
      break;
    case "critico":
      lines.push(
        "En criollo: el entorno está exigente. Si podés, postergá compromisos grandes hasta tener más claridad.",
      );
      break;
    default: {
      const _exhaustive: never = score.mood;
      return _exhaustive;
    }
  }

  return lines;
}

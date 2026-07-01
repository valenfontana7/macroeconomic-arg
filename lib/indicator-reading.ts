import type { IndicatorSlug } from "@/lib/indicators";
import { signalFromChange, signalFromInflation, type SignalLevel } from "@/lib/macro-score";

export type IndicatorReading = {
  label: string;
  explanation: string;
  signal: SignalLevel;
};

function reading(
  label: string,
  explanation: string,
  signal: SignalLevel,
): IndicatorReading {
  return { label, explanation, signal };
}

export function interpretIndicator(
  slug: IndicatorSlug,
  value: number,
  change30d: number | null,
): IndicatorReading {
  switch (slug) {
    case "inflacion": {
      const signal = signalFromInflation(value);
      if (value < 3) {
        return reading(
          "Inflación moderada",
          `Hoy ${value.toFixed(1)}% mensual. Está en una zona razonable, aunque en Argentina conviene seguirla de cerca.`,
          signal,
        );
      }
      if (value < 6) {
        return reading(
          "Inflación elevada",
          `Hoy ${value.toFixed(1)}% mensual. Los precios siguen subiendo fuerte: ajustá expectativas de gasto y cobertura.`,
          signal,
        );
      }
      return reading(
        "Inflación muy alta",
        `Hoy ${value.toFixed(1)}% mensual. Es un ritmo preocupante que erosiona rápido el poder de compra.`,
        signal,
      );
    }
    case "reservas": {
      const signal = signalFromChange(change30d, true);
      if (change30d !== null && change30d > 1) {
        return reading(
          "Reservas en alza",
          `Las reservas subieron ${change30d.toFixed(1)}% en 30 días. Es una señal de mayor colchón cambiario.`,
          signal,
        );
      }
      if (change30d !== null && change30d < -1) {
        return reading(
          "Reservas en baja",
          `Las reservas bajaron ${Math.abs(change30d).toFixed(1)}% en 30 días. Conviene estar atento al dólar.`,
          signal,
        );
      }
      return reading(
        "Reservas estables",
        `Nivel actual: ${value.toLocaleString("es-AR")} millones USD. Sin movimientos bruscos recientes.`,
        signal,
      );
    }
    case "tc-mayorista":
    case "tc-minorista": {
      const signal = signalFromChange(change30d, false);
      if (change30d !== null && change30d > 3) {
        return reading(
          "Dólar en suba",
          `Subió ${change30d.toFixed(1)}% en 30 días. Puede trasladarse a precios con algo de demora.`,
          signal,
        );
      }
      if (change30d !== null && change30d < -1) {
        return reading(
          "Dólar en baja",
          `Bajó ${Math.abs(change30d).toFixed(1)}% en 30 días. Da algo más de respiro cambiario.`,
          signal,
        );
      }
      return reading(
        "Dólar relativamente estable",
        `Cotización actual $ ${value.toLocaleString("es-AR")}. Sin saltos fuertes en el último mes.`,
        signal,
      );
    }
    case "badlar": {
      const signal = signalFromChange(change30d, true);
      return reading(
        "Tasa de plazo fijo",
        `BADLAR en ${value.toFixed(1)}% anual. Comparala siempre con la inflación del período para saber si ganás en pesos reales.`,
        signal,
      );
    }
    case "prestamos-personales": {
      const signal = signalFromChange(change30d, false);
      if (value > 60) {
        return reading(
          "Crédito muy caro",
          `Tasa en ${value.toFixed(1)}% anual. Pedir un préstamo personal sale caro en este contexto.`,
          signal,
        );
      }
      return reading(
        "Costo del crédito",
        `Tasa en ${value.toFixed(1)}% anual. Evaluá alternativas antes de financiarte.`,
        signal,
      );
    }
    case "m2-privado": {
      const signal = signalFromChange(change30d, false);
      if (value > 30) {
        return reading(
          "Mucha liquidez",
          `M2 privado crece ${value.toFixed(1)}% interanual. Puede presionar precios si no hay más producción.`,
          signal,
        );
      }
      return reading(
        "Liquidez en la economía",
        `Variación interanual del ${value.toFixed(1)}%. Miralo junto con inflación y actividad.`,
        signal,
      );
    }
    case "base-monetaria": {
      const signal = signalFromChange(change30d, false);
      return reading(
        "Emisión monetaria base",
        `Base monetaria de ${value.toLocaleString("es-AR")} millones de pesos. Un crecimiento acelerado puede anticipar inflación.`,
        signal,
      );
    }
    case "cer":
    case "uva": {
      const signal = signalFromChange(change30d, false);
      return reading(
        slug === "cer" ? "Índice CER" : "Valor UVA",
        `Nivel actual ${value.toLocaleString("es-AR")}. Sube con la inflación: impacta cuotas y ajustes indexados.`,
        signal,
      );
    }
    default: {
      const _exhaustive: never = slug;
      return _exhaustive;
    }
  }
}

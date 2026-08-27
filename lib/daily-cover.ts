import type { DashboardData } from "@/lib/dashboard-data";
import { MOOD_LABELS } from "@/lib/macro-score";

export type DailyCoverSection = {
  heading: string;
  paragraphs: string[];
};

export type DailyCover = {
  title: string;
  dek: string | null;
  updatedAt: string;
  sections: DailyCoverSection[];
};

function quoteVenta(
  data: DashboardData,
  casa: "oficial" | "blue" | "bolsa" | "contadoconliqui",
): number | null {
  const q = data.dollar?.quotes.find((x) => x.casa === casa);
  return q?.venta ?? null;
}

function formatPeso(value: number | null): string {
  return value != null ? `$${value.toLocaleString("es-AR")}` : "—";
}

function buildTitle(data: DashboardData): string {
  const brecha =
    data.dollar?.brechaCclPct != null
      ? `${data.dollar.brechaCclPct.toFixed(1)}%`
      : null;
  const oficial = quoteVenta(data, "oficial");

  if (brecha && oficial != null) {
    return `El día en los mercados: brecha CCL ${brecha} y oficial ${formatPeso(oficial)}`;
  }
  if (brecha) {
    return `El día en los mercados: brecha CCL ${brecha}`;
  }
  if (oficial != null) {
    return `El día en los mercados: oficial ${formatPeso(oficial)}`;
  }
  return "El día en los mercados";
}

function buildDek(data: DashboardData): string | null {
  if (data.digest.length > 0) return data.digest[0]!;
  const { score, mood } = data.macroScore;
  return `El termómetro macro marca ${score}/100, en zona “${MOOD_LABELS[mood]}”.`;
}

function buildQueSeMovio(data: DashboardData): DailyCoverSection | null {
  const paragraphs: string[] = [];

  // Resumen breve de dólar
  if (data.dollar) {
    const oficial = formatPeso(quoteVenta(data, "oficial"));
    const blue = formatPeso(quoteVenta(data, "blue"));
    const mep = formatPeso(quoteVenta(data, "bolsa"));
    const ccl = formatPeso(quoteVenta(data, "contadoconliqui"));
    paragraphs.push(`Dólar oficial: ${oficial}. Blue: ${blue}. MEP: ${mep}. CCL: ${ccl}.`);

    if (data.dollar.brechaCclPct != null) {
      paragraphs.push(
        `La brecha CCL/oficial ronda el ${data.dollar.brechaCclPct.toFixed(
          1,
        )}%. Es la vara de tensión cambiaria fuera del canal oficial.`,
      );
    }
    if (data.dollar.brechaBluePct != null) {
      paragraphs.push(
        `La brecha blue/oficial está en ${data.dollar.brechaBluePct.toFixed(
          1,
        )}%.`,
      );
    }
  }

  // Señal de termómetro
  if (data.macroScore) {
    const { score, mood } = data.macroScore;
    paragraphs.push(
      `El termómetro macro marca ${score}/100 (“${MOOD_LABELS[mood]}”). Resume inflación, reservas, brecha, tasas y riesgo país en un único número.`,
    );
  }

  return paragraphs.length > 0
    ? { heading: "Qué se movió", paragraphs }
    : null;
}

function buildBolsillo(data: DashboardData): DailyCoverSection | null {
  const paragraphs: string[] = [];
  const inflation = data.indec?.ipcAnnual ?? null;
  const inflationMonthly = data.indec?.ipcMonthly ?? null;
  const badlar = data.indicators.find((i) => i.slug === "badlar")?.latestValue ?? null;
  const salaryReal = data.indec?.salaryRealAnnual ?? null;

  if (inflationMonthly != null) {
    paragraphs.push(
      `El IPC mensual fue ${inflationMonthly.toFixed(1)}%. El ritmo de precios reciente condiciona paritarias y alquileres.`,
    );
  }
  if (inflation != null) {
    paragraphs.push(
      `En 12 meses los precios subieron ${inflation.toFixed(
        1,
      )}%. Es la referencia para medir poder de compra en el año.`,
    );
  }
  if (badlar != null && inflation != null) {
    const spread = badlar - inflation;
    paragraphs.push(
      spread >= 0
        ? `La BADLAR (${badlar.toFixed(
            1,
          )}%) supera la inflación interanual por ${spread.toFixed(
            1,
          )} puntos: los plazos fijos, en promedio, empatan o ganan al precio general.`
        : `La BADLAR (${badlar.toFixed(
            1,
          )}%) queda ${Math.abs(spread).toFixed(
            1,
          )} puntos debajo de la inflación: ahorrar en pesos pierde poder de compra.`,
    );
  }
  if (salaryReal != null) {
    const verb = salaryReal >= 0 ? "subió" : "cayó";
    paragraphs.push(
      `El salario real ${verb} ${Math.abs(salaryReal).toFixed(
        1,
      )}% interanual (descontando inflación).`,
    );
  }

  return paragraphs.length > 0
    ? { heading: "Para el bolsillo", paragraphs }
    : null;
}

export function buildDailyCover(data: DashboardData): DailyCover {
  const sections: DailyCoverSection[] = [];
  const que = buildQueSeMovio(data);
  if (que) sections.push(que);
  const bolsillo = buildBolsillo(data);
  if (bolsillo) sections.push(bolsillo);

  return {
    title: buildTitle(data),
    dek: buildDek(data),
    updatedAt: data.fetchedAt,
    sections,
  };
}


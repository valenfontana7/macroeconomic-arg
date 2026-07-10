import type { DashboardData } from "@/lib/dashboard-data";
import { interpretIndicator } from "@/lib/indicator-reading";
import { MOOD_LABELS, type MacroScoreResult } from "@/lib/macro-score";
import type { ContextInsight } from "@/types/external";

export type BriefingScope = "home" | "dolar" | "inflacion" | "indicadores" | "full";

export type MacroBriefingSection = {
  heading: string;
  paragraphs: string[];
};

export type MacroBriefing = {
  title: string;
  updatedAt: string;
  scope: BriefingScope;
  sections: MacroBriefingSection[];
  faq?: { q: string; a: string }[];
};

const SCOPE_INTROS: Record<BriefingScope, string[]> = {
  full: [
    "Este pulso macro resume el estado de la economía argentina con datos oficiales y de mercado. No reemplaza informes del BCRA o INDEC: los interpreta en lenguaje claro para decisiones del día a día.",
    "Cada párrafo combina números recientes con reglas editoriales fijas. Si una fuente no responde, mostramos lo disponible y avisamos qué falta.",
  ],
  home: [
    "La Brecha integra cotizaciones, inflación e indicadores del BCRA en un solo tablero. Este texto contextualiza los números del dashboard: qué mirar primero y por qué importa para tu bolsillo.",
    "El termómetro macro (0–100) resume diez señales con pesos transparentes. No es una predicción: es un atajo para ordenar la lectura cuando hay mucha información suelta.",
  ],
  dolar: [
    "En Argentina conviven varios tipos de cambio: oficial, blue, MEP y CCL. Esta página muestra cotizaciones en tiempo casi real, pero el valor editorial está en explicar cómo se relacionan entre sí y qué dice la brecha sobre la tensión cambiaria.",
    "Una brecha alta no siempre implica un salto inmediato del oficial, pero suele reflejar presión para dolarizarse. Por eso cruzamos el CCL con reservas, inflación y riesgo país.",
  ],
  inflacion: [
    "La inflación del INDEC es la referencia oficial para ajustes salariales, alquileres y expectativas de precios. Acá mostramos IPC mensual e interanual, pero también comparamos con la BADLAR para ver si ahorrar en pesos gana o pierde contra los precios.",
    "La inflación mensual mide el ritmo reciente; la interanual captura la tendencia de doce meses. Las dos pueden divergir cuando hay picos estacionales o cambios en tarifas reguladas.",
  ],
  indicadores: [
    "Los indicadores monetarios y externos del BCRA son la columna vertebral del tablero macro. Reservas, base monetaria, tasas y crédito cuentan cuánto margen tiene el país para enfrentar shocks cambiarios o de precios.",
    "Cada serie tiene periodicidad distinta: algunas se actualizan a diario, otras con rezago. Por eso mostramos fecha de última observación y variaciones a 30 días para comparar en el mismo horizonte.",
  ],
};

const FALLBACK_SECTION: MacroBriefingSection = {
  heading: "Lectura sin datos en vivo",
  paragraphs: [
    "En este momento no pudimos cargar todas las fuentes. Igual podés consultar el glosario en Aprendé para entender reservas, brecha cambiaria, IPC o BADLAR mientras se restablecen las APIs.",
    "Los datos provienen del BCRA, INDEC y proveedores de mercado. Cuando vuelvan a estar disponibles, este texto se actualizará automáticamente con las cifras del día.",
  ],
};

const CATEGORY_BY_SCOPE: Record<
  Exclude<BriefingScope, "full" | "home">,
  Set<ContextInsight["category"]>
> = {
  dolar: new Set(["cambio", "externo"]),
  inflacion: new Set(["precios", "salarios", "ahorro"]),
  indicadores: new Set(["fiscal", "actividad", "externo", "ahorro", "precios"]),
};

function buildThermometerSection(score: MacroScoreResult): MacroBriefingSection {
  const weakSignals = (
    Object.entries(score.breakdown) as [string, number][]
  )
    .filter(([, value]) => value < 45)
    .slice(0, 3)
    .map(([key]) => key);

  const signalSummary =
    weakSignals.length > 0 ? weakSignals.join(", ") : null;

  const paragraphs = [
    `El termómetro macro marca ${score.score} puntos sobre 100, en zona "${MOOD_LABELS[score.mood]}". Combina inflación, reservas, brecha CCL, base monetaria, BADLAR real, riesgo país, resultado fiscal y M2 privado con pesos fijos publicados en Acerca.`,
    signalSummary
      ? `Las componentes más débiles hoy: ${signalSummary}. Cuando varias se deterioran a la vez, conviene postergar decisiones grandes (dólar, deuda, alquiler) unos días y releer el contexto.`
      : "Ninguna componente individual está en zona crítica, pero el score global igual puede estar en alerta si varias variables empujan en la misma dirección.",
    "El score no reemplaza análisis profesional: ordena la mirada. Si tenés dudas sobre un indicador puntual, el glosario Aprendé explica cada concepto con ejemplos cotidianos.",
  ];

  return { heading: "Qué significa el termómetro hoy", paragraphs };
}

function buildDigestSection(digest: string[]): MacroBriefingSection {
  return {
    heading: "Resumen ejecutivo",
    paragraphs:
      digest.length > 0
        ? digest
        : [
            "Hoy no hay suficientes datos para un resumen automático. Revisá las cotizaciones y el glosario mientras se actualizan las fuentes.",
          ],
  };
}

function buildInsightsSection(
  insights: ContextInsight[],
  heading: string,
): MacroBriefingSection | null {
  if (insights.length === 0) return null;

  return {
    heading,
    paragraphs: insights.map((insight) => `${insight.title}. ${insight.body}`),
  };
}

function buildIndicatorReadingsSection(data: DashboardData): MacroBriefingSection | null {
  const slugs = ["inflacion", "reservas", "tc-mayorista", "badlar"] as const;
  const paragraphs: string[] = [];

  for (const slug of slugs) {
    const snap = data.indicators.find((i) => i.slug === slug);
    if (!snap) continue;
    const reading = interpretIndicator(slug, snap.latestValue, snap.change30d);
    paragraphs.push(`${reading.label}: ${reading.explanation}`);
  }

  if (paragraphs.length === 0) return null;

  return {
    heading: "Lectura de indicadores clave",
    paragraphs,
  };
}

function quoteVenta(dollar: NonNullable<DashboardData["dollar"]>, casa: string): number | null {
  return dollar.quotes.find((q) => q.casa === casa)?.venta ?? null;
}

function buildDollarContextSection(data: DashboardData): MacroBriefingSection | null {
  const { dollar } = data;
  if (!dollar) return null;

  const oficial = quoteVenta(dollar, "oficial");
  const blue = quoteVenta(dollar, "blue");
  const mep = quoteVenta(dollar, "bolsa");
  const ccl = quoteVenta(dollar, "contadoconliqui");

  const formatQuote = (value: number | null) =>
    value != null ? `$${value.toLocaleString("es-AR")}` : "—";

  const paragraphs: string[] = [
    `Dólar oficial: ${formatQuote(oficial)}. Blue: ${formatQuote(blue)}. MEP: ${formatQuote(mep)}. CCL: ${formatQuote(ccl)}.`,
  ];

  if (dollar.brechaCclPct != null) {
    paragraphs.push(
      `La brecha entre CCL y oficial ronda el ${dollar.brechaCclPct.toFixed(1)}%. Es uno de los termómetros más seguidos del mercado paralelo porque refleja cuánto "extra" piden por dolarizarse fuera del canal oficial.`,
    );
  }

  if (dollar.brechaBluePct != null) {
    paragraphs.push(
      `La brecha blue/oficial está en ${dollar.brechaBluePct.toFixed(1)}%. El blue suele moverse con expectativas políticas y restricciones cambiarias, no solo con la cotización del día.`,
    );
  }

  paragraphs.push(
    "Para simular cuánto habrías ganado o perdido dolarizando en distintos momentos, probá la herramienta de dolarización histórica. Para entender cada tipo de dólar, el glosario tiene entradas dedicadas.",
  );

  return { heading: "Mercado cambiario hoy", paragraphs };
}

function buildInflationContextSection(data: DashboardData): MacroBriefingSection | null {
  const { indec } = data;
  const inflation = data.indicators.find((i) => i.slug === "inflacion");
  const badlar = data.indicators.find((i) => i.slug === "badlar");

  if (!indec && !inflation) return null;

  const paragraphs: string[] = [];

  if (indec?.ipcMonthly != null) {
    paragraphs.push(
      `El IPC mensual del INDEC fue ${indec.ipcMonthly.toFixed(1)}%. Es la variación promedio de precios respecto al mes anterior y suele mover expectativas de ajustes salariales y tarifas.`,
    );
  }

  if (indec?.ipcAnnual != null) {
    paragraphs.push(
      `En doce meses los precios subieron ${indec.ipcAnnual.toFixed(1)}% (interanual). Esa cifra resume la pérdida de poder adquisitivo acumulada del peso en el último año.`,
    );
  }

  if (indec?.ipcCoreMonthly != null && indec?.ipcMonthly != null) {
    paragraphs.push(
      `El IPC núcleo (${indec.ipcCoreMonthly.toFixed(1)}%) mide la inflación sin precios regulados ni estacionales. Compararlo con el IPC general (${indec.ipcMonthly.toFixed(1)}%) ayuda a ver si el problema es de fondo o de componentes puntuales.`,
    );
  }

  if (badlar && indec?.ipcAnnual != null) {
    const spread = badlar.latestValue - indec.ipcAnnual;
    paragraphs.push(
      spread >= 0
        ? `La BADLAR (${badlar.latestValue.toFixed(1)}%) supera la inflación interanual por ${spread.toFixed(1)} puntos: los plazos fijos en pesos, en promedio, están protegiendo algo el poder de compra.`
        : `La BADLAR (${badlar.latestValue.toFixed(1)}%) está ${Math.abs(spread).toFixed(1)} puntos por debajo de la inflación interanual: ahorrar en pesos a tasa fija probablemente pierda contra los precios.`,
    );
  }

  if (indec?.salaryRealAnnual != null) {
    const verb = indec.salaryRealAnnual >= 0 ? "subió" : "cayó";
    paragraphs.push(
      `El salario real total ${verb} ${Math.abs(indec.salaryRealAnnual).toFixed(1)}% interanual (descontando inflación). Es la prueba de si los ingresos le ganaron o no a los precios.`,
    );
  }

  return paragraphs.length > 0
    ? { heading: "Precios y poder de compra", paragraphs }
    : null;
}

function filterInsightsForScope(
  insights: ContextInsight[],
  scope: BriefingScope,
): ContextInsight[] {
  if (scope === "full" || scope === "home") return insights;
  const allowed = CATEGORY_BY_SCOPE[scope];
  return insights.filter((i) => allowed.has(i.category));
}

function scopeTitle(scope: BriefingScope, mood: MacroScoreResult["mood"]): string {
  switch (scope) {
    case "full":
      return `Pulso macro de hoy — ${MOOD_LABELS[mood]}`;
    case "home":
      return "Contexto del dashboard";
    case "dolar":
      return "Contexto del mercado cambiario";
    case "inflacion":
      return "Contexto de inflación y precios";
    case "indicadores":
      return "Contexto de indicadores BCRA";
    default: {
      const _exhaustive: never = scope;
      return _exhaustive;
    }
  }
}

export function buildMacroBriefing(
  data: DashboardData,
  scope: BriefingScope = "full",
): MacroBriefing {
  const sections: MacroBriefingSection[] = [
    {
      heading: scope === "full" ? "Introducción" : "Sobre esta sección",
      paragraphs: SCOPE_INTROS[scope],
    },
    buildDigestSection(data.digest),
    buildThermometerSection(data.macroScore),
  ];

  if (scope === "full" || scope === "home" || scope === "dolar") {
    const dollarSection = buildDollarContextSection(data);
    if (dollarSection) sections.push(dollarSection);
  }

  if (scope === "full" || scope === "home" || scope === "inflacion") {
    const inflationSection = buildInflationContextSection(data);
    if (inflationSection) sections.push(inflationSection);
  }

  if (scope === "full" || scope === "home" || scope === "indicadores") {
    const readings = buildIndicatorReadingsSection(data);
    if (readings) sections.push(readings);
  }

  const filteredInsights = filterInsightsForScope(data.insights, scope);
  const insightsSection = buildInsightsSection(
    filteredInsights,
    scope === "full" ? "Señales del día" : "Señales relevantes",
  );
  if (insightsSection) sections.push(insightsSection);

  if (data.partialErrors.length > 0 || data.error) {
    sections.push({
      heading: "Fuentes parciales",
      paragraphs: [
        "Algunas series no se pudieron cargar en esta actualización. Los párrafos anteriores usan solo datos disponibles.",
        data.error ?? data.partialErrors.join(" "),
      ],
    });
  }

  const hasLiveData =
    data.dollar != null || data.indec != null || data.indicators.length > 0;

  if (!hasLiveData) {
    sections.push(FALLBACK_SECTION);
  }

  const closing: MacroBriefingSection = {
    heading: "Cómo usar esta información",
    paragraphs: [
      "Estos textos se actualizan con cada refresco de datos (cada 15 a 60 minutos según la página). No constituyen asesoramiento financiero.",
      "Para profundizar, visitá el glosario Aprendé, las guías temáticas o las herramientas interactivas del sitio. Si encontrás un error, reportalo desde Contacto.",
    ],
  };
  sections.push(closing);

  return {
    title: scopeTitle(scope, data.macroScore.mood),
    updatedAt: data.fetchedAt,
    scope,
    sections,
  };
}

export function countBriefingWords(briefing: MacroBriefing): number {
  return briefing.sections.reduce(
    (total, section) =>
      total +
      section.paragraphs.reduce(
        (sectionTotal, paragraph) => sectionTotal + paragraph.split(/\s+/).length,
        0,
      ),
    0,
  );
}

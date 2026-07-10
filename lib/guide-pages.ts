import { getConceptBySlug, type MacroConcept } from "@/lib/macro-education";

export type GuidePageConfig = {
  slug: string;
  title: string;
  description: string;
  intro: string[];
  conceptSlugs: string[];
};

export const GUIDE_PAGES: GuidePageConfig[] = [
  {
    slug: "dolar",
    title: "Guía del dólar en Argentina",
    description:
      "Tipos de cambio oficial, blue, MEP y CCL explicados en simple, con brecha cambiaria y riesgo país.",
    intro: [
      "Argentina convive con múltiples cotizaciones del dólar. Esta guía reúne los conceptos esenciales para entender qué significa cada una, por qué aparecen brechas y cómo leerlas sin jerga de mercado.",
      "Los textos son originales de La Brecha y se apoyan en datos del BCRA y fuentes de mercado. No reemplazan asesoramiento financiero: te ayudan a interpretar lo que ves en el tablero.",
    ],
    conceptSlugs: [
      "dolar-oficial",
      "tc-mayorista",
      "tc-minorista",
      "brecha-ccl",
      "brecha-blue",
      "brecha-mep",
      "riesgo-pais",
    ],
  },
  {
    slug: "inflacion",
    title: "Guía de inflación en Argentina",
    description:
      "IPC mensual e interanual del INDEC, núcleo, salario real y poder adquisitivo explicados paso a paso.",
    intro: [
      "La inflación argentina afecta sueldos, alquileres y ahorro en pesos. Acá reunimos cómo leer el IPC del INDEC, qué diferencia hay entre inflación mensual e interanual y por qué importa comparar con la BADLAR.",
      "Cada sección traduce un indicador oficial a decisiones concretas: negociar un ajuste, elegir un plazo fijo o entender si tu sueldo le ganó a los precios.",
    ],
    conceptSlugs: [
      "inflacion",
      "ipc-interanual",
      "ipc-nucleo",
      "badlar",
      "salario-real",
      "poder-adquisitivo",
    ],
  },
  {
    slug: "indicadores-bcra",
    title: "Guía de indicadores del BCRA",
    description:
      "Reservas, base monetaria, M2, CER, UVA y tasas: qué mira el Banco Central y cómo leerlo.",
    intro: [
      "El BCRA publica series diarias y mensuales que explican la política monetaria y cambiaria. Esta guía ordena los indicadores más consultados y cómo se conectan entre sí.",
      "Si recién empezás a seguir la macro, leé cada concepto en orden: reservas y tipo de cambio primero, luego inflación y variables monetarias.",
    ],
    conceptSlugs: [
      "reservas",
      "base-monetaria",
      "m2-privado",
      "cer",
      "uva",
      "prestamos-personales",
      "termometro-macro",
      "senal-semaforo",
    ],
  },
];

export function getGuideBySlug(slug: string): GuidePageConfig | undefined {
  return GUIDE_PAGES.find((guide) => guide.slug === slug);
}

export function getGuideConcepts(slugs: string[]): MacroConcept[] {
  return slugs
    .map((conceptSlug) => getConceptBySlug(conceptSlug))
    .filter((concept): concept is MacroConcept => concept != null);
}

export function countGuideWords(guide: GuidePageConfig, concepts: MacroConcept[]): number {
  const texts = [
    ...guide.intro,
    ...concepts.flatMap((c) => [
      c.enCristiano,
      c.paraQueSirve,
      c.comoLeerlo,
      c.enTuVida,
      c.analogia ?? "",
      c.erroresComunes ?? "",
    ]),
  ];
  return texts.join(" ").split(/\s+/).filter(Boolean).length;
}

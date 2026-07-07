import type { ToolDefinition, ToolSlug } from "@/lib/tools/types";

export const TOOLS: ToolDefinition[] = [
  {
    slug: "pulso-del-dia",
    title: "La brecha de hoy",
    tagline: "Tu resumen compartible del día",
    description:
      "Tres frases claras, el termómetro y los números clave — listos para WhatsApp.",
    emoji: "📲",
    impactOrder: 1,
  },
  {
    slug: "sueldo-vs-inflacion",
    title: "Tu sueldo vs la inflación",
    tagline: "¿Cuánto se achicó tu plata?",
    description:
      "Ingresá un sueldo de hace meses y mirá mes a mes cómo la inflación lo erosionó.",
    emoji: "💸",
    impactOrder: 2,
  },
  {
    slug: "arbol-decisiones",
    title: "¿Qué mirar según tu situación?",
    tagline: "Árbol de decisiones",
    description:
      "Respondé 3 preguntas y te armamos un panel con solo lo que te importa.",
    emoji: "🧭",
    impactOrder: 3,
  },
  {
    slug: "senales-contradictorias",
    title: "Señales contradictorias",
    tagline: "Cuando la macro no se pone de acuerdo",
    description:
      "Detectamos cuando inflación, dólar, reservas y salarios tiran en direcciones opuestas.",
    emoji: "⚡",
    impactOrder: 4,
  },
  {
    slug: "termometro-personal",
    title: "Termómetro de tu bolsillo",
    tagline: "El macro aplicado a vos",
    description:
      "Elegí qué te importa (alquiler, dólar, plazo fijo…) y obtené tu score personal.",
    emoji: "🎯",
    impactOrder: 5,
  },
  {
    slug: "dolarizacion-historica",
    title: "Si hubieras dolarizado…",
    tagline: "Simulador histórico",
    description:
      "Elegí una fecha y un monto: mirá cuánto valdría hoy en cada tipo de dólar.",
    emoji: "🕰️",
    impactOrder: 6,
  },
  {
    slug: "modo-viajero",
    title: "Modo viajero",
    tagline: "¿Cuánto cuesta tu viaje ahora?",
    description:
      "Brasil, Chile, Uruguay o Europa: cotización de hoy comparada con la de hace un mes.",
    emoji: "✈️",
    impactOrder: 7,
  },
  {
    slug: "sandbox-escenarios",
    title: "¿Qué pasa si…?",
    tagline: "Sandbox de escenarios",
    description:
      "Mové inflación y brecha con sliders y mirá cómo cambia el termómetro macro.",
    emoji: "🎛️",
    impactOrder: 8,
  },
  {
    slug: "mapa-incertidumbre",
    title: "Mapa de incertidumbre",
    tagline: "¿Este mes es más loco de lo normal?",
    description:
      "Volatilidad de dólar, brecha, inflación y más — comparada con su propio histórico.",
    emoji: "🌡️",
    impactOrder: 9,
  },
  {
    slug: "linea-de-tiempo",
    title: "Línea de tiempo macro",
    tagline: "Historia argentina con datos",
    description:
      "Hitos desde 2001 hasta hoy: qué pasó y qué indicadores se movieron.",
    emoji: "📜",
    impactOrder: 10,
  },
];

export const TOOL_BY_SLUG = Object.fromEntries(
  TOOLS.map((tool) => [tool.slug, tool]),
) as Record<ToolSlug, ToolDefinition>;

export function getToolSlugs(): ToolSlug[] {
  return TOOLS.sort((a, b) => a.impactOrder - b.impactOrder).map((t) => t.slug);
}

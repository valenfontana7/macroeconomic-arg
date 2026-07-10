import { ALL_CONCEPTS } from "@/lib/macro-education";
import { INDICATORS } from "@/lib/indicators";
import { TOOLS } from "@/lib/tools/registry";

export type SearchGroup = "Páginas" | "Indicadores" | "Aprendé" | "Herramientas";

export type SearchItem = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  group: SearchGroup;
  keywords: string[];
};

const STATIC_PAGES: SearchItem[] = [
  {
    id: "home",
    title: "Dashboard",
    subtitle: "Resumen del día",
    href: "/",
    group: "Páginas",
    keywords: ["inicio", "home", "hoy", "termómetro"],
  },
  {
    id: "dolar",
    title: "Dólar",
    subtitle: "Cotizaciones y brechas",
    href: "/dolar",
    group: "Páginas",
    keywords: ["blue", "mep", "ccl", "oficial", "cotización"],
  },
  {
    id: "inflacion",
    title: "Inflación",
    subtitle: "IPC mensual e interanual",
    href: "/inflacion",
    group: "Páginas",
    keywords: ["ipc", "indec", "precios"],
  },
  {
    id: "indicadores",
    title: "Indicadores",
    subtitle: "Todas las series BCRA",
    href: "/indicadores",
    group: "Páginas",
    keywords: ["reservas", "badlar", "bcra"],
  },
  {
    id: "herramientas",
    title: "Herramientas",
    subtitle: "Simuladores interactivos",
    href: "/herramientas",
    group: "Páginas",
    keywords: ["simulador", "calculadora"],
  },
  {
    id: "aprende",
    title: "Aprendé",
    subtitle: "Glosario de economía",
    href: "/aprende",
    group: "Páginas",
    keywords: ["conceptos", "educación", "glosario"],
  },
  {
    id: "calendario",
    title: "Calendario macro",
    subtitle: "Publicaciones INDEC y BCRA",
    href: "/calendario",
    group: "Páginas",
    keywords: ["ipc", "emae", "rem", "fechas"],
  },
  {
    id: "digest",
    title: "Digest por email",
    subtitle: "Recibí el resumen en tu correo",
    href: "/digest",
    group: "Páginas",
    keywords: ["newsletter", "suscribir", "email"],
  },
  {
    id: "citar",
    title: "Citar e insertar",
    subtitle: "Para medios y blogs",
    href: "/citar",
    group: "Páginas",
    keywords: ["embed", "iframe", "fuente", "citar"],
  },
  {
    id: "finanzas-publicas",
    title: "Finanzas públicas",
    subtitle: "Resultado fiscal y deuda externa",
    href: "/finanzas-publicas",
    group: "Páginas",
    keywords: ["fiscal", "déficit", "deuda", "imig", "mecon"],
  },
  {
    id: "novedades",
    title: "Novedades",
    subtitle: "Cambios de metodología y fuentes",
    href: "/novedades",
    group: "Páginas",
    keywords: ["changelog", "actualizaciones", "metodología"],
  },
];

function buildIndex(): SearchItem[] {
  const indicators: SearchItem[] = INDICATORS.map((item) => ({
    id: `ind-${item.slug}`,
    title: item.label,
    subtitle: item.description,
    href: `/indicador/${item.slug}`,
    group: "Indicadores",
    keywords: [item.slug, item.pillar, item.unit, item.label.toLowerCase()],
  }));

  const concepts: SearchItem[] = ALL_CONCEPTS.map((concept) => ({
    id: `concept-${concept.slug}`,
    title: concept.title,
    subtitle: concept.enCristiano,
    href: `/aprende/${concept.slug}`,
    group: "Aprendé",
    keywords: [concept.slug, concept.category, concept.title.toLowerCase()],
  }));

  const tools: SearchItem[] = TOOLS.map((tool) => ({
    id: `tool-${tool.slug}`,
    title: tool.title,
    subtitle: tool.tagline,
    href: `/herramientas/${tool.slug}`,
    group: "Herramientas",
    keywords: [tool.slug, tool.title.toLowerCase(), tool.tagline.toLowerCase()],
  }));

  return [...STATIC_PAGES, ...indicators, ...concepts, ...tools];
}

const SEARCH_INDEX = buildIndex();

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function scoreItem(item: SearchItem, query: string): number {
  const q = normalize(query);
  const title = normalize(item.title);
  const subtitle = normalize(item.subtitle);
  const keywords = item.keywords.map(normalize);

  if (title === q) return 100;
  if (title.startsWith(q)) return 80;
  if (title.includes(q)) return 60;
  if (keywords.some((k) => k.startsWith(q))) return 50;
  if (keywords.some((k) => k.includes(q))) return 40;
  if (subtitle.includes(q)) return 30;
  return 0;
}

export function searchItems(query: string, limit = 12): SearchItem[] {
  const trimmed = query.trim();
  if (trimmed.length === 0) {
    return SEARCH_INDEX.filter((item) =>
      ["home", "dolar", "inflacion", "herramientas", "aprende"].includes(item.id),
    ).slice(0, limit);
  }

  return SEARCH_INDEX.map((item) => ({ item, score: scoreItem(item, trimmed) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}

export function getAllSearchItems(): SearchItem[] {
  return SEARCH_INDEX;
}

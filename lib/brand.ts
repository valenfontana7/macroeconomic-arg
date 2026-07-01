export const BRAND_NAME = "La Brecha";

export const BRAND_TAGLINE = "Entre el oficial y el paralelo";

export const BRAND_DESCRIPTION =
  "Dólar, inflación y macro argentina en criollo. Datos del BCRA, INDEC y mercado para entender la brecha y tu bolsillo.";

export const BRAND_OG_DESCRIPTION =
  "El dólar, la inflación y la macro argentina explicados en criollo, con datos oficiales.";

/** Colores de marca: oficial (BCRA) vs paralelo (mercado). */
export const BRAND_COLORS = {
  oficial: "#38bdf8",
  paralelo: "#f59e0b",
  paraleloAlt: "#f87171",
  gap: "#64748b",
  surface: "#0f172a",
  surfaceElevated: "#1e293b",
} as const;

/**
 * Dominio recomendado cuando labrecha.com.ar no está disponible.
 * Configurá el que registres en NEXT_PUBLIC_SITE_URL.
 */
export const BRAND_DOMAIN_RECOMMENDED = "labrechahoy.com.ar";

export const BRAND_DOMAIN_ALTERNATIVES = [
  {
    domain: "labrechahoy.com.ar",
    note: "Corto y memorable — nuestra recomendación",
  },
  { domain: "brechahoy.com.ar", note: "Enfatiza el chequeo diario" },
  { domain: "mirabrecha.com.ar", note: "Acción directa: “mirá la brecha”" },
  { domain: "elabrecha.com.ar", note: "Mínimo, fácil de decir" },
  {
    domain: "datalabrecha.com.ar",
    note: "Deixa claro que es producto de datos",
  },
] as const;

export function brandUrl(domain = BRAND_DOMAIN_RECOMMENDED): string {
  return `https://${domain}`;
}

export function pageTitle(segment: string): string {
  return `${segment} | ${BRAND_NAME}`;
}

export function brandCitation(
  siteUrl: string,
  year = new Date().getFullYear(),
): string {
  return `${BRAND_NAME} (${year}). Dashboard macroeconómico de Argentina con datos del BCRA e INDEC. ${siteUrl}`;
}

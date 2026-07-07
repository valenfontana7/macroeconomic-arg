export const BRAND_NAME = "La Brecha";

export const BRAND_TAGLINE = "Entre el oficial y el paralelo";

export const BRAND_DESCRIPTION =
  "Cotizaciones del dólar, inflación e indicadores económicos de Argentina, con datos oficiales del BCRA, INDEC y fuentes de mercado, explicados en simple.";

export const BRAND_OG_DESCRIPTION =
  "El dólar, la inflación y los indicadores de la economía argentina, con datos oficiales y explicaciones claras.";

/** Colores de marca: oficial (BCRA) vs paralelo (mercado), ajustados para fondo claro. */
export const BRAND_COLORS = {
  oficial: "#1d4ed8",
  paralelo: "#d97706",
  paraleloAlt: "#dc2626",
  gap: "#64748b",
  /* Variantes claras para trazos sobre superficies oscuras (logo, favicon, OG). */
  oficialOnDark: "#7dd3fc",
  paraleloOnDark: "#fbbf24",
  gapOnDark: "#94a3b8",
  surface: "#1e3a5f",
  surfaceElevated: "#1e293b",
} as const;

/**
 * Dominio canónico del sitio. Configurá el mismo valor en NEXT_PUBLIC_SITE_URL.
 */
export const BRAND_DOMAIN_RECOMMENDED = "labrechahoy.com.ar";

export const BRAND_DOMAIN_ALTERNATIVES = [
  { domain: "brechahoy.com.ar", note: "Sin el prefijo “la”" },
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

/** Segmento de título; el layout agrega " | La Brecha" vía template. */
export function pageTitle(segment: string): string {
  return segment;
}

export function brandCitation(
  siteUrl: string,
  year = new Date().getFullYear(),
): string {
  return `${BRAND_NAME} (${year}). Dashboard macroeconómico de Argentina con datos del BCRA e INDEC. ${siteUrl}`;
}

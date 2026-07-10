import { INDEC_SERIES } from "@/lib/datos-gobar-client";
import { FISCAL_SERIES } from "@/lib/fiscal-client";
import type { FiscalIndicatorSlug } from "@/lib/fiscal-indicators";
import type { IndicatorSlug } from "@/lib/indicators";
import { INDICATOR_BY_SLUG } from "@/lib/indicators";

const DATOS_GOBAR_EXPLORER = "https://series-tiempo.argentina.gob.ar/";

export function bcraVariableSourceUrl(id: number): string {
  return `https://www.bcra.gob.ar/PublicacionesEstadisticas/Principales_variables.asp?serie=${id}`;
}

export function datosGobarSeriesUrl(seriesId: string): string {
  return `${DATOS_GOBAR_EXPLORER}?ids=${encodeURIComponent(seriesId)}`;
}

export function indicatorSourceUrl(slug: IndicatorSlug): string | null {
  const config = INDICATOR_BY_SLUG[slug];
  if (!config) return null;
  return bcraVariableSourceUrl(config.id);
}

export function fiscalIndicatorSourceUrl(slug: FiscalIndicatorSlug): string | null {
  switch (slug) {
    case "resultado-primario":
      return datosGobarSeriesUrl(FISCAL_SERIES.primaryBalanceMonthly);
    case "deficit-financiero":
      return datosGobarSeriesUrl(FISCAL_SERIES.financialResultQuarterly);
    case "deuda-externa-usd":
    case "deuda-externa-yoy":
      return datosGobarSeriesUrl(FISCAL_SERIES.externalDebtGovQuarterly);
    default: {
      const _exhaustive: never = slug;
      return _exhaustive;
    }
  }
}

export function indecSeriesSourceUrl(
  key: keyof typeof INDEC_SERIES,
): string {
  return datosGobarSeriesUrl(INDEC_SERIES[key]);
}

export const EXTERNAL_SOURCES = {
  bcra: { label: "BCRA", href: "https://www.bcra.gob.ar" },
  indec: { label: "INDEC", href: "https://www.indec.gob.ar" },
  datosGobar: { label: "datos.gob.ar", href: "https://datos.gob.ar" },
  mecon: { label: "Ministerio de Economía", href: "https://www.economia.gob.ar" },
  dolarApi: { label: "DolarAPI", href: "https://dolarapi.com" },
  argentinaDatos: { label: "ArgentinaDatos", href: "https://argentinadatos.com" },
} as const;

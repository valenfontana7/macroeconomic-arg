import type { IndicatorSlug } from "@/lib/indicators";
import type { TrendChartFormat } from "@/components/trend-chart";

export function getChartFormat(slug: IndicatorSlug): TrendChartFormat {
  if (
    slug === "inflacion" ||
    slug === "m2-privado" ||
    slug === "badlar" ||
    slug === "prestamos-personales"
  ) {
    return "percent";
  }
  if (slug === "tc-mayorista" || slug === "tc-minorista" || slug === "uva") {
    return "currency";
  }
  if (slug === "cer") {
    return "index";
  }
  return "number";
}

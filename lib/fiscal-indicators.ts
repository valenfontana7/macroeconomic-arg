export type FiscalIndicatorSlug =
  | "resultado-primario"
  | "deficit-financiero"
  | "deuda-externa-usd"
  | "deuda-externa-yoy";

export type FiscalIndicatorConfig = {
  slug: FiscalIndicatorSlug;
  label: string;
  unit: string;
  description: string;
  impact: string;
  higherIsBetter: boolean;
  source: string;
};

export const FISCAL_INDICATORS = [
  {
    slug: "resultado-primario",
    label: "Resultado primario",
    unit: "millones ARS",
    description:
      "Ingresos menos gastos del Sector Público Nacional No Financiero, sin contar intereses de la deuda. Mide si el Estado gasta más de lo que recauda antes de pagar deuda.",
    impact:
      "Un déficit primario profundo suele presionar emisión, deuda o recortes. Un superávit da margen fiscal.",
    higherIsBetter: true,
    source: "IMIG / MEcon",
  },
  {
    slug: "deficit-financiero",
    label: "Resultado financiero",
    unit: "millones ARS",
    description:
      "Resultado fiscal total del SPNF, incluyendo el pago de intereses. Es el déficit/superávit financiero trimestral.",
    impact:
      "Incluye el costo de financiar la deuda. Un déficit financiero alto implica mayor necesidad de financiamiento.",
    higherIsBetter: true,
    source: "IMIG / MEcon",
  },
  {
    slug: "deuda-externa-usd",
    label: "Deuda externa pública",
    unit: "USD millones",
    description:
      "Stock de deuda externa bruta del gobierno general al cierre del trimestre, en millones de dólares (INDEC).",
    impact:
      "Mayor stock en dólares implica más exposición cambiaria y necesidad de dólares para servicio de deuda.",
    higherIsBetter: false,
    source: "INDEC",
  },
  {
    slug: "deuda-externa-yoy",
    label: "Variación deuda externa (YoY)",
    unit: "%",
    description:
      "Variación interanual del stock de deuda externa del gobierno general. Mide si la deuda en dólares crece aceleradamente.",
    impact:
      "Un crecimiento alto de la deuda externa suele ir de la mano con mayor riesgo soberano y presión cambiaria.",
    higherIsBetter: false,
    source: "INDEC",
  },
] as const satisfies readonly FiscalIndicatorConfig[];

export const FISCAL_INDICATOR_BY_SLUG = Object.fromEntries(
  FISCAL_INDICATORS.map((indicator) => [indicator.slug, indicator]),
) as Record<FiscalIndicatorSlug, (typeof FISCAL_INDICATORS)[number]>;

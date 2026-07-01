export type IndicatorPillar = "externo" | "cambio" | "precios" | "monetario";

export type IndicatorConfig = {
  id: number;
  slug: string;
  label: string;
  unit: string;
  pillar: IndicatorPillar;
  description: string;
  impact: string;
  revalidateSeconds: number;
  higherIsBetter?: boolean;
};

export const INDICATORS = [
  {
    id: 1,
    slug: "reservas",
    label: "Reservas internacionales",
    unit: "USD millones",
    pillar: "externo",
    description:
      "Dólares que el BCRA tiene en reserva. Son el colchón para importar, pagar deuda externa y defender el tipo de cambio oficial.",
    impact:
      "Si bajan mucho, suele haber más presión sobre el dólar y menos tranquilidad en el mercado cambiario.",
    revalidateSeconds: 3600,
    higherIsBetter: true,
  },
  {
    id: 5,
    slug: "tc-mayorista",
    label: "Dólar mayorista",
    unit: "ARS",
    pillar: "cambio",
    description:
      "Tipo de cambio al que operan bancos y empresas en el mercado mayorista. Es la referencia oficial para muchas operaciones grandes.",
    impact:
      "Subas fuertes encarecen importaciones y pueden trasladarse a precios. Si se mueve poco, da más previsibilidad.",
    revalidateSeconds: 3600,
    higherIsBetter: false,
  },
  {
    id: 4,
    slug: "tc-minorista",
    label: "Dólar minorista",
    unit: "ARS",
    pillar: "cambio",
    description:
      "Promedio de venta en el mercado minorista. Es la referencia más cercana al dólar que ve el ciudadano en el banco.",
    impact:
      "Afecta viajes, compras en dólares y la percepción general del dólar en la calle (oficial).",
    revalidateSeconds: 3600,
    higherIsBetter: false,
  },
  {
    id: 27,
    slug: "inflacion",
    label: "Inflación mensual",
    unit: "%",
    pillar: "precios",
    description:
      "Variación mensual del Índice de Precios al Consumidor (IPC). Mide cuánto subieron los precios en el último mes.",
    impact:
      "Si es alta, tu sueldo compra menos. Impacta alquileres, negociaciones salariales y el costo de vida diario.",
    revalidateSeconds: 86400,
    higherIsBetter: false,
  },
  {
    id: 30,
    slug: "cer",
    label: "CER",
    unit: "índice",
    pillar: "precios",
    description:
      "Coeficiente de Estabilización de Referencia. Índice que ajusta por inflación contratos y algunos instrumentos financieros.",
    impact:
      "Si sube rápido, los ajustes indexados (alquileres, plazos fijos UVA/CER) también suben.",
    revalidateSeconds: 3600,
    higherIsBetter: false,
  },
  {
    id: 31,
    slug: "uva",
    label: "UVA",
    unit: "ARS",
    pillar: "precios",
    description:
      "Unidad de Valor Adquisitivo. Unidad usada para créditos y depósitos UVA, ajustada por inflación.",
    impact:
      "Las cuotas UVA suben con la inflación. Si estás en UVA, conviene mirar este número cada mes.",
    revalidateSeconds: 3600,
    higherIsBetter: false,
  },
  {
    id: 7,
    slug: "badlar",
    label: "Tasa BADLAR",
    unit: "% anual",
    pillar: "monetario",
    description:
      "Tasa de interés de depósitos a plazo fijo en pesos de bancos privados. Referencia para plazos fijos tradicionales.",
    impact:
      "Si la BADLAR no le gana a la inflación, ahorrar en pesos pierde poder adquisitivo en términos reales.",
    revalidateSeconds: 3600,
    higherIsBetter: true,
  },
  {
    id: 15,
    slug: "base-monetaria",
    label: "Base monetaria",
    unit: "millones ARS",
    pillar: "monetario",
    description:
      "Dinero emitido por el BCRA más depósitos de bancos en el BCRA. Mide la liquidez base del sistema.",
    impact:
      "Un crecimiento muy acelerado puede presionar la inflación si no hay contrapartida en la demanda de pesos.",
    revalidateSeconds: 3600,
    higherIsBetter: false,
  },
  {
    id: 25,
    slug: "m2-privado",
    label: "M2 privado (var. interanual)",
    unit: "%",
    pillar: "monetario",
    description:
      "Variación interanual del dinero en circulación y depósitos del sector privado. Proxy de liquidez en la economía.",
    impact:
      "Si crece muy rápido, puede anticipar presión inflacionaria; si crece poco, puede reflejar menor actividad.",
    revalidateSeconds: 3600,
    higherIsBetter: false,
  },
  {
    id: 14,
    slug: "prestamos-personales",
    label: "Tasa préstamos personales",
    unit: "% anual",
    pillar: "monetario",
    description:
      "Tasa de interés promedio de préstamos personales en pesos. Refleja el costo del crédito al consumidor.",
    impact:
      "Tasas altas encarecen financiarse; tasas bajas facilitan consumo pero pueden venir con inflación alta.",
    revalidateSeconds: 3600,
    higherIsBetter: false,
  },
] as const satisfies readonly IndicatorConfig[];

export type IndicatorSlug = (typeof INDICATORS)[number]["slug"];

export const INDICATOR_BY_SLUG = Object.fromEntries(
  INDICATORS.map((indicator) => [indicator.slug, indicator]),
) as Record<IndicatorSlug, (typeof INDICATORS)[number]>;

export const INDICATOR_BY_ID = Object.fromEntries(
  INDICATORS.map((indicator) => [indicator.id, indicator]),
) as Record<number, (typeof INDICATORS)[number]>;

export const PILLAR_LABELS: Record<IndicatorPillar, string> = {
  externo: "Sector externo",
  cambio: "Tipo de cambio",
  precios: "Precios e inflación",
  monetario: "Política monetaria",
};

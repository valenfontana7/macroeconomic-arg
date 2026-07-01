import type { IndicatorSlug } from "@/lib/indicators";

export type MacroConceptCategory =
  | "precios"
  | "cambio"
  | "externo"
  | "monetario"
  | "actividad"
  | "panel";

export type MacroConcept = {
  slug: string;
  title: string;
  category: MacroConceptCategory;
  source: string;
  indicatorSlug?: IndicatorSlug;
  enCristiano: string;
  paraQueSirve: string;
  comoLeerlo: string;
  enTuVida: string;
  analogia?: string;
  erroresComunes?: string;
  relatedSlugs?: string[];
};

export const CATEGORY_LABELS: Record<MacroConceptCategory, string> = {
  precios: "Precios e inflación",
  cambio: "Tipo de cambio",
  externo: "Sector externo",
  monetario: "Política monetaria",
  actividad: "Actividad económica",
  panel: "Conceptos del panel",
};

const bcraConcepts: MacroConcept[] = [
  {
    slug: "reservas",
    title: "Reservas internacionales",
    category: "externo",
    source: "BCRA — Estadísticas Monetarias v4.0",
    indicatorSlug: "reservas",
    enCristiano:
      "Los dólares que el Banco Central tiene guardados para enfrentar emergencias cambiarias e importaciones.",
    paraQueSirve:
      "Muestran cuánto margen tiene el país para sostener el tipo de cambio oficial y pagar compromisos en moneda extranjera.",
    comoLeerlo:
      "Si suben de forma sostenida, suele haber más tranquilidad. Si caen fuerte en pocos meses, aumenta la tensión cambiaria.",
    enTuVida:
      "Cuando las reservas bajan mucho, es más probable que el dólar oficial se mueva o que aparezcan más restricciones para comprar divisas.",
    analogia: "Es como la caja de ahorro en dólares del país: si se vacía, todo se pone más nervioso.",
    erroresComunes: "No es lo mismo que las reservas del Tesoro: acá hablamos del BCRA.",
    relatedSlugs: ["tc-mayorista", "brecha-ccl", "riesgo-pais"],
  },
  {
    slug: "tc-mayorista",
    title: "Dólar mayorista",
    category: "cambio",
    source: "BCRA — Estadísticas Monetarias v4.0",
    indicatorSlug: "tc-mayorista",
    enCristiano:
      "El precio del dólar al que operan bancos y empresas en grandes montos.",
    paraQueSirve:
      "Es la referencia oficial para importaciones, exportaciones y muchas operaciones del sector real.",
    comoLeerlo:
      "Subidas rápidas encarecen lo que viene del exterior. Movimientos suaves dan más previsibilidad para planificar.",
    enTuVida:
      "Aunque no lo compres directo, muchos precios de góndola terminan siguiendo al dólar mayorista con cierto desfase.",
    analogia: "Es el 'precio mayorista' del dólar, no el de la ventanilla del banco.",
    relatedSlugs: ["tc-minorista", "dolar-oficial", "brecha-ccl"],
  },
  {
    slug: "tc-minorista",
    title: "Dólar minorista",
    category: "cambio",
    source: "BCRA — Estadísticas Monetarias v4.0",
    indicatorSlug: "tc-minorista",
    enCristiano:
      "El dólar que ves más cerca cuando vas al banco o comparás cotizaciones oficiales al público.",
    paraQueSirve:
      "Refleja el tipo de cambio minorista promedio, más cercano a la experiencia del ciudadano.",
    comoLeerlo:
      "Comparalo con el mayorista: una brecha grande entre ambos puede indicar presión en el mercado minorista.",
    enTuVida:
      "Te sirve de referencia para viajes, compras en dólares en el banco o ahorro en moneda extranjera por vía oficial.",
    relatedSlugs: ["tc-mayorista", "dolar-oficial"],
  },
  {
    slug: "inflacion",
    title: "Inflación mensual",
    category: "precios",
    source: "BCRA / INDEC",
    indicatorSlug: "inflacion",
    enCristiano:
      "Cuánto subieron los precios del súper, la nafta, los alquileres y casi todo lo que consumís en el último mes.",
    paraQueSirve:
      "Mide si la plata de este mes rinde lo mismo que la del mes pasado.",
    comoLeerlo:
      "Menos de 3% mensual suele ser zona moderada. Entre 3% y 6% es alta. Más de 6% es muy preocupante.",
    enTuVida:
      "Usala para negociar alquileres, pedir aumentos de sueldo o ajustar tu presupuesto familiar.",
    analogia: "Es la velocidad a la que se achica tu billetera si tu ingreso no sube parejo.",
    erroresComunes: "No confundir con inflación interanual: esta es solo del último mes.",
    relatedSlugs: ["ipc-interanual", "ipc-nucleo", "cer", "uva"],
  },
  {
    slug: "cer",
    title: "CER",
    category: "precios",
    source: "BCRA — Estadísticas Monetarias v4.0",
    indicatorSlug: "cer",
    enCristiano:
      "Un índice que ajusta ciertos contratos y productos financieros según la inflación.",
    paraQueSirve:
      "Permite que algunos acuerdos (alquileres, plazos fijos CER) no pierdan valor frente a los precios.",
    comoLeerlo:
      "Si el CER sube rápido, los ajustes indexados también suben. Un CER estable implica menos correcciones.",
    enTuVida:
      "Si tenés alquiler o inversión atada al CER, este número define cuánto vas a pagar o cobrar en el próximo ajuste.",
    relatedSlugs: ["inflacion", "uva"],
  },
  {
    slug: "uva",
    title: "UVA",
    category: "precios",
    source: "BCRA — Estadísticas Monetarias v4.0",
    indicatorSlug: "uva",
    enCristiano:
      "Una unidad que representa poder de compra y se actualiza con la inflación. Se usa en créditos y depósitos UVA.",
    paraQueSirve:
      "Hace que préstamos y ahorros UVA mantengan valor real en el tiempo, subiendo con los precios.",
    comoLeerlo:
      "El valor en pesos de la UVA sube mes a mes. Cuanto más alta la inflación, más sube la UVA.",
    enTuVida:
      "Si tenés un crédito hipotecario UVA, las cuotas suben cuando sube la UVA. Si ahorrás en UVA, tu capital se ajusta por inflación.",
    relatedSlugs: ["inflacion", "cer"],
  },
  {
    slug: "badlar",
    title: "Tasa BADLAR",
    category: "monetario",
    source: "BCRA — Estadísticas Monetarias v4.0",
    indicatorSlug: "badlar",
    enCristiano:
      "La tasa de interés que pagan los bancos privados por un plazo fijo común en pesos.",
    paraQueSirve:
      "Es la referencia para saber cuánto rinde ahorrar en pesos en un plazo fijo tradicional.",
    comoLeerlo:
      "Comparala con la inflación: si la BADLAR es menor que la inflación anualizada, perdés poder de compra real.",
    enTuVida:
      "Antes de renovar un plazo fijo, mirá si la tasa le gana a la inflación esperada del período.",
    analogia: "Es el 'precio' que el banco te paga por prestarle tus pesos.",
    relatedSlugs: ["inflacion", "ipc-interanual"],
  },
  {
    slug: "base-monetaria",
    title: "Base monetaria",
    category: "monetario",
    source: "BCRA — Estadísticas Monetarias v4.0",
    indicatorSlug: "base-monetaria",
    enCristiano:
      "La cantidad base de pesos que el BCRA puso en circulación más lo que los bancos tienen depositado en el Central.",
    paraQueSirve:
      "Mide cuánta liquidez hay en la economía en su nivel más básico.",
    comoLeerlo:
      "Un crecimiento muy acelerado puede presionar los precios si no hay más producción que lo absorba.",
    enTuVida:
      "No la ves en tu cuenta, pero si crece muy rápido durante meses, puede anticipar más inflación adelante.",
    relatedSlugs: ["m2-privado", "inflacion"],
  },
  {
    slug: "m2-privado",
    title: "M2 privado",
    category: "monetario",
    source: "BCRA — Estadísticas Monetarias v4.0",
    indicatorSlug: "m2-privado",
    enCristiano:
      "Cuánto dinero en pesos hay en la calle y en depósitos de familias y empresas, comparado con hace un año.",
    paraQueSirve:
      "Indica si hay más o menos plata circulando en la economía privada.",
    comoLeerlo:
      "Crecimiento muy alto puede asociarse a más presión sobre precios. Crecimiento bajo puede reflejar menos actividad.",
    enTuVida:
      "Es un termómetro de 'cuántos pesos hay dando vueltas' para comprar bienes y servicios.",
    relatedSlugs: ["base-monetaria", "inflacion"],
  },
  {
    slug: "prestamos-personales",
    title: "Tasa préstamos personales",
    category: "monetario",
    source: "BCRA — Estadísticas Monetarias v4.0",
    indicatorSlug: "prestamos-personales",
    enCristiano:
      "El costo promedio anual de pedir un préstamo personal en pesos en un banco.",
    paraQueSirve:
      "Muestra cuán caro o barato está financiarse para consumo.",
    comoLeerlo:
      "Tasas muy altas desalientan pedir crédito. Tasas bajas facilitan consumo, pero conviene mirar la inflación del período.",
    enTuVida:
      "Antes de tomar un préstamo, compará esta tasa con cuotas UVA, consumo o alternativas.",
    relatedSlugs: ["badlar", "uva"],
  },
];

const marketConcepts: MacroConcept[] = [
  {
    slug: "dolar-oficial",
    title: "Dólar oficial",
    category: "cambio",
    source: "DolarAPI / BCRA",
    enCristiano:
      "El dólar que cotiza el gobierno y los bancos para operaciones reguladas.",
    paraQueSirve:
      "Es la referencia para importaciones, exportaciones y compras de dólar por vía bancaria.",
    comoLeerlo:
      "Comparalo siempre con blue, MEP y CCL: si el paralelo está mucho más alto, hay brecha cambiaria.",
    enTuVida:
      "Es el dólar que pagás si comprás por el banco con cupo oficial, no el de la cueva.",
    relatedSlugs: ["brecha-ccl", "brecha-blue", "tc-mayorista"],
  },
  {
    slug: "brecha-ccl",
    title: "Brecha CCL",
    category: "cambio",
    source: "DolarAPI / ArgentinaDatos",
    enCristiano:
      "La diferencia porcentual entre el dólar CCL (contado con liqui) y el dólar oficial.",
    paraQueSirve:
      "Mide cuánto más caro está el dólar 'paralelo financiero' respecto al oficial.",
    comoLeerlo:
      "Menos de 10% suele ser calma relativa. 10–25% es tensión media. Más de 25% es presión fuerte.",
    enTuVida:
      "Si la brecha es alta, mucha gente busca dolarizarse fuera del canal oficial y aumenta la incertidumbre.",
    analogia: "Es como la distancia entre el precio de lista y el que realmente pagás en otro canal.",
    relatedSlugs: ["dolar-oficial", "riesgo-pais"],
  },
  {
    slug: "brecha-blue",
    title: "Brecha blue",
    category: "cambio",
    source: "DolarAPI",
    enCristiano:
      "Cuánto más caro está el dólar blue que el dólar oficial.",
    paraQueSirve:
      "Refleja la demanda de dólares fuera del sistema bancario formal.",
    comoLeerlo:
      "Brechas altas indican desconfianza y dificultad para acceder al dólar oficial.",
    enTuVida:
      "Si seguís el blue, estás mirando el termómetro informal del mercado cambiario.",
    relatedSlugs: ["dolar-oficial", "brecha-ccl"],
  },
  {
    slug: "brecha-mep",
    title: "Brecha MEP",
    category: "cambio",
    source: "DolarAPI",
    enCristiano:
      "La diferencia entre el dólar MEP (bolsa) y el dólar oficial.",
    paraQueSirve:
      "El MEP es una forma legal de acceder a dólares vía bonos; la brecha muestra la distorsión cambiaria.",
    comoLeerlo:
      "Similar a la brecha CCL: mientras más alta, más presión para dolarizarse.",
    enTuVida:
      "Muchos inversores usan MEP para ahorrar en dólares; la brecha les dice si conviene o no el timing.",
    relatedSlugs: ["brecha-ccl", "dolar-oficial"],
  },
  {
    slug: "riesgo-pais",
    title: "Riesgo país (EMBI)",
    category: "externo",
    source: "ArgentinaDatos",
    enCristiano:
      "Un puntaje que resume cuánto extra le cobran los inversores a Argentina por prestarle o invertir acá.",
    paraQueSirve:
      "Resume la percepción de riesgo del país en los mercados internacionales.",
    comoLeerlo:
      "Menos de 500 puntos básicos suele ser favorable. Más de 1.000 indica mucha desconfianza.",
    enTuVida:
      "Cuando sube fuerte, suele haber más volatilidad del dólar y menos tranquilidad macro.",
    analogia: "Es como el 'score crediticio' del país para el mundo.",
    relatedSlugs: ["reservas", "brecha-ccl"],
  },
  {
    slug: "termometro-macro",
    title: "Termómetro macro",
    category: "panel",
    source: "Pulso Macro AR (reglas propias)",
    enCristiano:
      "Un puntaje de 0 a 100 que resume si el panorama macro se ve tranquilo, atento, turbulento o crítico.",
    paraQueSirve:
      "Te da una lectura rápida sin tener que interpretar diez indicadores por separado.",
    comoLeerlo:
      "75+ Tranquilo, 55–74 Atento, 35–54 Turbulento, menos de 35 Crítico. Combina inflación, reservas, dólar, brecha y más.",
    enTuVida:
      "Usalo como punto de partida: si está en Atento o peor, conviene revisar gastos y cobertura cambiaria.",
    erroresComunes: "No es una predicción ni un consejo de inversión: es un resumen de señales.",
    relatedSlugs: ["senal-semaforo", "inflacion", "brecha-ccl"],
  },
  {
    slug: "senal-semaforo",
    title: "Semáforo OK / Atento / Alerta",
    category: "panel",
    source: "Pulso Macro AR (reglas propias)",
    enCristiano:
      "Un color en cada tarjeta que te dice si ese indicador va bien, regular o mal según reglas simples.",
    paraQueSirve:
      "Te ahorra interpretar cada número: verde es favorable, amarillo requiere atención, rojo es preocupante.",
    comoLeerlo:
      "OK = señal favorable. Atento = mirar de cerca. Alerta = valor preocupante según umbrales del indicador.",
    enTuVida:
      "Si varias tarjetas están en Alerta al mismo tiempo, el entorno macro probablemente esté complicado.",
    relatedSlugs: ["termometro-macro"],
  },
];

const indecConcepts: MacroConcept[] = [
  {
    slug: "ipc-interanual",
    title: "Inflación interanual (INDEC)",
    category: "precios",
    source: "datos.gob.ar / INDEC",
    enCristiano:
      "Cuánto subieron los precios en total en los últimos 12 meses.",
    paraQueSirve:
      "Es la inflación que más se usa para comparar con sueldos, alquileres anuales y metas de ahorro.",
    comoLeerlo:
      "Menos de 30% interanual es desaceleración relativa. Más de 100% es inflación muy alta.",
    enTuVida:
      "Si tu sueldo subió menos que este número, perdiste poder de compra en el año.",
    relatedSlugs: ["inflacion", "ipc-nucleo", "salario-real"],
  },
  {
    slug: "ipc-nucleo",
    title: "IPC núcleo",
    category: "precios",
    source: "datos.gob.ar / INDEC",
    enCristiano:
      "La inflación mensual sin los precios más volátiles ni regulados que distorsionan el índice general.",
    paraQueSirve:
      "Ayuda a ver la tendencia de fondo de la inflación, más allá de un mes ruidoso.",
    comoLeerlo:
      "Si el núcleo está por debajo del IPC general, los aumentos fuertes pueden ser por rubros puntuales.",
    enTuVida:
      "Útil para entender si la inflación 'de verdad' está frenando o solo parece que sí por un mes atípico.",
    relatedSlugs: ["inflacion", "ipc-interanual"],
  },
  {
    slug: "emae",
    title: "EMAE (actividad económica)",
    category: "actividad",
    source: "datos.gob.ar / INDEC",
    enCristiano:
      "Un estimador de cuánto produce y consume la economía argentina, mes a mes.",
    paraQueSirve:
      "Indica si la economía crece o se contrae.",
    comoLeerlo:
      "Variación interanual positiva = más actividad. Negativa = recesión o desaceleración fuerte.",
    enTuVida:
      "Más actividad suele asociarse a más empleo y consumo; menos actividad, a mayor cautela.",
    relatedSlugs: ["ipc-interanual", "salario-real"],
  },
  {
    slug: "salario-real",
    title: "Salario real (total)",
    category: "actividad",
    source: "datos.gob.ar / INDEC — Índice de Salarios",
    enCristiano:
      "Si los salarios de la economía, ajustados por inflación, subieron o bajó respecto al año pasado.",
    paraQueSirve:
      "Mide si el poder de compra salarial promedio mejoró o empeoró en términos reales.",
    comoLeerlo:
      "Positivo = los salarios le ganaron a la inflación. Negativo = perdieron poder de compra.",
    enTuVida:
      "Sirve como referencia para negociar aumentos: si es negativo, muchos trabajadores perdieron contra los precios.",
    erroresComunes:
      "No es solo industria: el INDEC discontinuó esa serie; usamos el Índice de Salarios total.",
    relatedSlugs: ["ipc-interanual", "emae"],
  },
  {
    slug: "poder-adquisitivo",
    title: "Índice de salarios total",
    category: "actividad",
    source: "datos.gob.ar / INDEC — Índice de Salarios",
    enCristiano:
      "Un índice que muestra cómo evolucionaron los salarios pagados en toda la economía desde octubre de 2016.",
    paraQueSirve:
      "Complementa al salario real mostrando el nivel acumulado de remuneraciones.",
    comoLeerlo:
      "Base octubre 2016=100. Si el índice sube, los salarios nominales crecieron en el tiempo.",
    enTuVida:
      "Útil para ver la tendencia de fondo de los salarios, más allá de un solo mes.",
    relatedSlugs: ["salario-real", "ipc-interanual"],
  },
  {
    slug: "forex-eur",
    title: "Euro y otras monedas",
    category: "cambio",
    source: "DolarAPI",
    enCristiano:
      "Cuántos pesos cuesta comprar euros, reales, pesos chilenos u otras monedas al tipo oficial.",
    paraQueSirve:
      "Te ayuda a planificar viajes, compras en el exterior o comparar con economías vecinas.",
    comoLeerlo:
      "Mirá compra y venta: la diferencia es el margen del mercado cambiario.",
    enTuVida:
      "Si viajás a Brasil o Europa, este número define cuántos pesos necesitás.",
    relatedSlugs: ["dolar-oficial", "tc-mayorista"],
  },
];

export const ALL_CONCEPTS: MacroConcept[] = [
  ...bcraConcepts,
  ...marketConcepts,
  ...indecConcepts,
];

export const CONCEPT_BY_SLUG = Object.fromEntries(
  ALL_CONCEPTS.map((concept) => [concept.slug, concept]),
) as Record<string, MacroConcept>;

export function getConceptBySlug(slug: string): MacroConcept | undefined {
  return CONCEPT_BY_SLUG[slug];
}

export function getAllConcepts(): MacroConcept[] {
  return ALL_CONCEPTS;
}

export function getConceptsByCategory(): Record<MacroConceptCategory, MacroConcept[]> {
  const grouped = {} as Record<MacroConceptCategory, MacroConcept[]>;
  for (const category of Object.keys(CATEGORY_LABELS) as MacroConceptCategory[]) {
    grouped[category] = ALL_CONCEPTS.filter((c) => c.category === category);
  }
  return grouped;
}

export function getConceptForIndicator(slug: IndicatorSlug): MacroConcept | undefined {
  return ALL_CONCEPTS.find((c) => c.indicatorSlug === slug);
}

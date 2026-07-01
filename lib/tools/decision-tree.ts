import type { IndicatorSlug } from "@/lib/indicators";

export type DecisionPathId =
  | "ahorro-pesos"
  | "dolarizar"
  | "alquiler"
  | "uva"
  | "importar"
  | "sueldo";

export type DecisionNode = {
  id: string;
  question?: string;
  text?: string;
  options?: { label: string; nextId: string }[];
  result?: DecisionPathId;
};

export type DecisionResult = {
  id: DecisionPathId;
  title: string;
  summary: string;
  indicators: { slug: IndicatorSlug | string; label: string; learnSlug?: string }[];
  tips: string[];
};

export const DECISION_TREE: DecisionNode[] = [
  {
    id: "start",
    question: "¿Qué decisión tenés en mente?",
    options: [
      { label: "Ahorrar o invertir en pesos", nextId: "ahorro" },
      { label: "Comprar dólares o dolarizarme", nextId: "dolar" },
      { label: "Negociar alquiler o gastos fijos", nextId: "gastos" },
      { label: "Entender si mi sueldo alcanza", nextId: "sueldo-q" },
    ],
  },
  {
    id: "ahorro",
    question: "¿Dónde pondrías la plata?",
    options: [
      { label: "Plazo fijo en pesos", nextId: "r-ahorro-pesos" },
      { label: "Prefiero dólares", nextId: "dolar" },
    ],
  },
  {
    id: "dolar",
    question: "¿Para qué querés dólares?",
    options: [
      { label: "Reserva / ahorro", nextId: "r-dolarizar" },
      { label: "Pagar algo en el exterior", nextId: "r-importar" },
    ],
  },
  {
    id: "gastos",
    question: "¿Tu gasto principal es…?",
    options: [
      { label: "Alquiler (indexado o en pesos)", nextId: "r-alquiler" },
      { label: "Cuotas UVA / hipoteca", nextId: "r-uva" },
    ],
  },
  {
    id: "sueldo-q",
    text: "Mirá si tu sueldo le gana a la inflación.",
    result: "sueldo",
  },
  { id: "r-ahorro-pesos", result: "ahorro-pesos" },
  { id: "r-dolarizar", result: "dolarizar" },
  { id: "r-alquiler", result: "alquiler" },
  { id: "r-uva", result: "uva" },
  { id: "r-importar", result: "importar" },
];

export const DECISION_RESULTS: Record<DecisionPathId, DecisionResult> = {
  "ahorro-pesos": {
    id: "ahorro-pesos",
    title: "Ahorro en pesos",
    summary: "Compará la BADLAR con la inflación interanual. Si la tasa no le gana a los precios, perdés poder de compra real.",
    indicators: [
      { slug: "badlar", label: "Tasa BADLAR" },
      { slug: "inflacion", label: "Inflación mensual" },
      { slug: "ipc-interanual", label: "Inflación interanual", learnSlug: "ipc-interanual" },
    ],
    tips: [
      "Renová el plazo fijo cuando cambie la inflación esperada.",
      "Mirá el IPC núcleo para ver la tendencia de fondo.",
    ],
  },
  dolarizar: {
    id: "dolarizar",
    title: "Dolarización",
    summary: "Seguí la brecha CCL/blue: cuando está alta, el mercado paralelo está tenso. Compará MEP, CCL y oficial.",
    indicators: [
      { slug: "brecha-ccl", label: "Brecha CCL", learnSlug: "brecha-ccl" },
      { slug: "tc-mayorista", label: "Dólar mayorista" },
      { slug: "reservas", label: "Reservas BCRA" },
    ],
    tips: [
      "Configurá alertas de brecha en el dashboard.",
      "Probá el simulador 'Si hubieras dolarizado…' antes de decidir timing.",
    ],
  },
  alquiler: {
    id: "alquiler",
    title: "Alquiler e inflación",
    summary: "El IPC mensual y el CER/UVA definen muchos ajustes. Negociá con la inflación interanual como referencia.",
    indicators: [
      { slug: "inflacion", label: "Inflación mensual" },
      { slug: "cer", label: "CER" },
      { slug: "uva", label: "UVA" },
    ],
    tips: [
      "Pedí el índice de ajuste por escrito.",
      "Compará IPC general vs núcleo para anticipar el próximo aumento.",
    ],
  },
  uva: {
    id: "uva",
    title: "Créditos UVA",
    summary: "Las cuotas suben con la UVA. Si la inflación mensual es alta, tu cuota del mes que viene también.",
    indicators: [
      { slug: "uva", label: "Valor UVA" },
      { slug: "inflacion", label: "Inflación mensual" },
      { slug: "prestamos-personales", label: "Tasa créditos" },
    ],
    tips: [
      "Simulá la cuota con la UVA de hoy + inflación esperada.",
      "Compará con un préstamo a tasa fija si existe alternativa.",
    ],
  },
  importar: {
    id: "importar",
    title: "Pagos en el exterior",
    summary: "El dólar mayorista y las brechas definen cuánto pagás por importaciones y servicios afuera.",
    indicators: [
      { slug: "tc-mayorista", label: "Dólar mayorista" },
      { slug: "brecha-ccl", label: "Brecha CCL", learnSlug: "brecha-ccl" },
      { slug: "forex-eur", label: "Euro y otras monedas", learnSlug: "forex-eur" },
    ],
    tips: [
      "Usá el Modo viajero para estimar costos en la región.",
      "Mirá el riesgo país si tomás deuda en dólares.",
    ],
  },
  sueldo: {
    id: "sueldo",
    title: "Sueldo vs inflación",
    summary: "Compará el aumento de tu sueldo con la inflación interanual y el salario real INDEC.",
    indicators: [
      { slug: "salario-real", label: "Salario real total", learnSlug: "salario-real" },
      { slug: "ipc-interanual", label: "Inflación interanual", learnSlug: "ipc-interanual" },
      { slug: "inflacion", label: "Inflación mensual" },
    ],
    tips: [
      "Usá la herramienta 'Tu sueldo vs la inflación' con tu número exacto.",
      "Si perdés contra IPC, es momento de renegociar o ajustar gastos.",
    ],
  },
};

export function getDecisionNode(id: string): DecisionNode | undefined {
  return DECISION_TREE.find((n) => n.id === id);
}

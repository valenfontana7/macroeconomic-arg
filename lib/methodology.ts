export const METHODOLOGY_VERSION = "v1.1 — jul 2026";

export const THERMOMETER_WEIGHTS = [
  { label: "Inflación mensual", weight: "18%" },
  { label: "Reservas (Δ 30d)", weight: "15%" },
  { label: "Volatilidad del dólar (30d)", weight: "12%" },
  { label: "Brecha CCL", weight: "12%" },
  { label: "Base monetaria (Δ 30d)", weight: "9%" },
  { label: "Resultado primario (3 meses)", weight: "10%" },
  { label: "Riesgo país EMBI", weight: "8%" },
  { label: "Deuda externa pública (YoY)", weight: "7%" },
  { label: "BADLAR real", weight: "6%" },
  { label: "M2 privado interanual", weight: "3%" },
] as const;

export const THERMOMETER_MOODS = [
  { label: "Tranquilo", range: "≥ 75" },
  { label: "Atento", range: "55–74" },
  { label: "Turbulento", range: "35–54" },
  { label: "Crítico", range: "< 35" },
] as const;

export const THERMOMETER_NOTES = [
  "Cada señal se convierte en un sub-score de 0 a 100 con umbrales fijos.",
  "Si falta un dato para una señal, usamos 50 (neutral) para no penalizar ni favorecer.",
  "El resultado financiero y la deuda total/PIB se muestran en el dashboard pero no entran al score hasta contar con series confiables.",
  "El histórico de 90 días no incluye riesgo país (no hay serie histórica integrada).",
] as const;

const SOURCE_LABELS: Record<string, string> = {
  "BCRA cotizaciones": "Cotizaciones BCRA",
  DolarAPI: "Cotizaciones de mercado (DolarAPI)",
  "DolarAPI monedas": "Monedas extranjeras (DolarAPI)",
  INDEC: "INDEC (datos.gob.ar)",
  "Riesgo país": "Riesgo país (ArgentinaDatos)",
  "Brecha CCL": "Brecha CCL (ArgentinaDatos)",
  "Inflación INDEC histórica": "Histórico IPC INDEC",
  "INDEC series": "Series INDEC",
  "Finanzas públicas": "Finanzas públicas (IMIG / INDEC)",
  "BCRA series": "Series históricas BCRA",
};

export function formatPartialError(error: string): string {
  const colonIdx = error.indexOf(":");
  if (colonIdx === -1) return error;
  const label = error.slice(0, colonIdx).trim();
  const detail = error.slice(colonIdx + 1).trim();
  const readable = SOURCE_LABELS[label] ?? label;
  return `${readable}: ${detail}`;
}

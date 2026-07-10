import { BRAND_NAME } from "@/lib/brand";

/** Datos del editor/publicador — editá acá tu nombre y bio si hace falta. */
export const PUBLISHER_NAME = "Valen";

export const PUBLISHER_ROLE = "Fundador y editor";

export const PUBLISHER_EMAIL = "contacto@labrecha.ar";

export const PUBLISHER_COUNTRY = "Argentina";

export const PUBLISHER_BIO =
  "Desarrollador y editor de economía aplicada. Creé La Brecha para traducir indicadores macro argentinos a lenguaje cotidiano, con datos oficiales del BCRA e INDEC y reglas editoriales transparentes.";

export const EDITORIAL_POLICY = [
  "Usamos exclusivamente fuentes públicas verificables (BCRA, INDEC, datos.gob.ar, APIs de mercado).",
  "Las interpretaciones y el pulso macro se generan con reglas fijas documentadas en Acerca; no usamos IA generativa para redactar.",
  "Cuando un dato puede estar desactualizado o incompleto, lo indicamos con badges de frescura y avisos de error parcial.",
  "No damos recomendaciones de inversión ni asesoramiento financiero personalizado.",
] as const;

export const CONTACT_RESPONSE_TIME = "48 a 72 horas hábiles";

export function publisherMailto(subject: string, body?: string): string {
  const params = new URLSearchParams();
  params.set("subject", subject);
  if (body) params.set("body", body);
  return `mailto:${PUBLISHER_EMAIL}?${params.toString()}`;
}

export function publisherAttribution(): string {
  return `${PUBLISHER_NAME}, ${PUBLISHER_ROLE} de ${BRAND_NAME}`;
}

export type ChangelogEntry = {
  date: string;
  title: string;
  items: string[];
};

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: "2026-07-09",
    title: "Finanzas públicas en el termómetro",
    items: [
      "Nueva sección Finanzas públicas con resultado primario, déficit financiero y deuda externa (IMIG e INDEC).",
      "El termómetro incorpora resultado primario acumulado (10%), variación YoY de deuda externa (7%) y M2 privado (3%).",
      "Metodología v1.1: pesos rebalanceados en las 10 señales del score.",
    ],
  },
  {
    date: "2026-07-09",
    title: "Confianza y UX del dashboard",
    items: [
      "Modo Pulso vs Completo en la home para lectura rápida.",
      "Badges de frescura de datos, errores parciales detallados y enlaces Ver fuente por indicador.",
      "Panel de metodología in-context en el termómetro y página de novedades.",
    ],
  },
];

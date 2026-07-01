export type AdPlacement =
  | "dashboard-below-hero"
  | "dashboard-mid-content"
  | "dashboard-footer"
  | "aprende-footer"
  | "indicadores-footer"
  | "indicador-footer"
  | "herramientas-footer"
  | "calendario-footer";

export const AD_PLACEMENTS: Record<
  AdPlacement,
  { label: string; slotEnvKey: string; format: "horizontal" | "rectangle" }
> = {
  "dashboard-below-hero": {
    label: "Dashboard — debajo del hero",
    slotEnvKey: "NEXT_PUBLIC_ADSENSE_SLOT_DASHBOARD_HERO",
    format: "horizontal",
  },
  "dashboard-mid-content": {
    label: "Dashboard — mitad del contenido",
    slotEnvKey: "NEXT_PUBLIC_ADSENSE_SLOT_DASHBOARD_MID",
    format: "horizontal",
  },
  "dashboard-footer": {
    label: "Dashboard — pie de contenido",
    slotEnvKey: "NEXT_PUBLIC_ADSENSE_SLOT_DASHBOARD_FOOTER",
    format: "horizontal",
  },
  "aprende-footer": {
    label: "Aprendé — pie de página",
    slotEnvKey: "NEXT_PUBLIC_ADSENSE_SLOT_APRENDE",
    format: "rectangle",
  },
  "indicadores-footer": {
    label: "Indicadores — pie de listado",
    slotEnvKey: "NEXT_PUBLIC_ADSENSE_SLOT_INDICADORES",
    format: "horizontal",
  },
  "indicador-footer": {
    label: "Indicador — después del contenido",
    slotEnvKey: "NEXT_PUBLIC_ADSENSE_SLOT_INDICADOR",
    format: "rectangle",
  },
  "herramientas-footer": {
    label: "Herramientas — pie del hub",
    slotEnvKey: "NEXT_PUBLIC_ADSENSE_SLOT_HERRAMIENTAS",
    format: "horizontal",
  },
  "calendario-footer": {
    label: "Calendario — pie de página",
    slotEnvKey: "NEXT_PUBLIC_ADSENSE_SLOT_CALENDARIO",
    format: "horizontal",
  },
};

export function getAdSenseClientId(): string | null {
  const id = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  return id && id.length > 0 ? id : null;
}

export function getAdSlotId(placement: AdPlacement): string | null {
  const key = AD_PLACEMENTS[placement].slotEnvKey;
  const value = process.env[key as keyof NodeJS.ProcessEnv];
  return typeof value === "string" && value.length > 0 ? value : null;
}

export function isAdsEnabled(): boolean {
  return getAdSenseClientId() !== null;
}

export type BrechaType = "ccl" | "blue" | "mep";

export type BrechaAlertConfig = {
  enabled: boolean;
  thresholdPct: number;
};

export type BrechaAlertsSettings = {
  ccl: BrechaAlertConfig;
  blue: BrechaAlertConfig;
  mep: BrechaAlertConfig;
};

export type BrechaAlertTrigger = {
  type: BrechaType;
  label: string;
  currentPct: number;
  thresholdPct: number;
};

const STORAGE_KEY = "pulso-macro-brecha-alerts";

export const DEFAULT_BRECHA_ALERTS: BrechaAlertsSettings = {
  ccl: { enabled: true, thresholdPct: 20 },
  blue: { enabled: true, thresholdPct: 15 },
  mep: { enabled: true, thresholdPct: 12 },
};

export const BRECHA_LABELS: Record<BrechaType, string> = {
  ccl: "CCL",
  blue: "Blue",
  mep: "MEP",
};

export function loadBrechaAlerts(): BrechaAlertsSettings {
  if (typeof window === "undefined") return DEFAULT_BRECHA_ALERTS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_BRECHA_ALERTS;
    const parsed = JSON.parse(raw) as Partial<BrechaAlertsSettings>;
    return {
      ccl: { ...DEFAULT_BRECHA_ALERTS.ccl, ...parsed.ccl },
      blue: { ...DEFAULT_BRECHA_ALERTS.blue, ...parsed.blue },
      mep: { ...DEFAULT_BRECHA_ALERTS.mep, ...parsed.mep },
    };
  } catch {
    return DEFAULT_BRECHA_ALERTS;
  }
}

export function saveBrechaAlerts(settings: BrechaAlertsSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function evaluateBrechaAlerts(
  settings: BrechaAlertsSettings,
  values: {
    brechaCclPct: number | null;
    brechaBluePct: number | null;
    brechaMepPct: number | null;
  },
): BrechaAlertTrigger[] {
  const triggers: BrechaAlertTrigger[] = [];
  const pairs: Array<[BrechaType, number | null, BrechaAlertConfig]> = [
    ["ccl", values.brechaCclPct, settings.ccl],
    ["blue", values.brechaBluePct, settings.blue],
    ["mep", values.brechaMepPct, settings.mep],
  ];

  for (const [type, current, config] of pairs) {
    if (!config.enabled || current === null) continue;
    if (current >= config.thresholdPct) {
      triggers.push({
        type,
        label: BRECHA_LABELS[type],
        currentPct: current,
        thresholdPct: config.thresholdPct,
      });
    }
  }

  return triggers;
}

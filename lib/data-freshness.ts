export type FreshnessKind =
  | "quotes"
  | "indec_monthly"
  | "fiscal_quarterly"
  | "bcra_daily";

export type FreshnessStatus = "fresh" | "stale" | "unknown";

const MS_DAY = 24 * 60 * 60 * 1000;

function parseDate(date: string | null): Date | null {
  if (!date) return null;
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function ageInDays(date: string | null, now = new Date()): number | null {
  const parsed = parseDate(date);
  if (!parsed) return null;
  return (now.getTime() - parsed.getTime()) / MS_DAY;
}

export function getDataFreshness(
  date: string | null,
  kind: FreshnessKind,
  now = new Date(),
): FreshnessStatus {
  const days = ageInDays(date, now);
  if (days === null) return "unknown";

  switch (kind) {
    case "quotes":
      return days > 1 ? "stale" : "fresh";
    case "indec_monthly":
      return days > 45 ? "stale" : "fresh";
    case "fiscal_quarterly":
      return days > 180 ? "stale" : "fresh";
    case "bcra_daily":
      return days > 7 ? "stale" : "fresh";
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

export function formatRelativeAge(date: string | null, now = new Date()): string | null {
  const days = ageInDays(date, now);
  if (days === null) return null;
  if (days < 1) return "hace menos de 1 día";
  if (days < 2) return "hace 1 día";
  if (days < 30) return `hace ${Math.floor(days)} días`;
  const months = Math.floor(days / 30);
  return months === 1 ? "hace 1 mes" : `hace ${months} meses`;
}

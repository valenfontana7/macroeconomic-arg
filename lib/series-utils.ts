import type { BcraDataPoint } from "@/types/bcra";

export function percentChange(
  current: number,
  previous: number | undefined,
): number | null {
  if (previous === undefined || previous === 0) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export function findValueDaysAgo(
  series: BcraDataPoint[],
  days: number,
): BcraDataPoint | undefined {
  if (series.length === 0) return undefined;

  const target = new Date();
  target.setDate(target.getDate() - days);
  const targetTime = target.getTime();

  let closest: BcraDataPoint | undefined;
  let closestDiff = Infinity;

  for (const point of series) {
    const diff = Math.abs(new Date(point.fecha).getTime() - targetTime);
    if (diff < closestDiff) {
      closestDiff = diff;
      closest = point;
    }
  }

  return closest;
}

export function sliceSeriesByDays(
  series: BcraDataPoint[],
  days: number,
): BcraDataPoint[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return series.filter((point) => new Date(point.fecha) >= cutoff);
}

export function volatilityPercent(series: BcraDataPoint[]): number | null {
  if (series.length < 2) return null;

  const returns: number[] = [];
  for (let i = 1; i < series.length; i++) {
    const prev = series[i - 1].valor;
    if (prev === 0) continue;
    returns.push(((series[i].valor - prev) / Math.abs(prev)) * 100);
  }

  if (returns.length === 0) return null;

  const mean = returns.reduce((sum, value) => sum + value, 0) / returns.length;
  const variance =
    returns.reduce((sum, value) => sum + (value - mean) ** 2, 0) / returns.length;

  return Math.sqrt(variance);
}

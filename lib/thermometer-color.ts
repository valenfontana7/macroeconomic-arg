/** Interpola rojo → ámbar → verde según score 0–100 (tonos con contraste sobre fondo claro). */
export function scoreToGaugeColor(score: number): string {
  const t = Math.min(100, Math.max(0, score)) / 100;

  if (t <= 0.5) {
    return mixHex("#dc2626", "#d97706", t * 2);
  }
  return mixHex("#d97706", "#16a34a", (t - 0.5) * 2);
}

function mixHex(from: string, to: string, amount: number): string {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  const t = Math.min(1, Math.max(0, amount));
  const r = Math.round(a.r + (b.r - a.r) * t);
  const g = Math.round(a.g + (b.g - a.g) * t);
  const bl = Math.round(a.b + (b.b - a.b) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = hex.replace("#", "");
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

/** Posición (x, y) sobre el arco semicircular del termómetro. */
export function scoreToArcPoint(
  score: number,
  centerX: number,
  centerY: number,
  radius: number,
): { x: number; y: number; angle: number } {
  const t = Math.min(100, Math.max(0, score)) / 100;
  const angle = Math.PI - t * Math.PI;
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY - radius * Math.sin(angle),
    angle,
  };
}

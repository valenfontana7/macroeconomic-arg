import { BRAND_COLORS, BRAND_NAME } from "@/lib/brand";
import { MOOD_EMOJI, MOOD_LABELS, type MacroMood } from "@/lib/macro-score";

export const OG_SIZE = { width: 1200, height: 630 };

export type PulsoOgData = {
  score: number;
  mood: MacroMood;
  headline: string;
  inflation: string;
  brecha: string;
  date: string;
};

export function scoreToOgColor(score: number): string {
  const t = Math.min(100, Math.max(0, score)) / 100;
  if (t <= 0.5) {
    const amount = t * 2;
    return mixHex("#ef4444", "#fbbf24", amount);
  }
  return mixHex("#fbbf24", "#22c55e", (t - 0.5) * 2);
}

function mixHex(from: string, to: string, amount: number): string {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  const t = Math.min(1, Math.max(0, amount));
  return `rgb(${Math.round(a.r + (b.r - a.r) * t)}, ${Math.round(a.g + (b.g - a.g) * t)}, ${Math.round(a.b + (b.b - a.b) * t)})`;
}

function hexToRgb(hex: string) {
  const n = hex.replace("#", "");
  return {
    r: parseInt(n.slice(0, 2), 16),
    g: parseInt(n.slice(2, 4), 16),
    b: parseInt(n.slice(4, 6), 16),
  };
}

export function PulsoOgMarkup({ data }: { data: PulsoOgData }) {
  const accent = scoreToOgColor(data.score);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 64,
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        color: "#f8fafc",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill={BRAND_COLORS.surfaceElevated} />
            <path
              d="M6 24 L18 21"
              stroke={BRAND_COLORS.oficial}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M6 24 L26 10"
              stroke={BRAND_COLORS.paralelo}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          <div style={{ display: "flex", fontSize: 28, color: "#94a3b8", fontWeight: 600 }}>
            {BRAND_NAME}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#cbd5e1" }}>{data.date}</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
        <div
          style={{
            display: "flex",
            fontSize: 140,
            fontWeight: 800,
            color: accent,
            lineHeight: 1,
            letterSpacing: -4,
          }}
        >
          {String(data.score)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
          <div style={{ display: "flex", fontSize: 36, fontWeight: 700 }}>
            {`${MOOD_EMOJI[data.mood]} ${MOOD_LABELS[data.mood]}`}
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#cbd5e1", lineHeight: 1.35, maxWidth: 720 }}>
            {data.headline}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 32, fontSize: 24 }}>
        <div style={{ display: "flex", color: "#94a3b8" }}>
          {`Inflación ${data.inflation}`}
        </div>
        <div style={{ display: "flex", color: "#94a3b8" }}>
          {`Brecha CCL ${data.brecha}`}
        </div>
      </div>
    </div>
  );
}

export function dashboardToOgData(data: {
  macroScore: { score: number; mood: MacroMood };
  digest: string[];
  fetchedAt: string;
  indec: { ipcMonthly: number | null } | null;
  dollar: { brechaCclPct: number | null } | null;
  indicators: { slug: string; latestValue: number }[];
}): PulsoOgData {
  const inflationIndicator = data.indicators.find((i) => i.slug === "inflacion");
  const inflation =
    data.indec?.ipcMonthly != null
      ? `${data.indec.ipcMonthly.toFixed(1)}%`
      : inflationIndicator
        ? `${inflationIndicator.latestValue.toFixed(1)}%`
        : "—";

  return {
    score: data.macroScore.score,
    mood: data.macroScore.mood,
    headline: data.digest[0] ?? "Resumen del día",
    inflation,
    brecha:
      data.dollar?.brechaCclPct != null
        ? `${data.dollar.brechaCclPct.toFixed(1)}%`
        : "—",
    date: new Date(data.fetchedAt).toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };
}

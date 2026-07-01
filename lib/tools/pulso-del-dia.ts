import { MOOD_EMOJI, MOOD_LABELS } from "@/lib/macro-score";
import type { DashboardData } from "@/lib/dashboard-data";
import type { DailyPulseCard } from "@/lib/tools/types";
import { BRAND_NAME } from "@/lib/brand";
import { formatDate } from "@/lib/format";
import { getSiteUrl } from "@/lib/site-url";

export function buildDailyPulseCard(data: DashboardData): DailyPulseCard {
  const { macroScore, digest, dollar, indec, indicators } = data;
  const inflation = indicators.find((i) => i.slug === "inflacion");
  const reserves = indicators.find((i) => i.slug === "reservas");

  const headline = `${MOOD_EMOJI[macroScore.mood]} ${BRAND_NAME}: ${MOOD_LABELS[macroScore.mood].toLowerCase()} (${macroScore.score}/100)`;

  const lines = digest.slice(0, 3);

  const keyNumbers: DailyPulseCard["keyNumbers"] = [
    {
      label: "Termómetro",
      value: `${macroScore.score}/100`,
    },
    {
      label: "Inflación mensual",
      value:
        inflation !== undefined
          ? `${inflation.latestValue.toFixed(1)}%`
          : indec?.ipcMonthly != null
            ? `${indec.ipcMonthly.toFixed(1)}%`
            : "—",
    },
    {
      label: "Brecha CCL",
      value:
        dollar?.brechaCclPct != null ? `${dollar.brechaCclPct.toFixed(1)}%` : "—",
    },
  ];

  const shareText = [
    `📊 ${BRAND_NAME} — ${formatDate(data.fetchedAt)}`,
    headline,
    ...lines,
    "",
    `Inflación: ${keyNumbers[1]?.value} · Brecha CCL: ${keyNumbers[2]?.value}`,
    `${getSiteUrl()}/herramientas/pulso-del-dia`,
  ].join("\n");

  return {
    date: data.fetchedAt,
    score: macroScore.score,
    mood: macroScore.mood,
    headline,
    lines,
    keyNumbers,
    shareText,
  };
}

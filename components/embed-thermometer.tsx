import { BRAND_NAME } from "@/lib/brand";
import { MOOD_EMOJI, MOOD_LABELS, type MacroScoreResult } from "@/lib/macro-score";
import { scoreToGaugeColor } from "@/lib/thermometer-color";
import { getSiteUrl } from "@/lib/site-url";

type EmbedThermometerProps = {
  score: MacroScoreResult;
  showLink?: boolean;
};

export function EmbedThermometer({ score, showLink = true }: EmbedThermometerProps) {
  const accent = scoreToGaugeColor(score.score);
  const siteUrl = getSiteUrl();
  const hostname = new URL(siteUrl).hostname;

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-border/50 bg-card p-4 text-center">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {BRAND_NAME}
      </p>
      <div className="flex items-end gap-2">
        <span className="text-5xl font-bold tabular-nums" style={{ color: accent }}>
          {score.score}
        </span>
        <span className="pb-1 text-sm text-muted-foreground">/ 100</span>
      </div>
      <p className="text-sm font-medium">
        {MOOD_EMOJI[score.mood]} {MOOD_LABELS[score.mood]}
      </p>
      {showLink ? (
        <a
          href={siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary underline-offset-2 hover:underline"
        >
          {hostname}
        </a>
      ) : null}
    </div>
  );
}

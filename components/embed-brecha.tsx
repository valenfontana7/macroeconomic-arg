import { BRAND_NAME } from "@/lib/brand";
import { getSiteUrl } from "@/lib/site-url";

type EmbedBrechaProps = {
  brechaCclPct: number | null;
  showLink?: boolean;
};

export function EmbedBrecha({ brechaCclPct, showLink = true }: EmbedBrechaProps) {
  const siteUrl = getSiteUrl();
  const hostname = new URL(siteUrl).hostname;

  return (
    <div className="flex min-w-[240px] flex-col items-center gap-2 rounded-xl border border-border/50 bg-card p-4 text-center">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {BRAND_NAME} — Brecha CCL
      </p>
      <p className="text-4xl font-bold tabular-nums text-primary">
        {brechaCclPct != null ? `${brechaCclPct.toFixed(1)}%` : "—"}
      </p>
      <p className="text-xs text-muted-foreground">CCL vs dólar oficial</p>
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

import { BRAND_NAME } from "@/lib/brand";
import { formatCurrency } from "@/lib/format";
import { getSiteUrl } from "@/lib/site-url";
import type { DollarSnapshot } from "@/types/external";

type EmbedDollarPanelProps = {
  dollar: DollarSnapshot;
  showLink?: boolean;
};

export function EmbedDollarPanel({ dollar, showLink = true }: EmbedDollarPanelProps) {
  const siteUrl = getSiteUrl();
  const hostname = new URL(siteUrl).hostname;
  const oficial = dollar.quotes.find((q) => q.casa === "oficial");
  const ccl = dollar.quotes.find((q) => q.casa === "contadoconliqui");
  const blue = dollar.quotes.find((q) => q.casa === "blue");

  return (
    <div className="flex min-w-[280px] flex-col gap-3 rounded-xl border border-border/50 bg-card p-4 text-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {BRAND_NAME} — Dólar hoy
      </p>
      <div className="grid grid-cols-2 gap-2">
        {oficial ? (
          <div>
            <p className="text-xs text-muted-foreground">Oficial</p>
            <p className="font-semibold tabular-nums">{formatCurrency(oficial.venta)}</p>
          </div>
        ) : null}
        {blue ? (
          <div>
            <p className="text-xs text-muted-foreground">Blue</p>
            <p className="font-semibold tabular-nums">{formatCurrency(blue.venta)}</p>
          </div>
        ) : null}
        {ccl ? (
          <div>
            <p className="text-xs text-muted-foreground">CCL</p>
            <p className="font-semibold tabular-nums">{formatCurrency(ccl.venta)}</p>
          </div>
        ) : null}
        {dollar.brechaCclPct != null ? (
          <div>
            <p className="text-xs text-muted-foreground">Brecha CCL</p>
            <p className="font-semibold tabular-nums">{dollar.brechaCclPct.toFixed(1)}%</p>
          </div>
        ) : null}
      </div>
      {showLink ? (
        <a
          href={`${siteUrl}/dolar`}
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

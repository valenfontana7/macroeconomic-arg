import { getDollarSnapshot } from "@/lib/dolar-api-client";
import { formatNumber } from "@/lib/format";

/**
 * Cinta de mercados delgada: oficial, blue, MEP, CCL y brecha CCL.
 * Silenciosamente no muestra nada si no hay datos.
 */
export async function MarketsTape() {
  try {
    const snapshot = await getDollarSnapshot();
    const byId = (casa: string) =>
      snapshot.quotes.find((q) => q.casa === casa)?.venta ?? null;

    const items: { label: string; value: number | null }[] = [
      { label: "Oficial", value: byId("oficial") },
      { label: "Blue", value: byId("blue") },
      { label: "MEP", value: byId("bolsa") },
      { label: "CCL", value: byId("contadoconliqui") },
    ];

    const brecha =
      snapshot.brechaCclPct != null
        ? `${snapshot.brechaCclPct.toFixed(1)}%`
        : null;

    const visible = items.filter((i) => i.value != null);
    if (visible.length === 0) return null;

    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-9 items-center gap-4 overflow-x-auto whitespace-nowrap text-[13px] tabular-nums text-foreground/90">
          {visible.map((item, idx) => (
            <span key={item.label} className="flex items-center gap-1.5">
              <span className="text-foreground/60">{item.label}</span>
              <span className="font-semibold">${formatNumber(item.value!, 0)}</span>
              {idx < visible.length - 1 ? (
                <span aria-hidden className="mx-2 h-3 w-px bg-border/70" />
              ) : null}
            </span>
          ))}
          {brecha ? (
            <>
              <span aria-hidden className="mx-2 h-3 w-px bg-border/70" />
              <span className="flex items-center gap-1.5">
                <span className="text-foreground/60">Brecha CCL</span>
                <span className="font-semibold">{brecha}</span>
              </span>
            </>
          ) : null}
        </div>
      </div>
    );
  } catch {
    return null;
  }
}


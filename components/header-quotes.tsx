import { getDollarSnapshot } from "@/lib/dolar-api-client";
import { formatNumber } from "@/lib/format";

/**
 * Mini-cotizaciones para la franja superior del header.
 * Falla en silencio: si la API no responde, no se muestra nada.
 */
export async function HeaderQuotes() {
  let quotes: { label: string; value: number }[] = [];

  try {
    const snapshot = await getDollarSnapshot();
    const byId = (casa: string) =>
      snapshot.quotes.find((quote) => quote.casa === casa)?.venta ?? null;

    quotes = [
      { label: "Oficial", value: byId("oficial") },
      { label: "Blue", value: byId("blue") },
      { label: "MEP", value: byId("bolsa") },
    ].flatMap((item) =>
      item.value !== null ? [{ label: item.label, value: item.value }] : [],
    );
  } catch {
    return null;
  }

  if (quotes.length === 0) return null;

  return (
    <div className="flex items-center gap-3 font-mono text-[11px] tabular-nums sm:gap-4 sm:text-xs">
      {quotes.map((quote) => (
        <span key={quote.label} className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-white/70">{quote.label}</span>
          <span className="font-semibold text-white">
            ${formatNumber(quote.value, 0)}
          </span>
        </span>
      ))}
    </div>
  );
}

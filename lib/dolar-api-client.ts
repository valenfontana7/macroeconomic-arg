import { fetchExternalJson } from "@/lib/external-fetch";
import {
  dolarQuotesSchema,
  foreignQuoteSchema,
  type DolarQuote,
  type DollarSnapshot,
  type ForeignQuote,
} from "@/types/external";

const DOLAR_API_BASE = "https://dolarapi.com/v1";

export const FOREX_CURRENCIES = ["eur", "brl", "clp", "uyu"] as const;
export type ForexCurrency = (typeof FOREX_CURRENCIES)[number];

export const FOREX_LABELS: Record<ForexCurrency, string> = {
  eur: "Euro",
  brl: "Real brasileño",
  clp: "Peso chileno",
  uyu: "Peso uruguayo",
};

function spreadPct(parallel: number, official: number): number | null {
  if (official <= 0) return null;
  return ((parallel - official) / official) * 100;
}

function findQuote(quotes: DolarQuote[], casa: string): DolarQuote | undefined {
  return quotes.find((quote) => quote.casa === casa);
}

export async function getDolarQuotes(): Promise<DolarQuote[]> {
  return fetchExternalJson(`${DOLAR_API_BASE}/dolares`, dolarQuotesSchema, {
    revalidate: 900,
  });
}

export async function getForeignQuote(code: ForexCurrency): Promise<ForeignQuote> {
  return fetchExternalJson(
    `${DOLAR_API_BASE}/cotizaciones/${code}`,
    foreignQuoteSchema,
    { revalidate: 900 },
  );
}

export async function getForeignQuotes(
  codes: readonly ForexCurrency[] = FOREX_CURRENCIES,
): Promise<ForeignQuote[]> {
  const results = await Promise.allSettled(codes.map((code) => getForeignQuote(code)));
  return results
    .filter((result): result is PromiseFulfilledResult<ForeignQuote> => result.status === "fulfilled")
    .map((result) => result.value);
}

export async function getDollarSnapshot(): Promise<DollarSnapshot> {
  const quotes = await getDolarQuotes();
  const oficial = findQuote(quotes, "oficial");
  const blue = findQuote(quotes, "blue");
  const mep = findQuote(quotes, "bolsa");
  const ccl = findQuote(quotes, "contadoconliqui");
  const officialSell = oficial?.venta ?? null;

  return {
    quotes,
    brechaBluePct:
      officialSell !== null && blue ? spreadPct(blue.venta, officialSell) : null,
    brechaMepPct:
      officialSell !== null && mep ? spreadPct(mep.venta, officialSell) : null,
    brechaCclPct:
      officialSell !== null && ccl ? spreadPct(ccl.venta, officialSell) : null,
    updatedAt: oficial?.fechaActualizacion ?? blue?.fechaActualizacion ?? null,
  };
}

import {
  bcraCotizacionesResponseSchema,
  bcraSeriesResponseSchema,
  bcraVariablesResponseSchema,
  type BcraCotizacionDetalle,
  type BcraDataPoint,
  type BcraVariable,
} from "@/types/bcra";

const BCRA_BASE_URL = "https://api.bcra.gob.ar";
const DEFAULT_TIMEOUT_MS = 15_000;
const MAX_RETRIES = 2;

export class BcraApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "BcraApiError";
  }
}

type FetchBcraOptions = {
  revalidate?: number;
  searchParams?: Record<string, string | number | undefined>;
};

async function fetchWithTimeout(
  url: string,
  init: RequestInit & { next?: { revalidate?: number } },
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchBcraJson<T>(
  path: string,
  schema: { parse: (data: unknown) => T },
  options: FetchBcraOptions = {},
): Promise<T> {
  const url = new URL(path, BCRA_BASE_URL);

  if (options.searchParams) {
    for (const [key, value] of Object.entries(options.searchParams)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetchWithTimeout(url.toString(), {
        headers: { Accept: "application/json" },
        next: { revalidate: options.revalidate ?? 3600 },
      });

      if (!response.ok) {
        throw new BcraApiError(
          `BCRA respondió con status ${response.status}`,
          response.status,
        );
      }

      const json: unknown = await response.json();
      return schema.parse(json);
    } catch (error) {
      lastError = error;
      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new BcraApiError("No se pudo conectar con la API del BCRA");
}

export async function getVariableMetadata(
  idVariable: number,
  revalidate = 3600,
): Promise<BcraVariable | null> {
  const data = await fetchBcraJson(
    "/estadisticas/v4.0/monetarias",
    bcraVariablesResponseSchema,
    {
      revalidate,
      searchParams: { IdVariable: idVariable },
    },
  );

  return data.results[0] ?? null;
}

export async function getVariableSeries(
  idVariable: number,
  desde?: string,
  hasta?: string,
  revalidate = 3600,
): Promise<BcraDataPoint[]> {
  const data = await fetchBcraJson(
    `/estadisticas/v4.0/monetarias/${idVariable}`,
    bcraSeriesResponseSchema,
    {
      revalidate,
      searchParams: {
        desde,
        hasta,
        limit: 1000,
      },
    },
  );

  const series = data.results[0]?.detalle ?? [];
  return [...series].sort(
    (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime(),
  );
}

export async function getCotizaciones(
  fecha?: string,
  revalidate = 3600,
): Promise<{ fecha: string; detalle: BcraCotizacionDetalle[] }> {
  const data = await fetchBcraJson(
    "/estadisticascambiarias/v1.0/Cotizaciones",
    bcraCotizacionesResponseSchema,
    {
      revalidate,
      searchParams: fecha ? { fecha } : undefined,
    },
  );

  return data.results;
}

export function getUsdCotizacion(
  detalle: BcraCotizacionDetalle[],
): BcraCotizacionDetalle | undefined {
  return detalle.find((item) => item.codigoMoneda === "USD");
}

export {
  findValueDaysAgo,
  percentChange,
  sliceSeriesByDays,
  volatilityPercent,
} from "@/lib/series-utils";

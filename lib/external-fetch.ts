const DEFAULT_TIMEOUT_MS = 15_000;
const MAX_RETRIES = 2;

type FetchJsonOptions = {
  revalidate?: number;
  searchParams?: Record<string, string | number | undefined>;
};

export async function fetchExternalJson<T>(
  url: string,
  schema: { parse: (data: unknown) => T },
  options: FetchJsonOptions = {},
): Promise<T> {
  const target = new URL(url);
  if (options.searchParams) {
    for (const [key, value] of Object.entries(options.searchParams)) {
      if (value !== undefined) {
        target.searchParams.set(key, String(value));
      }
    }
  }

  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

      try {
        const response = await fetch(target.toString(), {
          headers: { Accept: "application/json" },
          signal: controller.signal,
          next: { revalidate: options.revalidate ?? 3600 },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} al consultar ${target.hostname}`);
        }

        const json: unknown = await response.json();
        return schema.parse(json);
      } finally {
        clearTimeout(timeout);
      }
    } catch (error) {
      lastError = error;
      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`No se pudo consultar ${target.hostname}`);
}

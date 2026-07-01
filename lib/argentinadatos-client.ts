import { fetchExternalJson } from "@/lib/external-fetch";
import { sliceSeriesByDays } from "@/lib/series-utils";
import {
  argentinaDatosCotizacionSchema,
  argentinaDatosInflacionSchema,
  argentinaDatosRiesgoPaisSchema,
  type CountryRiskSnapshot,
} from "@/types/external";
import type { BcraDataPoint } from "@/types/bcra";

const BASE_URL = "https://api.argentinadatos.com/v1";

export async function getCountryRisk(): Promise<CountryRiskSnapshot> {
  return fetchExternalJson(
    `${BASE_URL}/finanzas/indices/riesgo-pais/ultimo`,
    argentinaDatosRiesgoPaisSchema,
    { revalidate: 3600 },
  );
}

export async function getInflacionIndecHistory(): Promise<BcraDataPoint[]> {
  const data = await fetchExternalJson(
    `${BASE_URL}/finanzas/indices/inflacion`,
    argentinaDatosInflacionSchema,
    { revalidate: 86400 },
  );

  return data.map((point) => ({
    fecha: point.fecha,
    valor: point.valor,
  }));
}

export async function getDollarHistory(
  casa: "oficial" | "blue" | "bolsa" | "contadoconliqui",
  days = 365,
): Promise<BcraDataPoint[]> {
  const data = await fetchExternalJson(
    `${BASE_URL}/cotizaciones/dolares/${casa}`,
    argentinaDatosCotizacionSchema,
    { revalidate: 3600 },
  );

  const series = data.map((point) => ({
    fecha: point.fecha,
    valor: point.venta,
  }));

  return sliceSeriesByDays(series, days);
}

export async function getBrechaCclSeries(days = 365): Promise<BcraDataPoint[]> {
  const [oficial, ccl] = await Promise.all([
    getDollarHistory("oficial", days),
    getDollarHistory("contadoconliqui", days),
  ]);

  const cclByDate = new Map(ccl.map((point) => [point.fecha, point.valor]));

  return oficial
    .map((point) => {
      const cclValue = cclByDate.get(point.fecha);
      if (!cclValue || point.valor <= 0) return null;
      return {
        fecha: point.fecha,
        valor: ((cclValue - point.valor) / point.valor) * 100,
      };
    })
    .filter((point): point is BcraDataPoint => point !== null);
}

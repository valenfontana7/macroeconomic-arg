import { DashboardView } from "@/components/dashboard-view";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getDashboardData } from "@/lib/dashboard-data";
import { getThermometerHistory } from "@/lib/thermometer-history";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Dólar, inflación y brecha cambiaria hoy en Argentina",
  description:
    "Dashboard macro argentino con dólar oficial, blue, MEP y CCL, inflación INDEC, reservas del BCRA y termómetro del día. Datos en criollo para entender la brecha.",
  path: "/",
  keywords: [
    "dólar hoy argentina",
    "brecha cambiaria hoy",
    "inflación argentina hoy",
    "termómetro macro argentina",
    "cotización dólar blue MEP CCL",
  ],
});

export const revalidate = 3600;

export default async function HomePage() {
  const [data, thermometerHistory] = await Promise.all([
    getDashboardData(),
    getThermometerHistory(90),
  ]);

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <DashboardView data={data} thermometerHistory={thermometerHistory} />
      </main>
      <SiteFooter />
    </>
  );
}

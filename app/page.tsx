import { DashboardView } from "@/components/dashboard-view";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getDashboardData } from "@/lib/dashboard-data";
import { buildMacroBriefing } from "@/lib/macro-briefing";
import { getThermometerHistory } from "@/lib/thermometer-history";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Dólar hoy: cotización del dólar blue, oficial, MEP y CCL en Argentina",
  description:
    "Cotización del dólar hoy en Argentina: blue, oficial, MEP, CCL y tarjeta en tiempo real, con brecha cambiaria, inflación INDEC y reservas del BCRA. Datos de fuentes oficiales y de mercado.",
  path: "/",
  keywords: [
    "dólar hoy",
    "dólar blue hoy",
    "cotización dólar",
    "dólar oficial hoy",
    "dólar MEP hoy",
    "brecha cambiaria hoy",
    "inflación argentina hoy",
  ],
});

export const revalidate = 900;

export default async function HomePage() {
  const [data, thermometerHistory] = await Promise.all([
    getDashboardData(),
    getThermometerHistory(90),
  ]);
  const editorialBriefing = buildMacroBriefing(data, "home");

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <DashboardView
          data={data}
          thermometerHistory={thermometerHistory}
          editorialBriefing={editorialBriefing}
        />
      </main>
      <SiteFooter />
    </>
  );
}

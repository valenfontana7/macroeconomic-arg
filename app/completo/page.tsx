import { DashboardView } from "@/components/dashboard-view";
import { MarketsTape } from "@/components/markets-tape";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getDashboardData } from "@/lib/dashboard-data";
import { buildMacroBriefing } from "@/lib/macro-briefing";
import { getThermometerHistory } from "@/lib/thermometer-history";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Vista completa del tablero macro",
  description:
    "Todos los indicadores y gráficos: dólar, inflación, brecha, reservas, tasa y más.",
  path: "/completo",
});

export const revalidate = 900;

export default async function CompletoPage() {
  const [data, thermometerHistory] = await Promise.all([
    getDashboardData(),
    getThermometerHistory(90),
  ]);
  const editorialBriefing = buildMacroBriefing(data, "home");

  return (
    <>
      <SiteHeader />
      <MarketsTape />
      <main id="main-content" className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          <DashboardView
            data={data}
            thermometerHistory={thermometerHistory}
            editorialBriefing={editorialBriefing}
          />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}


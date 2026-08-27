import { MarketsTape } from "@/components/markets-tape";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getDashboardData } from "@/lib/dashboard-data";
import { buildPageMetadata } from "@/lib/seo";
import { MarketsDesk } from "@/components/markets-desk";

export const metadata = buildPageMetadata({
  title: "Mercados",
  description: "Cotizaciones, clima y señales en tablas y gráficos de diario.",
  path: "/completo",
});

export const revalidate = 900;

export default async function CompletoPage() {
  const data = await getDashboardData();

  return (
    <>
      <SiteHeader />
      <MarketsTape />
      <main id="main-content" className="flex-1">
        <MarketsDesk data={data} />
      </main>
      <SiteFooter />
    </>
  );
}


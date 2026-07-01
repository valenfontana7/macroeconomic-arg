import { DashboardView } from "@/components/dashboard-view";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getDashboardData } from "@/lib/dashboard-data";
import { getThermometerHistory } from "@/lib/thermometer-history";

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

import { DashboardView } from "@/components/dashboard-view";
import { SiteHeader } from "@/components/site-header";
import { getDashboardData } from "@/lib/dashboard-data";

export const revalidate = 3600;

export default async function HomePage() {
  const data = await getDashboardData();

  return (
    <>
      <SiteHeader />
      <main>
        <DashboardView data={data} />
      </main>
      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        Datos del BCRA · No constituye asesoramiento financiero ·{" "}
        <a href="/acerca" className="underline underline-offset-2">
          Más info
        </a>
      </footer>
    </>
  );
}

import { EmbedDollarPanel } from "@/components/embed-dollar-panel";
import { getDashboardData } from "@/lib/dashboard-data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Embed panel dólar",
  description: "Widget embebible con cotizaciones del dólar en Argentina.",
  path: "/embed/dollar",
  noIndex: true,
});

export const revalidate = 900;

export default async function EmbedDollarPage() {
  const data = await getDashboardData();

  if (!data.dollar) {
    return (
      <main className="flex min-h-screen items-center justify-center p-3 text-sm text-muted-foreground">
        Cotizaciones no disponibles
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-3">
      <EmbedDollarPanel dollar={data.dollar} />
    </main>
  );
}

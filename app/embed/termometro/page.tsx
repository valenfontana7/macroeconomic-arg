import { EmbedThermometer } from "@/components/embed-thermometer";
import { getDashboardData } from "@/lib/dashboard-data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Embed termómetro macro",
  description: "Widget embebible del termómetro macro de La Brecha.",
  path: "/embed/termometro",
  noIndex: true,
});

export const revalidate = 900;

export default async function EmbedTermometroPage() {
  const data = await getDashboardData();

  return (
    <main className="flex min-h-screen items-center justify-center p-3">
      <EmbedThermometer score={data.macroScore} />
    </main>
  );
}

import { EmbedBrecha } from "@/components/embed-brecha";
import { getDashboardData } from "@/lib/dashboard-data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Embed brecha CCL",
  description: "Widget embebible de la brecha CCL vs oficial.",
  path: "/embed/brecha",
  noIndex: true,
});

export const revalidate = 900;

export default async function EmbedBrechaPage() {
  const data = await getDashboardData();

  return (
    <main className="flex min-h-screen items-center justify-center p-3">
      <EmbedBrecha brechaCclPct={data.dollar?.brechaCclPct ?? null} />
    </main>
  );
}

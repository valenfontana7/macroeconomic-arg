import { EmbedThermometer } from "@/components/embed-thermometer";
import { getDashboardData } from "@/lib/dashboard-data";

export const revalidate = 900;

export default async function EmbedTermometroPage() {
  const data = await getDashboardData();

  return (
    <main className="flex min-h-screen items-center justify-center p-3">
      <EmbedThermometer score={data.macroScore} />
    </main>
  );
}

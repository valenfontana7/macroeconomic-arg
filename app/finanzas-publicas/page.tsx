import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TrendChart } from "@/components/trend-chart";
import { ReportDataIssue } from "@/components/report-data-issue";
import { getFiscalSeries } from "@/lib/fiscal-client";
import { buildPageMetadata } from "@/lib/seo";
import { METHODOLOGY_VERSION, THERMOMETER_WEIGHTS } from "@/lib/methodology";

export const metadata = buildPageMetadata({
  title: "Finanzas públicas — resultado fiscal y deuda externa",
  description:
    "Resultado primario, déficit financiero y deuda externa del sector público argentino. Series IMIG e INDEC con contexto para el termómetro macro.",
  path: "/finanzas-publicas",
  keywords: ["finanzas públicas argentina", "resultado primario", "deuda externa", "déficit fiscal"],
});

export const revalidate = 86400;

export default async function FinanzasPublicasPage() {
  const series = await getFiscalSeries();

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Indicadores", href: "/indicadores" },
            { label: "Finanzas públicas" },
          ]}
        />

        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-bold tracking-tight">Finanzas públicas</h1>
          <p className="max-w-2xl text-muted-foreground">
            Series oficiales del IMIG (Ministerio de Economía) e INDEC sobre el resultado
            fiscal y la deuda externa del gobierno general.
          </p>
        </div>

        <section className="rounded-xl border border-border/60 bg-muted/20 p-4 text-sm leading-relaxed text-muted-foreground">
          <h2 className="mb-2 font-medium text-foreground">Qué entra al termómetro ({METHODOLOGY_VERSION})</h2>
          <ul className="list-inside list-disc space-y-1">
            <li>
              <strong className="text-foreground">Resultado primario (3 meses)</strong> —{" "}
              {THERMOMETER_WEIGHTS.find((w) => w.label.includes("primario"))?.weight ?? "10%"}
            </li>
            <li>
              <strong className="text-foreground">Variación YoY de deuda externa</strong> —{" "}
              {THERMOMETER_WEIGHTS.find((w) => w.label.includes("Deuda externa"))?.weight ?? "7%"}
            </li>
            <li>
              El resultado financiero y el stock de deuda en USD se muestran acá pero no
              scorean el termómetro hasta contar con series más estables para deuda/PIB.
            </li>
          </ul>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <TrendChart
            title="Resultado primario mensual"
            subtitle="IMIG — millones ARS (SPNF)"
            series={series.primaryBalance}
            format="number"
            color="#1d4ed8"
          />
          <TrendChart
            title="Resultado financiero trimestral"
            subtitle="IMIG — incluye intereses de deuda"
            series={series.financialResult}
            format="number"
            color="#7c3aed"
          />
          <TrendChart
            title="Deuda externa pública"
            subtitle="INDEC — USD millones (stock trimestral)"
            series={series.externalDebt}
            format="number"
            color="#dc2626"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/indicadores" className="text-sm text-primary underline-offset-2 hover:underline">
            ← Volver a indicadores
          </Link>
          <ReportDataIssue />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

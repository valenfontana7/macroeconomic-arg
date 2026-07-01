import Link from "next/link";

import { AdSlot } from "@/components/ad-slot";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TrendChart } from "@/components/trend-chart";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInflacionIndecHistory } from "@/lib/argentinadatos-client";
import { getDashboardData } from "@/lib/dashboard-data";
import { getIndecInflationSeries } from "@/lib/datos-gobar-client";
import { formatDate, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Inflación en Argentina — IPC mensual e interanual",
  description:
    "Inflación INDEC mensual e interanual, gráficos históricos y herramientas para medir el impacto en tu bolsillo.",
};

export const revalidate = 3600;

export default async function InflacionPage() {
  const [dashboard, ipcSeries, indecAnnual] = await Promise.all([
    getDashboardData(),
    getIndecInflationSeries(),
    getInflacionIndecHistory(),
  ]);

  const inflation = dashboard.indicators.find((i) => i.slug === "inflacion");
  const badlar = dashboard.indicators.find((i) => i.slug === "badlar");

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
        <Breadcrumbs
          items={[{ label: "Inicio", href: "/" }, { label: "Inflación" }]}
        />

        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Inflación en Argentina
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            IPC mensual del INDEC, variación interanual y cómo se compara con la tasa
            BADLAR de plazos fijos.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-border/60 bg-card/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                IPC mensual (INDEC)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tabular-nums">
                {dashboard.indec?.ipcMonthly != null
                  ? `${formatNumber(dashboard.indec.ipcMonthly, 1)}%`
                  : inflation
                    ? `${formatNumber(inflation.latestValue, 1)}%`
                    : "—"}
              </p>
              {inflation ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  Serie BCRA al {formatDate(inflation.latestDate)}
                </p>
              ) : null}
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Interanual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tabular-nums">
                {dashboard.indec?.ipcAnnual != null
                  ? `${formatNumber(dashboard.indec.ipcAnnual, 1)}%`
                  : "—"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                BADLAR (plazo fijo)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tabular-nums">
                {badlar ? `${formatNumber(badlar.latestValue, 1)}%` : "—"}
              </p>
              {badlar ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {badlar.latestValue >= (dashboard.indec?.ipcAnnual ?? 0)
                    ? "Por encima de inflación interanual"
                    : "Por debajo de inflación interanual"}
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <TrendChart
          title="IPC mensual"
          subtitle="Variación mensual INDEC"
          series={ipcSeries.ipcMonthly}
          format="percent"
        />

        <TrendChart
          title="Inflación interanual"
          subtitle="ArgentinaDatos / INDEC"
          series={indecAnnual}
          format="percent"
        />

        <section className="rounded-2xl border border-border/60 bg-card/40 p-5">
          <h2 className="font-heading text-lg font-semibold">Comparador rápido</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Si la BADLAR no le gana a la inflación interanual, ahorrar en pesos pierde
            poder adquisitivo. Probá cuánto te afecta con tu sueldo:
          </p>
          <Link
            href="/herramientas/sueldo-vs-inflacion"
            className={cn(buttonVariants(), "mt-4 inline-flex")}
          >
            Tu sueldo vs inflación
          </Link>
        </section>

        <AdSlot placement="dashboard-mid-content" />
      </main>
      <SiteFooter />
    </>
  );
}

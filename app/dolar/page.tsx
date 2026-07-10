import Link from "next/link";

import { AdSlot } from "@/components/ad-slot";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { DollarMultiChart } from "@/components/dollar-multi-chart";
import { DollarPanel } from "@/components/dollar-panel";
import { HubEditorialPanel } from "@/components/hub-editorial-panel";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ToolsPromo } from "@/components/tools/tools-promo";
import { buttonVariants } from "@/components/ui/button";
import { getDollarHistory } from "@/lib/argentinadatos-client";
import { getDashboardData } from "@/lib/dashboard-data";
import { buildMacroBriefing } from "@/lib/macro-briefing";
import { cn } from "@/lib/utils";
import { buildPageMetadata, DOLAR_FAQ, faqJsonLdFromPairs } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const metadata = buildPageMetadata({
  title: "Dólar hoy en Argentina — oficial, blue, MEP y CCL",
  description:
    "Cotización del dólar hoy: oficial, blue, MEP y CCL con brecha cambiaria, histórico de un año y herramientas para entender el mercado paralelo.",
  path: "/dolar",
  keywords: [
    "dólar hoy",
    "dólar blue hoy",
    "dólar oficial hoy",
    "dólar MEP hoy",
    "dólar CCL hoy",
    "brecha cambiaria",
    "cotización dólar argentina",
  ],
});

export const revalidate = 900;

export default async function DolarPage() {
  const [dashboard, oficial, blue, bolsa, ccl] = await Promise.all([
    getDashboardData(),
    getDollarHistory("oficial", 365),
    getDollarHistory("blue", 365),
    getDollarHistory("bolsa", 365),
    getDollarHistory("contadoconliqui", 365),
  ]);

  const editorialBriefing = buildMacroBriefing(dashboard, "dolar");

  return (
    <>
      <JsonLd data={faqJsonLdFromPairs([...DOLAR_FAQ])} />
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
        <Breadcrumbs
          items={[{ label: "Inicio", href: "/" }, { label: "Dólar" }]}
          currentPath="/dolar"
        />

        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Dólar en Argentina
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Todas las cotizaciones en un solo lugar: oficial, paralelas, brechas y
            evolución histórica con datos de DolarAPI y ArgentinaDatos.
          </p>
        </div>

        {dashboard.dollar ? <DollarPanel dollar={dashboard.dollar} /> : null}

        <section className="flex flex-col gap-3">
          <h2 className="font-heading text-xl font-semibold">Histórico comparado</h2>
          <p className="text-sm text-muted-foreground">
            Oficial, blue, MEP y CCL en el mismo gráfico para ver cómo se abre o cierra
            la brecha en el tiempo.
          </p>
          <DollarMultiChart oficial={oficial} blue={blue} bolsa={bolsa} ccl={ccl} />
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href="/herramientas/dolarizacion-historica" className={cn(buttonVariants())}>
            Simular dolarización
          </Link>
          <Link
            href="/aprende/brecha-ccl"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            ¿Qué es la brecha?
          </Link>
        </div>

        <ToolsPromo />

        <HubEditorialPanel briefing={editorialBriefing} scope="dolar" />

        <AdSlot placement="dashboard-mid-content" />
      </main>
      <SiteFooter />
    </>
  );
}

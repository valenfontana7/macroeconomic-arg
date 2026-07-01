import Link from "next/link";

import { AdSlot } from "@/components/ad-slot";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { DollarMultiChart } from "@/components/dollar-multi-chart";
import { DollarPanel } from "@/components/dollar-panel";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ToolsPromo } from "@/components/tools/tools-promo";
import { buttonVariants } from "@/components/ui/button";
import { getDollarHistory } from "@/lib/argentinadatos-client";
import { getDashboardData } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Dólar hoy en Argentina — cotizaciones y brechas",
  description:
    "Cotizaciones del dólar oficial, blue, MEP y CCL con brechas, histórico superpuesto y herramientas interactivas.",
};

export const revalidate = 900;

export default async function DolarPage() {
  const [dashboard, oficial, blue, bolsa, ccl] = await Promise.all([
    getDashboardData(),
    getDollarHistory("oficial", 365),
    getDollarHistory("blue", 365),
    getDollarHistory("bolsa", 365),
    getDollarHistory("contadoconliqui", 365),
  ]);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
        <Breadcrumbs
          items={[{ label: "Inicio", href: "/" }, { label: "Dólar" }]}
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
        <AdSlot placement="dashboard-mid-content" />
      </main>
      <SiteFooter />
    </>
  );
}

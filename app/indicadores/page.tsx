import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { IndicatorCard } from "@/components/indicator-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { getDashboardData } from "@/lib/dashboard-data";
import { INDICATORS, PILLAR_LABELS, type IndicatorPillar } from "@/lib/indicators";

export const metadata = {
  title: "Indicadores macro de Argentina",
  description:
    "Listado de indicadores del BCRA e INDEC: reservas, dólar, inflación, tasas y más.",
};

export const revalidate = 3600;

const PILLAR_ORDER: IndicatorPillar[] = ["externo", "cambio", "precios", "monetario"];

export default async function IndicadoresPage() {
  const data = await getDashboardData();
  const bySlug = new Map(data.indicators.map((i) => [i.slug, i]));

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
        <Breadcrumbs
          items={[{ label: "Inicio", href: "/" }, { label: "Indicadores" }]}
        />

        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Indicadores macro
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            {INDICATORS.length} series oficiales agrupadas por pilar. Cada tarjeta muestra
            la fecha de la última observación y variación reciente.
          </p>
        </div>

        {PILLAR_ORDER.map((pillar) => {
          const configs = INDICATORS.filter((i) => i.pillar === pillar);
          return (
            <section key={pillar} className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-xl font-semibold">
                  {PILLAR_LABELS[pillar]}
                </h2>
                <Badge variant="outline">{configs.length}</Badge>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {configs.map((config) => {
                  const snapshot = bySlug.get(config.slug);
                  if (!snapshot) return null;
                  return <IndicatorCard key={config.slug} indicator={snapshot} />;
                })}
              </div>
            </section>
          );
        })}

        <p className="text-sm text-muted-foreground">
          ¿No sabés por dónde empezar?{" "}
          <Link href="/herramientas/arbol-decisiones" className="text-primary hover:underline">
            Usá el árbol de decisiones
          </Link>
          .
        </p>
      </main>
      <SiteFooter />
    </>
  );
}

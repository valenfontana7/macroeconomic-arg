import Link from "next/link";

import { AdSlot } from "@/components/ad-slot";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { IndicatorCard } from "@/components/indicator-card";
import { IndicatorsViewToggle } from "@/components/indicators-view-toggle";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { getDashboardData } from "@/lib/dashboard-data";
import { INDICATORS, PILLAR_LABELS, type IndicatorPillar } from "@/lib/indicators";
import { buildPageMetadata, canonicalUrl, itemListJsonLd } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Indicadores macro de Argentina — BCRA e INDEC",
  description:
    "Listado de indicadores macro argentinos: reservas, dólar mayorista y minorista, inflación, base monetaria, BADLAR y más. Datos oficiales actualizados.",
  path: "/indicadores",
  keywords: [
    "indicadores macro argentina",
    "reservas BCRA",
    "base monetaria argentina",
    "BADLAR hoy",
  ],
});

export const revalidate = 3600;

const PILLAR_ORDER: IndicatorPillar[] = ["externo", "cambio", "precios", "monetario"];

export default async function IndicadoresPage() {
  const data = await getDashboardData();
  const bySlug = new Map(data.indicators.map((i) => [i.slug, i]));

  const listJsonLd = itemListJsonLd(
    "Indicadores macro de Argentina",
    INDICATORS.map((i) => ({
      name: i.label,
      url: canonicalUrl(`/indicador/${i.slug}`),
    })),
  );

  const cardsView = (
    <>
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
    </>
  );

  return (
    <>
      <JsonLd data={listJsonLd} />
      <SiteHeader />
      <main id="main-content" className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
        <Breadcrumbs
          items={[{ label: "Inicio", href: "/" }, { label: "Indicadores" }]}
          currentPath="/indicadores"
        />

        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Indicadores macro
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            {INDICATORS.length} series oficiales agrupadas por pilar, más finanzas
            públicas. Cada tarjeta muestra la fecha de la última observación y variación
            reciente.
          </p>
        </div>

        <IndicatorsViewToggle
          indicators={data.indicators}
          fiscalIndicators={data.fiscalIndicators}
          cards={cardsView}
        />

        <p className="text-sm text-muted-foreground">
          ¿No sabés por dónde empezar?{" "}
          <Link href="/herramientas/arbol-decisiones" className="text-primary hover:underline">
            Usá el árbol de decisiones
          </Link>
          {" · "}
          <Link href="/finanzas-publicas" className="text-primary hover:underline">
            Hub fiscal
          </Link>
          .
        </p>

        <AdSlot placement="indicadores-footer" />
      </main>
      <SiteFooter />
    </>
  );
}

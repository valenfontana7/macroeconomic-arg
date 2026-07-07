import Link from "next/link";
import { notFound } from "next/navigation";

import { AdSlot } from "@/components/ad-slot";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ExportSeriesButton } from "@/components/export-series-button";
import { IndicatorLearnPanel } from "@/components/indicator-learn-panel";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TrendChart } from "@/components/trend-chart";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getIndicatorDetail } from "@/lib/dashboard-data";
import { formatChange, formatDate, formatNumber } from "@/lib/format";
import { getChartFormat } from "@/lib/indicator-format";
import { interpretIndicator } from "@/lib/indicator-reading";
import { getConceptForIndicator } from "@/lib/macro-education";
import { INDICATOR_BY_SLUG, PILLAR_LABELS, type IndicatorSlug } from "@/lib/indicators";
import { buildPageMetadata, datasetJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { cn } from "@/lib/utils";
import type { SignalLevel } from "@/lib/macro-score";

export const revalidate = 3600;

type PageProps = {
  params: Promise<{ slug: string }>;
};

const SIGNAL_STYLES: Record<SignalLevel, string> = {
  good: "bg-emerald-50 text-emerald-700 border-emerald-300",
  warning: "bg-amber-50 text-amber-700 border-amber-300",
  danger: "bg-red-50 text-red-700 border-red-300",
};

function formatValue(slug: IndicatorSlug, value: number): string {
  if (
    slug === "inflacion" ||
    slug === "m2-privado" ||
    slug === "badlar" ||
    slug === "prestamos-personales"
  ) {
    return `${formatNumber(value, 1)}%`;
  }
  if (slug === "tc-mayorista" || slug === "tc-minorista" || slug === "uva") {
    return `$ ${formatNumber(value, 2)}`;
  }
  return formatNumber(value, 0);
}

export async function generateStaticParams() {
  return Object.keys(INDICATOR_BY_SLUG).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const indicator = INDICATOR_BY_SLUG[slug as IndicatorSlug];
  if (!indicator) return { title: "Indicador no encontrado" };

  const concept = getConceptForIndicator(indicator.slug);
  const description =
    concept?.enCristiano ??
    `${indicator.description} Datos actualizados del BCRA e INDEC en Argentina.`;

  return buildPageMetadata({
    title: `${indicator.label} hoy en Argentina`,
    description,
    path: `/indicador/${indicator.slug}`,
    keywords: [indicator.label, "Argentina", "BCRA", "INDEC", indicator.slug],
  });
}

export default async function IndicatorPage({ params }: PageProps) {
  const { slug } = await params;
  const indicator = INDICATOR_BY_SLUG[slug as IndicatorSlug];
  if (!indicator) notFound();

  const detail = await getIndicatorDetail(slug as IndicatorSlug);
  if (!detail) notFound();

  const concept = getConceptForIndicator(indicator.slug);
  const reading = interpretIndicator(
    indicator.slug,
    detail.latestValue,
    detail.change30d,
  );

  return (
    <>
      <JsonLd
        data={datasetJsonLd({
          name: indicator.label,
          description: concept?.enCristiano ?? indicator.description,
          path: `/indicador/${indicator.slug}`,
        })}
      />
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Indicadores", href: "/indicadores" },
            { label: indicator.label },
          ]}
          currentPath={`/indicador/${indicator.slug}`}
        />
        <div className="flex flex-col gap-3">
          <Badge variant="outline" className="w-fit">
            {PILLAR_LABELS[indicator.pillar]}
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight">{indicator.label}</h1>
          <p className="text-muted-foreground">
            {concept?.enCristiano ?? indicator.description}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/60 bg-card/60">
            <CardHeader className="pb-2">
              <CardDescription>Valor actual</CardDescription>
              <CardTitle className="text-2xl tabular-nums">
                {formatValue(indicator.slug, detail.latestValue)}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              {formatDate(detail.latestDate)}
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card/60">
            <CardHeader className="pb-2">
              <CardDescription>Variación 7 días</CardDescription>
              <CardTitle className="text-2xl tabular-nums">
                {formatChange(detail.change7d)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-border/60 bg-card/60">
            <CardHeader className="pb-2">
              <CardDescription>Variación 30 días</CardDescription>
              <CardTitle className="text-2xl tabular-nums">
                {formatChange(detail.change30d)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-border/60 bg-card/60">
            <CardHeader className="pb-2">
              <CardDescription>Variación 1 año</CardDescription>
              <CardTitle className="text-2xl tabular-nums">
                {formatChange(detail.change365d)}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card className="border-border/60 bg-card/60">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <CardTitle>Cómo leer este número ahora</CardTitle>
              <CardDescription>Interpretación según el valor actual</CardDescription>
            </div>
            <Badge variant="outline" className={cn("shrink-0", SIGNAL_STYLES[reading.signal])}>
              {reading.signal === "good"
                ? "OK"
                : reading.signal === "warning"
                  ? "Atento"
                  : "Alerta"}
            </Badge>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
            <p className="font-medium text-foreground">{reading.label}</p>
            <p>{reading.explanation}</p>
          </CardContent>
        </Card>

        {concept ? (
          <section id="aprender" className="scroll-mt-20 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="font-heading text-xl font-semibold">Aprendé sobre este indicador</h2>
              <p className="text-sm text-muted-foreground">
                Explicación clara, sin jerga de economista.
              </p>
            </div>
            <IndicatorLearnPanel concept={concept} />
            <Link
              href={`/aprende/${concept.slug}`}
              className="text-sm text-primary underline-offset-2 hover:underline"
            >
              Ver en el glosario →
            </Link>
          </section>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="sr-only">Gráfico histórico</h2>
          <ExportSeriesButton
            series={detail.series}
            filename={`la-brecha-${indicator.slug}.csv`}
            valueLabel={indicator.label}
          />
        </div>

        <TrendChart
          title={`Histórico: ${indicator.label}`}
          subtitle={indicator.unit}
          series={detail.series}
          format={getChartFormat(indicator.slug)}
        />

        <Card className="border-border/60 bg-card/60">
          <CardHeader>
            <CardTitle>¿Cómo me afecta?</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
            <p>{concept?.enTuVida ?? indicator.impact}</p>
            <Separator />
            <p>
              Fuente: BCRA — Estadísticas Monetarias v4.0 (variable ID{" "}
              {indicator.id}). Los datos se actualizan según la periodicidad
              oficial de cada serie.
            </p>
          </CardContent>
        </Card>

        <AdSlot placement="indicador-footer" />
      </main>
      <SiteFooter />
    </>
  );
}

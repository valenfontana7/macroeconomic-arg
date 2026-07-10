import { AdSlot } from "@/components/ad-slot";
import { BrechaAlertsBanner } from "@/components/brecha-alerts-banner";
import { BrechaAlertsSettings } from "@/components/brecha-alerts-settings";
import { CollapsibleDollarPanel } from "@/components/collapsible-dollar-panel";
import { ContextInsights } from "@/components/context-insights";
import { DashboardGuide } from "@/components/dashboard-guide";
import { DashboardSection } from "@/components/dashboard-section";
import { DashboardShell } from "@/components/dashboard-shell";
import { DailyPulseHero } from "@/components/daily-pulse-hero";
import { DollarHero } from "@/components/dollar-hero";
import { FiscalPanel } from "@/components/fiscal-panel";
import { ForexPanel } from "@/components/forex-panel";
import { IndicatorCard } from "@/components/indicator-card";
import { MacroContextGrid } from "@/components/macro-context-grid";
import { MacroCalendarPanel } from "@/components/macro-calendar-panel";
import { MacroThermometer } from "@/components/macro-thermometer";
import { ThermometerHistoryChart } from "@/components/thermometer-history-chart";
import { SignalLegend } from "@/components/signal-legend";
import { ToolsPromo } from "@/components/tools/tools-promo";
import { TrendChart } from "@/components/trend-chart";
import { WeeklyDigest } from "@/components/weekly-digest";
import { Badge } from "@/components/ui/badge";
import { DashboardPulseExtras } from "@/components/dashboard-pulse-extras";
import { formatCurrency, formatDate } from "@/lib/format";
import { PILLAR_LABELS } from "@/lib/indicators";
import type { DashboardData } from "@/lib/dashboard-data";
import type { ThermometerHistoryPoint } from "@/lib/thermometer-history";

type DashboardViewProps = {
  data: DashboardData;
  thermometerHistory: ThermometerHistoryPoint[];
};

export function DashboardView({ data, thermometerHistory }: DashboardViewProps) {
  const pillars = Array.from(new Set(data.indicators.map((item) => item.pillar)));
  const topInsights = data.insights.slice(0, 3);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
      {data.error ? (
        <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {data.error}
        </div>
      ) : null}

      <DashboardShell partialErrors={data.partialErrors}>
        {data.dollar ? <BrechaAlertsBanner dollar={data.dollar} /> : null}

        <section className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Dólar hoy en Argentina: oficial, blue, MEP y CCL
          </h1>
          <p className="max-w-3xl text-muted-foreground">
            Cotizaciones del dólar en tiempo casi real, inflación INDEC, reservas del BCRA
            y los principales indicadores de la economía argentina, con fuentes oficiales
            y de mercado.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>Actualizado {formatDate(data.fetchedAt)}</span>
            {data.usdOfficial !== null ? (
              <span>
                Dólar oficial BCRA: {formatCurrency(data.usdOfficial)}
                {data.usdDate ? ` (${formatDate(data.usdDate)})` : ""}
              </span>
            ) : null}
          </div>
        </section>

        <div id="dolar" className="scroll-mt-24">
          {data.dollar ? <DollarHero dollar={data.dollar} /> : null}
        </div>

        <AdSlot placement="dashboard-below-hero" />

        <section className="flex flex-col gap-2">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            ¿Cómo está la economía hoy?
          </h2>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-sky-300 text-sky-800">
              BCRA
            </Badge>
            <Badge variant="outline" className="border-sky-300 text-sky-800">
              INDEC
            </Badge>
            <Badge variant="outline" className="border-sky-300 text-sky-800">
              DolarAPI
            </Badge>
            <Badge variant="outline" className="border-sky-300 text-sky-800">
              ArgentinaDatos
            </Badge>
            <Badge variant="outline" className="border-sky-300 text-sky-800">
              MEcon / IMIG
            </Badge>
          </div>
        </section>

        <DailyPulseHero data={data} />

        <div data-section="pulse-only">
          <DashboardPulseExtras score={data.macroScore} insights={topInsights} />
        </div>

        <div data-section="full-only" className="flex flex-col gap-10 lg:gap-12">
          <DashboardGuide />

          <DashboardSection
            id="termometro-full"
            title="Termómetro macro"
            description="Score compuesto de 10 señales. El resumen numérico del día está arriba; acá ves el gauge, histórico y digest."
          >
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="flex flex-col gap-5">
                <MacroThermometer score={data.macroScore} />
                <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
                  <h3 className="mb-4 text-sm font-medium text-muted-foreground">
                    Histórico del termómetro (90 días)
                  </h3>
                  <ThermometerHistoryChart history={thermometerHistory} compact />
                </div>
              </div>
              <div className="flex flex-col gap-5">
                <WeeklyDigest lines={data.digest} />
                <MacroCalendarPanel compact limit={4} />
              </div>
            </div>
          </DashboardSection>

          <BrechaAlertsSettings />

          <ToolsPromo />

          {data.dollar ? <CollapsibleDollarPanel dollar={data.dollar} /> : null}

          {data.forex.length > 0 ? <ForexPanel quotes={data.forex} /> : null}

          <MacroContextGrid indec={data.indec} countryRisk={data.countryRisk} />

          <ContextInsights insights={data.insights} />

          <div id="fiscal" className="scroll-mt-24">
            {data.fiscalIndicators.length > 0 ? (
              <FiscalPanel indicators={data.fiscalIndicators} />
            ) : null}
          </div>

          <DashboardSection
            id="graficos"
            title="Gráficos destacados"
            description="Series históricas de brecha, inflación y dólar para ver tendencias."
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <TrendChart
                title="Brecha CCL vs oficial"
                subtitle="Diferencia porcentual histórica (ArgentinaDatos)"
                series={data.featuredSeries.brechaCcl}
                format="percent"
                color="#dc2626"
              />
              <TrendChart
                title="Inflación interanual (INDEC)"
                subtitle="Variación de precios en 12 meses — fuente oficial"
                series={data.featuredSeries.indecInflationAnnual}
                format="percent"
                color="#d97706"
              />
              <TrendChart
                title="Dólar mayorista (BCRA)"
                subtitle="Tipo de cambio oficial de referencia"
                series={data.featuredSeries.dollar}
                format="currency"
                color="#1d4ed8"
              />
              <TrendChart
                title="Inflación mensual (BCRA)"
                subtitle="Referencia BCRA — ver IPC INDEC en contexto para dato oficial"
                series={data.featuredSeries.inflation}
                format="percent"
                color="#7c3aed"
              />
            </div>
          </DashboardSection>

          <DashboardSection
            id="indicadores"
            title="Indicadores BCRA"
            description="Series oficiales agrupadas por pilar. Cada tarjeta muestra variación reciente y enlace a la fuente."
          >
            <div className="flex flex-col gap-10">
              {pillars.map((pillar) => {
                const items = data.indicators.filter((item) => item.pillar === pillar);
                if (items.length === 0) return null;

                const isFirstPillar = pillar === pillars[0];

                return (
                  <section key={pillar} className="flex flex-col gap-5">
                    {isFirstPillar ? <SignalLegend /> : null}
                    <h3 className="font-heading text-lg font-semibold">
                      {PILLAR_LABELS[pillar as keyof typeof PILLAR_LABELS]}
                    </h3>
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                      {items.map((indicator) => (
                        <IndicatorCard key={indicator.slug} indicator={indicator} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </DashboardSection>

          <AdSlot placement="dashboard-footer" />
        </div>
      </DashboardShell>
    </div>
  );
}

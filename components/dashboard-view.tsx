import { AdSlot } from "@/components/ad-slot";
import { BrechaAlertsBanner } from "@/components/brecha-alerts-banner";
import { BrechaAlertsSettings } from "@/components/brecha-alerts-settings";
import { ContextInsights } from "@/components/context-insights";
import { DashboardGuide } from "@/components/dashboard-guide";
import { DollarPanel } from "@/components/dollar-panel";
import { ForexPanel } from "@/components/forex-panel";
import { IndicatorCard } from "@/components/indicator-card";
import { MacroContextGrid } from "@/components/macro-context-grid";
import { MacroThermometer } from "@/components/macro-thermometer";
import { SignalLegend } from "@/components/signal-legend";
import { TrendChart } from "@/components/trend-chart";
import { WeeklyDigest } from "@/components/weekly-digest";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/format";
import { PILLAR_LABELS } from "@/lib/indicators";
import type { DashboardData } from "@/lib/dashboard-data";

type DashboardViewProps = {
  data: DashboardData;
};

export function DashboardView({ data }: DashboardViewProps) {
  const pillars = Array.from(new Set(data.indicators.map((item) => item.pillar)));

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
      {data.error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {data.error}
        </div>
      ) : null}

      {data.partialErrors.length > 0 ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Algunas fuentes no respondieron. Mostramos los datos disponibles.
        </div>
      ) : null}

      {data.dollar ? <BrechaAlertsBanner dollar={data.dollar} /> : null}

      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="border-sky-500/30 text-sky-400">
            BCRA
          </Badge>
          <Badge variant="outline" className="border-sky-500/30 text-sky-400">
            INDEC
          </Badge>
          <Badge variant="outline" className="border-sky-500/30 text-sky-400">
            DolarAPI
          </Badge>
          <Badge variant="outline" className="border-sky-500/30 text-sky-400">
            ArgentinaDatos
          </Badge>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            ¿Cómo está la economía hoy?
          </h1>
          <p className="max-w-3xl text-muted-foreground">
            Un pulso visual del macro argentino con datos oficiales y de mercado:
            reservas, todos los dólares, inflación INDEC, actividad y riesgo país —
            explicado para decisiones del día a día.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>Actualizado {formatDate(data.fetchedAt)}</span>
          {data.usdOfficial !== null ? (
            <span>
              Dólar oficial: {formatCurrency(data.usdOfficial)}
              {data.usdDate ? ` · BCRA ${formatDate(data.usdDate)}` : ""}
            </span>
          ) : null}
        </div>
      </section>

      <DashboardGuide />

      <AdSlot placement="dashboard-below-hero" />

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <MacroThermometer score={data.macroScore} />
        <WeeklyDigest lines={data.digest} />
      </section>

      <BrechaAlertsSettings />

      {data.dollar ? <DollarPanel dollar={data.dollar} /> : null}

      {data.forex.length > 0 ? <ForexPanel quotes={data.forex} /> : null}

      <MacroContextGrid indec={data.indec} countryRisk={data.countryRisk} />

      <ContextInsights insights={data.insights} />

      <AdSlot placement="dashboard-mid-content" />

      <section className="grid gap-6 lg:grid-cols-2">
        <TrendChart
          title="Brecha CCL vs oficial"
          subtitle="Diferencia porcentual histórica (ArgentinaDatos)"
          series={data.featuredSeries.brechaCcl}
          format="percent"
          color="#f87171"
        />
        <TrendChart
          title="Inflación interanual (INDEC)"
          subtitle="Variación de precios en 12 meses"
          series={data.featuredSeries.indecInflationAnnual}
          format="percent"
          color="#fbbf24"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <TrendChart
          title="Dólar mayorista (BCRA)"
          subtitle="Tipo de cambio oficial de referencia"
          series={data.featuredSeries.dollar}
          format="currency"
          color="#38bdf8"
        />
        <TrendChart
          title="Inflación mensual"
          subtitle="IPC mensual (BCRA / INDEC)"
          series={data.featuredSeries.inflation}
          format="percent"
          color="#a78bfa"
        />
      </section>

      {pillars.map((pillar) => {
        const items = data.indicators.filter((item) => item.pillar === pillar);
        if (items.length === 0) return null;

        const isFirstPillar = pillar === pillars[0];

        return (
          <section key={pillar} className="flex flex-col gap-4">
            {isFirstPillar ? <SignalLegend /> : null}
            <h2 className="font-heading text-xl font-semibold">
              {PILLAR_LABELS[pillar as keyof typeof PILLAR_LABELS]}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((indicator) => (
                <IndicatorCard key={indicator.slug} indicator={indicator} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

"use client";

import Link from "next/link";

import { ContextInsights } from "@/components/context-insights";
import { ThermometerPulseTeaser } from "@/components/thermometer-pulse-teaser";
import { ToolsPromo } from "@/components/tools/tools-promo";
import { useDashboardMode } from "@/components/dashboard-shell";
import type { ContextInsight } from "@/types/external";
import type { MacroScoreResult } from "@/lib/macro-score";

type DashboardPulseExtrasProps = {
  score: MacroScoreResult;
  insights: ContextInsight[];
};

export function DashboardPulseExtras({ score, insights }: DashboardPulseExtrasProps) {
  const { switchToFull } = useDashboardMode();

  return (
    <div className="flex flex-col gap-6">
      <ThermometerPulseTeaser score={score} onShowFull={switchToFull} />
      {insights.length > 0 ? <ContextInsights insights={insights} /> : null}
      <section className="flex flex-col gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-5">
        <h2 className="font-heading text-lg font-semibold">Profundizá cuando quieras</h2>
        <p className="text-sm text-muted-foreground">
          Cambiá a vista Completo para ver fiscal, gráficos e indicadores detallados.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/herramientas"
            className="rounded-lg border border-border/60 bg-card px-3 py-2 text-sm font-medium hover:border-primary/40"
          >
            Explorar herramientas →
          </Link>
          <Link
            href="/digest"
            className="rounded-lg border border-border/60 bg-card px-3 py-2 text-sm hover:border-primary/40"
          >
            Resumen por email
          </Link>
        </div>
      </section>
      <ToolsPromo />
    </div>
  );
}

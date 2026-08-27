import Link from "next/link";

import type { DashboardData } from "@/lib/dashboard-data";
import type { MacroBriefing } from "@/lib/macro-briefing";
import { buildDailyCover } from "@/lib/daily-cover";
import { MOOD_LABELS } from "@/lib/macro-score";
import { scoreToGaugeColor } from "@/lib/thermometer-color";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type FrontPageViewProps = {
  data: DashboardData;
  briefing: MacroBriefing;
};

export function FrontPageView({ data, briefing }: FrontPageViewProps) {
  const cover = buildDailyCover(data);
  const leadHeadline = cover.title;
  const dek = cover.dek;
  const teaser = (() => {
    const fromQue = cover.sections.find((s) => s.heading.includes("Qué se movió"));
    const fromBolsillo = cover.sections.find((s) => s.heading.toLowerCase().includes("bolsillo"));
    const arr = [
      ...(fromQue?.paragraphs ?? []),
      ...(fromBolsillo?.paragraphs ?? []),
    ].filter((p) => p.length > 40);
    return arr.slice(0, 2);
  })();
  const score = data.macroScore;
  const moodColor = scoreToGaugeColor(score.score);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.35fr]">
        {/* Columna principal */}
        <div className="flex flex-col gap-4">
          <header className="flex flex-col gap-3">
            <h1 className="font-heading text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              {leadHeadline}
            </h1>
            {dek ? (
              <p className="max-w-[70ch] text-base leading-relaxed text-foreground/80">{dek}</p>
            ) : null}
          </header>

          <div className="flex max-w-[75ch] flex-col gap-4 text-[15px] leading-relaxed text-foreground/85">
            {teaser.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </div>

          <div>
            <Link
              href="/hoy"
              className={cn(
                "inline-flex items-center text-[15px] font-medium text-foreground underline-offset-4 hover:underline",
              )}
            >
              Seguir leyendo →
            </Link>
          </div>

          {/* Breves secundarios: señales */}
          {data.insights.length > 0 ? (
            <section className="mt-6 flex flex-col gap-4 border-t border-border/70 pt-6">
              <h2 className="font-heading text-xl font-semibold tracking-tight">Señales del día</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                {data.insights.slice(0, 3).map((insight) => (
                  <article key={insight.title} className="flex flex-col gap-2">
                    <h3 className="font-heading text-base font-semibold leading-snug">
                      {insight.title}
                    </h3>
                    <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {insight.body}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {/* Más abajo: acceso a Completo y herramientas */}
          <section className="mt-8 flex flex-wrap items-center gap-3 border-t border-border/70 pt-6">
            <Link
              href="/completo"
              className="inline-flex items-center rounded border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted/50"
            >
              Ver Completo (tablero)
            </Link>
            <span className="text-xs text-muted-foreground">
              Actualizado {formatDate(data.fetchedAt)}
            </span>
          </section>
        </div>

        {/* Columna derecha: riel de mercados */}
        <aside className="flex flex-col gap-5">
          <section className="flex flex-col gap-2">
            <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground/70">
              Clima de mercado
            </h2>
            <div className="rounded-md border border-border/70 bg-card/60 p-3">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold tabular-nums" style={{ color: moodColor }}>
                  {score.score}
                </span>
                <span className="pb-1 text-sm text-muted-foreground">/ 100</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{MOOD_LABELS[score.mood]}</p>
            </div>
          </section>

          {/* Cotizaciones compactas en columna */}
          {data.dollar ? (
            <section className="flex flex-col gap-2">
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground/70">
                Cotizaciones
              </h2>
              <div className="divide-y divide-border/70 overflow-hidden rounded-md border border-border/70 bg-card/60">
                {["oficial", "blue", "bolsa", "contadoconliqui"].map((casa) => {
                  const q = data.dollar!.quotes.find((q) => q.casa === casa);
                  if (!q) return null;
                  const label =
                    casa === "oficial"
                      ? "Oficial"
                      : casa === "blue"
                      ? "Blue"
                      : casa === "bolsa"
                      ? "MEP"
                      : "CCL";
                  return (
                    <div key={casa} className="flex items-center justify-between px-3 py-2 text-sm">
                      <span className="text-foreground/70">{label}</span>
                      <span className="font-semibold tabular-nums">
                        ${q.venta.toLocaleString("es-AR")}
                      </span>
                    </div>
                  );
                })}
                {data.dollar.brechaCclPct != null ? (
                  <div className="flex items-center justify-between bg-muted/40 px-3 py-2 text-sm">
                    <span className="text-foreground/70">Brecha CCL</span>
                    <span className="font-semibold tabular-nums">
                      {data.dollar.brechaCclPct.toFixed(1)}%
                    </span>
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}

          {/* Calendario compacto o digest aparecerían más abajo si es necesario */}
        </aside>
      </div>
    </div>
  );
}


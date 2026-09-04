import Link from "next/link";

import type { DashboardData } from "@/lib/dashboard-data";
import type { MacroBriefing } from "@/lib/macro-briefing";
import { MOOD_LABELS } from "@/lib/macro-score";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { buildDailyCover } from "@/lib/daily-cover";
import { getUpcomingEvents } from "@/lib/macro-calendar";
import { NoteCard } from "@/components/note-card";

type FrontPageViewProps = {
  data: DashboardData;
  briefing: MacroBriefing;
};

function extractDek(briefing: MacroBriefing): string | null {
  const digest = briefing.sections.find((s) => s.heading.includes("Resumen"));
  return digest?.paragraphs?.[0] ?? null;
}

function extractTeaserParagraphs(briefing: MacroBriefing): string[] {
  // Tomamos hasta 2 párrafos no triviales que no sean la intro genérica
  const paragraphs: string[] = [];
  for (const section of briefing.sections) {
    if (section.heading.includes("Introducción") || section.heading.includes("Sobre esta sección")) {
      continue;
    }
    for (const p of section.paragraphs) {
      if (p.length < 40) continue;
      paragraphs.push(p);
      if (paragraphs.length >= 2) return paragraphs;
    }
  }
  return paragraphs.slice(0, 2);
}

export function FrontPageView({ data, briefing }: FrontPageViewProps) {
  const cover = buildDailyCover(data);
  const leadHeadline = cover.title;
  const dek = cover.description ?? extractDek(briefing);
  const teaser = extractTeaserParagraphs(briefing);
  const score = data.macroScore;

  type FrontPageNote = { kicker: string; title: string; dek: string; href: string };

  function buildNotes(): FrontPageNote[] {
    const notes: FrontPageNote[] = [];
    // 1) Secciones de la tapa
    const secMovio = cover.sections.find((s) => s.heading.includes("Qué se movió"));
    if (secMovio?.paragraphs[0]) {
      notes.push({
        kicker: "Mercados",
        title: "Qué se movió",
        dek: secMovio.paragraphs[0],
        href: "/hoy#que-se-movio",
      });
    }
    const secBolsillo = cover.sections.find((s) => s.heading.includes("bolsillo"));
    if (secBolsillo?.paragraphs[0]) {
      notes.push({
        kicker: "Bolsillo",
        title: "Por qué importa el bolsillo",
        dek: secBolsillo.paragraphs[0],
        href: "/hoy#por-que-importa-el-bolsillo",
      });
    }
    // 2) Insights — fiscal y cambio
    const fiscal = data.insights.find((i) => i.category === "fiscal");
    if (fiscal) {
      notes.push({
        kicker: "Fiscal",
        title: fiscal.title,
        dek: fiscal.body,
        href: "/finanzas-publicas",
      });
    }
    const cambio = data.insights.find((i) => i.category === "cambio");
    if (cambio) {
      notes.push({
        kicker: "Mercados",
        title: cambio.title,
        dek: cambio.body,
        href: "/dolar",
      });
    }
    // 3) Agenda — próximo evento macro
    const upcoming = getUpcomingEvents(1)[0];
    if (upcoming) {
      const date = new Date(upcoming.date);
      const dateLabel = date.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" });
      notes.push({
        kicker: "Agenda",
        title: upcoming.title,
        dek: `${upcoming.description} — ${dateLabel}`,
        href: "/calendario",
      });
    }
    // Limitar entre 3 y 6
    return notes.slice(0, 6);
  }
  const notes = buildNotes();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      {/* Fila 1: lead 8 columnas + rail 4 columnas */}
      <div className="grid grid-cols-12 gap-x-8 gap-y-10">
        {/* Lead */}
        <section className="col-span-12 lg:col-span-8">
          <div className="editorial-kicker mb-3">
            Hoy en la economía
          </div>
          <h1 className="font-heading text-5xl font-bold leading-[1.1] tracking-tight md:text-6xl">
            {leadHeadline}
          </h1>
          {dek ? (
            <p className="mt-3 max-w-[65ch] text-[17px] leading-[1.55] text-foreground/80">{dek}</p>
          ) : null}
          <div className="prose mt-5 max-w-[65ch] text-[17px] leading-[1.6] prose-p:mb-4">
            {teaser.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </div>
          <p className="mt-6 text-sm">
            <Link
              href="/hoy"
              className={cn("text-foreground underline underline-offset-2 hover:opacity-90")}
            >
              Seguir leyendo →
            </Link>
          </p>
        </section>

        {/* Rail mercados */}
        <aside className="col-span-12 lg:col-span-4 lg:border-l lg:border-border lg:pl-6">
          <div className="flex flex-col gap-6">
            <section className="flex flex-col gap-1">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/60">
                Clima de mercado
              </div>
              <p className="text-sm">
                <span className="font-medium tabular-nums">{score.score}</span> —{" "}
                <span className="text-muted-foreground">{MOOD_LABELS[score.mood]}</span>
              </p>
            </section>

            {data.dollar ? (
              <section className="flex flex-col gap-1">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/60">
                  Cotizaciones
                </div>
                <dl className="text-sm">
                  {["oficial", "blue", "bolsa", "contadoconliqui"].map((casa) => {
                    const q = data.dollar!.quotes.find((q) => q.casa === casa);
                    if (!q) return null;
                    const label =
                      casa === "oficial" ? "Oficial" : casa === "blue" ? "Blue" : casa === "bolsa" ? "MEP" : "CCL";
                    return (
                      <div key={casa} className="grid grid-cols-[1fr_auto] items-baseline py-1">
                        <dt className="text-muted-foreground">{label}</dt>
                        <dd className="tabular-nums font-medium">
                          ${q.venta.toLocaleString("es-AR")}
                        </dd>
                      </div>
                    );
                  })}
                  {data.dollar.brechaCclPct != null ? (
                    <div className="grid grid-cols-[1fr_auto] items-baseline border-t border-dashed border-border pt-2 mt-2">
                      <dt className="text-muted-foreground">Brecha CCL</dt>
                      <dd className="tabular-nums">{data.dollar.brechaCclPct.toFixed(1)}%</dd>
                    </div>
                  ) : null}
                </dl>
                <div className="pt-1 text-xs text-muted-foreground">
                  <Link href="/completo" className="underline underline-offset-2">
                    Mercados →
                  </Link>
                </div>
              </section>
            ) : null}

            {(() => {
              const upcoming = getUpcomingEvents(1)[0];
              if (!upcoming) return null;
              const date = new Date(upcoming.date);
              const dateLabel = date.toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "2-digit",
              });
              return (
                <section className="flex flex-col gap-1">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/60">
                    Agenda
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">{upcoming.title}</span>{" "}
                    <span className="text-muted-foreground">— {dateLabel}</span>
                  </p>
                </section>
              );
            })()}
          </div>
        </aside>
      </div>

      {/* Fila 2: notas en 3–4 columnas con reglas verticales */}
      {notes.length >= 3 ? (
        <section className="mt-12 border-t border-border/80 pt-8">
          <div className="grid grid-cols-1 gap-y-8 md:grid-cols-3 md:gap-x-8 xl:grid-cols-4">
            {notes.slice(0, 4).map((note) => (
              <NoteCard
                key={`${note.kicker}-${note.title}`}
                kicker={note.kicker}
                title={note.title}
                dek={note.dek}
                href={note.href}
                variant="paper"
                className="md:border-l md:border-border md:pl-6 first:md:border-l-0 first:md:pl-0"
              />
            ))}
          </div>
          <div className="mt-6 text-xs text-muted-foreground">
            Actualizado {formatDate(data.fetchedAt)}
          </div>
        </section>
      ) : null}
    </div>
  );
}


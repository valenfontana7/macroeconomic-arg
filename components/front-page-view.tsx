import Link from "next/link";

import type { DashboardData } from "@/lib/dashboard-data";
import type { MacroBriefing } from "@/lib/macro-briefing";
import { MOOD_LABELS } from "@/lib/macro-score";
import { scoreToGaugeColor } from "@/lib/thermometer-color";
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
  const moodColor = scoreToGaugeColor(score.score);

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
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_0.35fr]">
        {/* Columna principal */}
        <div className="flex flex-col gap-4">
          <header className="flex flex-col gap-3">
            <h1 className="font-heading text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
              {leadHeadline}
            </h1>
            {dek ? (
              <p className="max-w-[68ch] text-[17px] leading-[1.5] text-foreground/80">{dek}</p>
            ) : null}
          </header>

          <div className="flex max-w-[68ch] flex-col gap-4 text-[17px] leading-[1.5] text-foreground/85">
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
              Leer la tapa →
            </Link>
          </div>

          {/* Grid de notas estilo diario */}
          {notes.length >= 3 ? (
          <section className="mt-4 flex flex-col gap-4">
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {notes.map((note) => (
                  <NoteCard
                    key={`${note.kicker}-${note.title}`}
                    kicker={note.kicker}
                    title={note.title}
                    dek={note.dek}
                    href={note.href}
                  />
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
              Ver completo
            </Link>
            <span className="text-xs text-muted-foreground">
              Actualizado {formatDate(data.fetchedAt)}
            </span>
          </section>
        </div>

        {/* Columna derecha: riel de mercados */}
        <aside className="flex flex-col gap-5">
          <section className="flex flex-col gap-1">
            <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground/70">
              Clima de mercado
            </h2>
            <p className="text-sm">
              <span className="font-semibold tabular-nums" style={{ color: moodColor }}>
                {score.score}
              </span>{" "}
              / 100 — <span className="text-muted-foreground">{MOOD_LABELS[score.mood]}</span>
            </p>
          </section>

          {/* Cotizaciones en formato columna de diario, con reglas */}
          {data.dollar ? (
            <section className="flex flex-col gap-1">
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-foreground/70">
                Cotizaciones
              </h2>
              <ul className="border-t border-border/70 text-sm">
                {["oficial", "blue", "bolsa", "contadoconliqui"].map((casa) => {
                  const q = data.dollar!.quotes.find((q) => q.casa === casa);
                  if (!q) return null;
                  const label = casa === "oficial" ? "Oficial" : casa === "blue" ? "Blue" : casa === "bolsa" ? "MEP" : "CCL";
                  return (
                    <li key={casa} className="flex items-center justify-between border-b border-border/70 py-1.5">
                      <span className="text-foreground/70">{label}</span>
                      <span className="font-semibold tabular-nums">${q.venta.toLocaleString("es-AR")}</span>
                    </li>
                  );
                })}
                {data.dollar.brechaCclPct != null ? (
                  <li className="flex items-center justify-between border-b border-border/70 py-1.5">
                    <span className="text-foreground/70">Brecha CCL</span>
                    <span className="font-semibold tabular-nums">{data.dollar.brechaCclPct.toFixed(1)}%</span>
                  </li>
                ) : null}
              </ul>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}


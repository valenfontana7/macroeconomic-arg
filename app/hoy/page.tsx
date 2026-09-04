import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { MarketsTape } from "@/components/markets-tape";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getDashboardData } from "@/lib/dashboard-data";
import { buildDailyCover } from "@/lib/daily-cover";
import { formatDate } from "@/lib/format";
import { BRAND_NAME } from "@/lib/brand";
import { articleJsonLd, buildPageMetadata } from "@/lib/seo";

export const revalidate = 1800; // 30 min

function headingToId(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export async function generateMetadata(): Promise<Metadata> {
  const nowIso = new Date().toISOString();
  const dateLabel = formatDate(nowIso);
  return buildPageMetadata({
    title: `Hoy en la economía — ${dateLabel}`,
    description: `Tapa del día de ${BRAND_NAME}: termómetro, dólar, brecha e inflación, en simple. Actualizado ${dateLabel}.`,
    path: "/hoy",
    type: "article",
  });
}

export default async function TodayCoverPage() {
  const data = await getDashboardData();
  const cover = buildDailyCover(data);
  const jsonLd = articleJsonLd({
    title: `Hoy en la economía — ${cover.dateLabel}`,
    description: cover.description,
    path: "/hoy",
    dateModified: cover.dateIso,
    authorName: BRAND_NAME,
  });

  return (
    <>
      <SiteHeader />
      <MarketsTape />
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-7 px-4 py-8 sm:px-6">
        <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Hoy" }]} />

        <header className="flex flex-col gap-2">
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Hoy en la economía
          </h1>
          <p className="text-sm text-muted-foreground">Actualizado {cover.dateLabel}</p>
        </header>

        <article className="flex max-w-[68ch] flex-col gap-5 border-t border-border/80 pt-6">
          <p className="font-heading text-xl font-semibold leading-relaxed text-foreground/90">
            {cover.title}
          </p>
          {cover.sections.map((section) => {
            const id = headingToId(section.heading);
            return (
              <section key={section.heading} id={id} className="flex flex-col gap-2 border-t border-border/60 pt-5 scroll-mt-24 first:border-t-0 first:pt-0">
                <h2 className="font-heading text-xl font-semibold tracking-tight">
                  {section.heading}
                </h2>
                {section.paragraphs.map((p, idx) => (
                  <p key={idx} className="text-base leading-relaxed text-foreground/75">
                    {p}
                  </p>
                ))}
              </section>
            );
          })}
          <p className="pt-2 text-xs text-muted-foreground">
            Datos del BCRA, INDEC y mercado. No es asesoramiento financiero.
          </p>
        </article>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* TODO: /hoy/[fecha] como permalink cuando haya almacenamiento histórico confiable */}
      </main>
      <SiteFooter />
    </>
  );
}


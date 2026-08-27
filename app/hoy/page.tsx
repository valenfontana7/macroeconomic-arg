import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent } from "@/components/ui/card";
import { getDashboardData } from "@/lib/dashboard-data";
import { buildDailyCover } from "@/lib/daily-cover";
import { formatDate } from "@/lib/format";
import { BRAND_NAME } from "@/lib/brand";
import { articleJsonLd, buildPageMetadata } from "@/lib/seo";

export const revalidate = 1800; // 30 min

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
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6">
        <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Hoy" }]} />

        <header className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Hoy en la economía
          </h1>
          <p className="text-sm text-muted-foreground">Actualizado {cover.dateLabel}</p>
        </header>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-card/60">
          <CardContent className="flex flex-col gap-6 p-5 sm:p-6">
            <p className="text-lg font-semibold leading-relaxed text-foreground/90">
              {cover.title}
            </p>
            {cover.sections.map((section) => (
              <section key={section.heading} className="flex flex-col gap-2">
                <h2 className="font-heading text-base font-semibold tracking-tight">
                  {section.heading}
                </h2>
                {section.paragraphs.map((p, idx) => (
                  <p key={idx} className="text-sm leading-relaxed text-muted-foreground">
                    {p}
                  </p>
                ))}
              </section>
            ))}

            <p className="pt-2 text-xs text-muted-foreground">
              Datos del BCRA, INDEC y mercado. No es asesoramiento financiero.
            </p>
          </CardContent>
        </Card>

        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* TODO: /hoy/[fecha] como permalink cuando haya almacenamiento histórico confiable */}
      </main>
      <SiteFooter />
    </>
  );
}


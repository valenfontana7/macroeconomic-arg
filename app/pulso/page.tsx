import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { MacroBriefingArticle } from "@/components/macro-briefing-article";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import { getDashboardData } from "@/lib/dashboard-data";
import { buildMacroBriefing } from "@/lib/macro-briefing";
import { PUBLISHER_NAME, publisherAttribution } from "@/lib/publisher";
import { articleJsonLd, buildPageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export async function generateMetadata() {
  const data = await getDashboardData();
  const briefing = buildMacroBriefing(data, "full");

  return buildPageMetadata({
    title: briefing.title,
    description: briefing.sections[1]?.paragraphs[0] ?? briefing.sections[0]?.paragraphs[0] ?? "",
    path: "/pulso",
    type: "article",
    keywords: ["pulso macro", "economía argentina hoy", "análisis macro", "termómetro macro"],
  });
}

export const revalidate = 900;

export default async function PulsoPage() {
  const data = await getDashboardData();
  const briefing = buildMacroBriefing(data, "full");

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: briefing.title,
          description: briefing.sections[1]?.paragraphs.join(" ") ?? "",
          path: "/pulso",
          dateModified: briefing.updatedAt,
          authorName: PUBLISHER_NAME,
        })}
      />
      <SiteHeader />
      <main id="main-content" className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6">
        <Breadcrumbs
          items={[{ label: "Inicio", href: "/" }, { label: "Pulso macro" }]}
          currentPath="/pulso"
        />

        <MacroBriefingArticle briefing={briefing} />

        <section className="flex flex-wrap gap-3 border-t border-border/60 pt-6">
          <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
            Ver dashboard
          </Link>
          <Link href="/dolar" className={cn(buttonVariants({ variant: "outline" }))}>
            Dólar
          </Link>
          <Link href="/inflacion" className={cn(buttonVariants({ variant: "outline" }))}>
            Inflación
          </Link>
          <Link href="/aprende" className={cn(buttonVariants({ variant: "outline" }))}>
            Glosario
          </Link>
          <Link href="/herramientas/pulso-del-dia" className={cn(buttonVariants())}>
            Compartir resumen
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

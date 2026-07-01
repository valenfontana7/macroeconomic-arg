import Link from "next/link";
import { notFound } from "next/navigation";

import { AdSlot } from "@/components/ad-slot";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { IndicatorLearnPanel } from "@/components/indicator-learn-panel";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import {
  ALL_CONCEPTS,
  CATEGORY_LABELS,
  getConceptBySlug,
} from "@/lib/macro-education";
import { buildPageMetadata, faqJsonLd } from "@/lib/seo";
import { INDICATOR_BY_SLUG, type IndicatorSlug } from "@/lib/indicators";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return ALL_CONCEPTS.map((concept) => ({ slug: concept.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);
  if (!concept) return { title: "Concepto no encontrado" };

  return buildPageMetadata({
    title: `${concept.title} — qué es y cómo leerlo`,
    description: `${concept.enCristiano} Guía en criollo con datos de Argentina.`,
    path: `/aprende/${concept.slug}`,
    type: "article",
    keywords: [concept.title, "Argentina", "macroeconomía", concept.category],
  });
}

export default async function AprendeConceptPage({ params }: PageProps) {
  const { slug } = await params;
  const concept = getConceptBySlug(slug);
  if (!concept) notFound();

  const indicator =
    concept.indicatorSlug && INDICATOR_BY_SLUG[concept.indicatorSlug as IndicatorSlug];

  return (
    <>
      <JsonLd data={faqJsonLd(concept)} />
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Aprendé", href: "/aprende" },
            { label: concept.title },
          ]}
          currentPath={`/aprende/${concept.slug}`}
        />
        <div className="flex flex-col gap-3">
          <Badge variant="outline" className="w-fit">
            {CATEGORY_LABELS[concept.category]}
          </Badge>
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            {concept.title}
          </h1>
          <p className="text-muted-foreground">{concept.enCristiano}</p>
        </div>

        <IndicatorLearnPanel concept={concept} />

        {indicator ? (
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/indicador/${indicator.slug}#aprender`}
              className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
            >
              Ver datos en vivo
            </Link>
          </div>
        ) : null}

        <Link
          href="/aprende"
          className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          ← Volver al glosario
        </Link>

        <AdSlot placement="aprende-footer" />
      </main>
      <SiteFooter />
    </>
  );
}

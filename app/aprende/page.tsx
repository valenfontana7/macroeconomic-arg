import Link from "next/link";

import { AdSlot } from "@/components/ad-slot";
import { AprendeGlossary } from "@/components/aprende-glossary";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getAllConcepts } from "@/lib/macro-education";
import { GUIDE_PAGES } from "@/lib/guide-pages";
import { buildPageMetadata, canonicalUrl, itemListJsonLd } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Glosario de economía argentina — dólar, inflación y más",
  description:
    "Glosario de economía argentina explicado en simple: dólar, inflación, reservas, brecha cambiaria y más. Para entender el día a día sin ser economista.",
  path: "/aprende",
  keywords: [
    "glosario macroeconomía argentina",
    "economía argentina explicada",
    "qué es la brecha cambiaria",
    "aprender economía argentina",
  ],
});

export default function AprendePage() {
  const concepts = getAllConcepts();

  const listJsonLd = itemListJsonLd(
    "Glosario de economía argentina",
    concepts.map((c) => ({
      name: c.title,
      url: canonicalUrl(`/aprende/${c.slug}`),
    })),
  );

  return (
    <>
      <JsonLd data={listJsonLd} />
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6">
        <Breadcrumbs
          items={[{ label: "Inicio", href: "/" }, { label: "Aprendé" }]}
          currentPath="/aprende"
        />
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Aprendé macro sin ser economista
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Cada concepto está explicado en cuatro capas: qué es, para qué sirve,
            cómo leer el número y qué hacer con eso en tu vida diaria.
          </p>
        </div>

        <section className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/40 p-5">
          <h2 className="font-heading text-lg font-semibold">Guías temáticas</h2>
          <p className="text-sm text-muted-foreground">
            Lecturas largas que reúnen varios conceptos del glosario en un solo lugar.
          </p>
          <div className="flex flex-wrap gap-3">
            {GUIDE_PAGES.map((guide) => (
              <Link
                key={guide.slug}
                href={`/aprende/guia/${guide.slug}`}
                className="rounded-lg border border-border/60 px-4 py-2 text-sm transition-colors hover:border-primary/40 hover:text-primary"
              >
                {guide.title}
              </Link>
            ))}
          </div>
        </section>

        <AprendeGlossary concepts={concepts} />
        <AdSlot placement="aprende-footer" />
      </main>
      <SiteFooter />
    </>
  );
}

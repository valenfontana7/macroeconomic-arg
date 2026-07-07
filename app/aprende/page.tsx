import { AdSlot } from "@/components/ad-slot";
import { AprendeGlossary } from "@/components/aprende-glossary";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getAllConcepts } from "@/lib/macro-education";
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

        <AprendeGlossary concepts={concepts} />
        <AdSlot placement="aprende-footer" />
      </main>
      <SiteFooter />
    </>
  );
}

import { SiteHeader } from "@/components/site-header";
import { AprendeGlossary } from "@/components/aprende-glossary";
import { getAllConcepts } from "@/lib/macro-education";

export const metadata = {
  title: "Aprendé macro en criollo | Pulso Macro AR",
  description:
    "Glosario de indicadores macroeconómicos argentinos explicados en lenguaje cotidiano.",
};

export default function AprendePage() {
  const concepts = getAllConcepts();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6">
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
      </main>
    </>
  );
}

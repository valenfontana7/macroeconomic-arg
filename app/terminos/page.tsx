import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BRAND_NAME, pageTitle } from "@/lib/brand";

export const metadata = {
  title: pageTitle("Términos de uso"),
  description: `Condiciones de uso de ${BRAND_NAME}.`,
};

export default function TerminosPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Términos de uso
        </h1>

        <section className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Al usar {BRAND_NAME} aceptás que el contenido es informativo y educativo.
            No constituye asesoramiento financiero, legal ni de inversión.
          </p>
          <h2 className="text-base font-semibold text-foreground">Fuentes de datos</h2>
          <p>
            Los indicadores provienen de fuentes públicas (BCRA, INDEC, DolarAPI,
            ArgentinaDatos). Pueden tener demoras o errores de terceros; mostramos la
            fecha de cada serie cuando está disponible.
          </p>
          <h2 className="text-base font-semibold text-foreground">Uso permitido</h2>
          <p>
            Podés compartir enlaces, citar el sitio y usar las herramientas para uso
            personal. La reproducción masiva automatizada de datos puede estar sujeta a
            las licencias de cada fuente oficial.
          </p>
          <h2 className="text-base font-semibold text-foreground">Limitación de responsabilidad</h2>
          <p>
            No nos hacemos responsables por decisiones tomadas en base a la información
            mostrada. Verificá siempre con fuentes oficiales antes de operar.
          </p>
          <p>
            Más contexto en{" "}
            <Link href="/acerca" className="text-primary underline-offset-2 hover:underline">
              Acerca
            </Link>
            .
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

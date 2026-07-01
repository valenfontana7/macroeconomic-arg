import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BRAND_NAME, pageTitle } from "@/lib/brand";

export const metadata = {
  title: pageTitle("Política de cookies"),
  description: `Qué cookies usa ${BRAND_NAME} y cómo gestionarlas.`,
};

export default function CookiesPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Política de cookies
        </h1>

        <section className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            Usamos cookies y almacenamiento local para que el sitio funcione y, solo con
            tu consentimiento, para publicidad.
          </p>

          <h2 className="text-base font-semibold text-foreground">Esenciales</h2>
          <p>
            Recordar si aceptaste o rechazaste el banner de cookies. No requieren
            consentimiento.
          </p>

          <h2 className="text-base font-semibold text-foreground">Publicidad (AdSense)</h2>
          <p>
            Google AdSense puede usar cookies para medir impresiones y mostrar anuncios.
            Solo se cargan si elegís &quot;Aceptar&quot; en el banner.
          </p>

          <h2 className="text-base font-semibold text-foreground">Preferencias locales</h2>
          <p>
            Alertas de brecha y similares se guardan en tu dispositivo, no en nuestros
            servidores.
          </p>

          <h2 className="text-base font-semibold text-foreground">Cómo cambiar tu elección</h2>
          <p>
            Borrá el almacenamiento del sitio en tu navegador o usá el enlace en el pie
            de página. También podés revisar la{" "}
            <Link
              href="/privacidad"
              className="text-primary underline-offset-2 hover:underline"
            >
              política de privacidad
            </Link>
            .
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

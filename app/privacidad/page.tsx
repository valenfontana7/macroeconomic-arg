import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BRAND_NAME } from "@/lib/brand";
import { PUBLISHER_EMAIL, PUBLISHER_NAME } from "@/lib/publisher";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Política de privacidad",
  description: `Cómo ${BRAND_NAME} trata los datos de visitantes, cookies y publicidad.`,
  path: "/privacidad",
  keywords: ["privacidad", BRAND_NAME],
});

export default function PrivacidadPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Política de privacidad
        </h1>
        <p className="text-sm text-muted-foreground">
          Última actualización: julio 2026
        </p>

        <section className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            {BRAND_NAME} es un sitio informativo sobre macroeconomía argentina. No
            vendemos datos personales ni requerimos registro para usar el dashboard.
          </p>
          <h2 className="text-base font-semibold text-foreground">Qué datos recopilamos</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Datos técnicos estándar de navegación (IP anonimizada, tipo de
              dispositivo, páginas visitadas) a través de proveedores de analítica o
              publicidad si aceptás cookies.
            </li>
            <li>
              Preferencias guardadas en tu navegador (alertas de brecha, consentimiento
              de cookies, onboarding) mediante <code className="text-foreground">localStorage</code>.
            </li>
          </ul>
          <h2 className="text-base font-semibold text-foreground">Publicidad</h2>
          <p>
            Si habilitás cookies de publicidad, Google AdSense puede mostrar anuncios
            personalizados o contextuales según sus políticas. Podés rechazarlas desde el
            banner de cookies o en{" "}
            <Link href="/cookies" className="text-primary underline-offset-2 hover:underline">
              la política de cookies
            </Link>
            .
          </p>
          <h2 className="text-base font-semibold text-foreground">Responsable</h2>
          <p>
            El responsable del tratamiento de datos es {PUBLISHER_NAME}, editor de{" "}
            {BRAND_NAME}. Podés escribir a{" "}
            <a
              href={`mailto:${PUBLISHER_EMAIL}`}
              className="text-primary underline-offset-2 hover:underline"
            >
              {PUBLISHER_EMAIL}
            </a>{" "}
            o usar la página de{" "}
            <Link href="/contacto" className="text-primary underline-offset-2 hover:underline">
              Contacto
            </Link>
            .
          </p>
          <h2 className="text-base font-semibold text-foreground">Tus derechos</h2>
          <p>
            Podés borrar datos locales desde la configuración del navegador. Para
            consultas sobre privacidad, escribinos desde{" "}
            <Link href="/contacto" className="text-primary underline-offset-2 hover:underline">
              Contacto
            </Link>
            .
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

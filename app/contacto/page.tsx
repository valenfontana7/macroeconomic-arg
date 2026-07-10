import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ReportDataIssue } from "@/components/report-data-issue";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BRAND_NAME } from "@/lib/brand";
import {
  CONTACT_RESPONSE_TIME,
  EDITORIAL_POLICY,
  PUBLISHER_BIO,
  PUBLISHER_COUNTRY,
  PUBLISHER_EMAIL,
  PUBLISHER_NAME,
  PUBLISHER_ROLE,
  publisherMailto,
} from "@/lib/publisher";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Contacto",
  description: `Contactá a ${PUBLISHER_NAME}, editor de ${BRAND_NAME}. Consultas sobre datos, metodología, privacidad y colaboraciones.`,
  path: "/contacto",
  keywords: ["contacto", BRAND_NAME, "editor", "consultas"],
});

const CONTACT_TOPICS = [
  {
    title: "Datos incorrectos o desactualizados",
    description:
      "Si un número no coincide con la fuente oficial, usá el botón de reporte con la URL y el valor esperado.",
  },
  {
    title: "Privacidad y cookies",
    description:
      "Consultas sobre tratamiento de datos, publicidad o consentimiento de cookies.",
  },
  {
    title: "Medios y citas",
    description:
      "Para citar el sitio o insertar widgets, también podés ver la página Citar e insertar.",
  },
  {
    title: "Metodología del termómetro",
    description:
      "Preguntas sobre cómo calculamos el score macro o cambios de fuentes.",
  },
] as const;

export default function ContactoPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6">
        <Breadcrumbs
          items={[{ label: "Inicio", href: "/" }, { label: "Contacto" }]}
          currentPath="/contacto"
        />

        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-bold tracking-tight">Contacto</h1>
          <p className="text-muted-foreground">
            {BRAND_NAME} es un proyecto editorial independiente sobre macroeconomía
            argentina. Acá podés escribirnos directamente.
          </p>
        </div>

        <Card className="border-border/60 bg-card/60">
          <CardHeader>
            <CardTitle>{PUBLISHER_NAME}</CardTitle>
            <CardDescription>
              {PUBLISHER_ROLE} · {PUBLISHER_COUNTRY}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
            <p>{PUBLISHER_BIO}</p>
            <p>
              Email:{" "}
              <a
                href={publisherMailto(`Consulta sobre ${BRAND_NAME}`)}
                className="font-medium text-foreground underline underline-offset-2"
              >
                {PUBLISHER_EMAIL}
              </a>
            </p>
            <p className="text-xs">
              Tiempo de respuesta estimado: {CONTACT_RESPONSE_TIME}.
            </p>
          </CardContent>
        </Card>

        <section className="flex flex-col gap-4">
          <h2 className="font-heading text-xl font-semibold">¿Sobre qué podés escribir?</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {CONTACT_TOPICS.map((topic) => (
              <Card key={topic.title} className="border-border/60 bg-card/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{topic.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {topic.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-heading text-xl font-semibold">Reportar un dato</h2>
          <p className="text-sm text-muted-foreground">
            La forma más rápida de corregir un número es con el formulario prearmado por
            email:
          </p>
          <ReportDataIssue />
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-heading text-xl font-semibold">Política editorial</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            {EDITORIAL_POLICY.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground">
            Más detalle en{" "}
            <Link href="/acerca" className="text-primary underline-offset-2 hover:underline">
              Acerca y metodología
            </Link>
            .
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

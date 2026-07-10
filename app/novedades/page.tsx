import Link from "next/link";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CHANGELOG } from "@/lib/changelog";
import { buildPageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/format";

export const metadata = buildPageMetadata({
  title: "Novedades y cambios de metodología",
  description:
    "Registro de cambios en La Brecha: nuevas fuentes, ajustes al termómetro macro y correcciones de datos.",
  path: "/novedades",
});

export default function NovedadesPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6">
        <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Novedades" }]} />

        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-bold tracking-tight">Novedades</h1>
          <p className="text-muted-foreground">
            Cambios de metodología, nuevas fuentes y mejoras del sitio. Para el detalle
            técnico del termómetro, ver{" "}
            <Link href="/acerca" className="text-primary underline-offset-2 hover:underline">
              Acerca
            </Link>
            .
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {CHANGELOG.map((entry) => (
            <article
              key={`${entry.date}-${entry.title}`}
              className="rounded-xl border border-border/60 bg-card/60 p-5"
            >
              <time className="text-xs text-muted-foreground">{formatDate(entry.date)}</time>
              <h2 className="mt-1 font-heading text-lg font-semibold">{entry.title}</h2>
              <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                {entry.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { BRAND_DESCRIPTION, BRAND_NAME } from "@/lib/brand";

const EXPLORE_LINKS = [
  { href: "/dolar", label: "Dólar hoy" },
  { href: "/inflacion", label: "Inflación" },
  { href: "/indicadores", label: "Indicadores" },
  { href: "/herramientas", label: "Herramientas" },
  { href: "/aprende", label: "Glosario" },
  { href: "/calendario", label: "Calendario económico" },
] as const;

const SITE_LINKS = [
  { href: "/acerca", label: "Acerca y metodología" },
  { href: "/digest", label: "Resumen por email" },
  { href: "/citar", label: "Citar / embed" },
  { href: "/privacidad", label: "Política de privacidad" },
  { href: "/cookies", label: "Cookies" },
  { href: "/terminos", label: "Términos de uso" },
] as const;

const SOURCE_LINKS = [
  { href: "https://www.bcra.gob.ar", label: "BCRA — Banco Central" },
  { href: "https://www.indec.gob.ar", label: "INDEC" },
  { href: "https://dolarapi.com", label: "DolarAPI" },
  { href: "https://argentinadatos.com", label: "ArgentinaDatos" },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <BrandLogo size={28} showGap={false} />
            <span className="font-heading text-sm font-semibold text-foreground">
              {BRAND_NAME}
            </span>
          </div>
          <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
            {BRAND_DESCRIPTION}
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-foreground">Cotizaciones y datos</span>
          {EXPLORE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-foreground">Sitio</span>
          {SITE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-foreground">Fuentes oficiales</span>
          {SOURCE_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="border-t border-border bg-muted/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-xs leading-relaxed text-muted-foreground sm:px-6">
          <p>
            {BRAND_NAME} es un sitio meramente informativo. Los datos publicados
            provienen de fuentes públicas (BCRA, INDEC y APIs de mercado) y pueden
            presentar demoras o imprecisiones. Nada de lo publicado constituye
            asesoramiento financiero, recomendación de inversión ni invitación a
            operar. Verificá siempre las cotizaciones con tu banco o agente antes
            de tomar decisiones.
          </p>
          <p>
            © {year} {BRAND_NAME}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

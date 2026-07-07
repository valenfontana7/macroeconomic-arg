import Link from "next/link";
import { Suspense } from "react";

import { BrandLogo } from "@/components/brand-logo";
import { GlobalSearch } from "@/components/global-search";
import { HeaderQuotes } from "@/components/header-quotes";
import { MobileNav } from "@/components/mobile-nav";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";

const NAV_LINKS = [
  { href: "/dolar", label: "Dólar" },
  { href: "/inflacion", label: "Inflación" },
  { href: "/indicadores", label: "Indicadores" },
  { href: "/herramientas", label: "Herramientas" },
  { href: "/aprende", label: "Aprendé" },
  { href: "/calendario", label: "Calendario" },
] as const;

const headerDateFormatter = new Intl.DateTimeFormat("es-AR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "America/Argentina/Buenos_Aires",
});

function todayLabel(): string {
  const label = headerDateFormatter.format(new Date());
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40">
      {/* Franja superior institucional: fecha + mini-cotizaciones */}
      <div className="bg-[#1e3a5f] text-white">
        <div className="mx-auto flex h-8 max-w-6xl items-center justify-between gap-4 overflow-hidden px-4 sm:px-6">
          <span className="hidden text-xs text-white/80 sm:block">{todayLabel()}</span>
          <Suspense fallback={null}>
            <HeaderQuotes />
          </Suspense>
        </div>
      </div>

      {/* Barra principal */}
      <div className="relative border-b border-border bg-card shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <BrandLogo size={36} />
            <span className="flex flex-col gap-0.5">
              <span className="font-heading text-lg font-bold tracking-tight text-foreground">
                {BRAND_NAME}
              </span>
              <span className="hidden text-xs text-muted-foreground sm:block">
                {BRAND_TAGLINE}
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-5 text-sm font-medium md:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-foreground/80 transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <GlobalSearch />
            <MobileNav links={[{ href: "/", label: "Inicio" }, ...NAV_LINKS]} />
          </div>
        </div>
      </div>
    </header>
  );
}

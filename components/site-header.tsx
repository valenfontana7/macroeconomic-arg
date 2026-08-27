import Link from "next/link";

import { MobileNav } from "@/components/mobile-nav";
import { SiteNav } from "@/components/site-nav";
import { BRAND_NAME } from "@/lib/brand";

const NAV_LINKS = [
  { href: "/", label: "Tapa" },
  { href: "/hoy", label: "Hoy" },
  { href: "/completo", label: "Completo" },
  { href: "/dolar", label: "Mercados" },
  { href: "/herramientas", label: "Herramientas" },
] as const;

const datelineFormatter = new Intl.DateTimeFormat("es-AR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "America/Argentina/Buenos_Aires",
});

function dateline(): string {
  const base = datelineFormatter.format(new Date());
  const capitalized = base.charAt(0).toUpperCase() + base.slice(1);
  return `Buenos Aires — ${capitalized}`;
}

export function SiteHeader() {
  return (
    <header className="z-40 border-b border-border/70 bg-background/80 backdrop-blur">
      {/* Nameplate / masthead */}
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <div className="flex flex-col items-center gap-2 pb-4 text-center">
          <Link href="/" className="inline-block">
            <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {BRAND_NAME}
            </h1>
          </Link>
          <p className="text-xs text-muted-foreground">{dateline()}</p>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <hr className="border-t border-border/70" />
      </div>
      {/* Section nav styled like a paper */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between py-2">
          <SiteNav
            links={NAV_LINKS}
            className="gap-6 text-[13px] uppercase tracking-wide text-foreground/80"
          />
          <MobileNav links={[...NAV_LINKS]} />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <hr className="border-t border-border/70" />
      </div>
    </header>
  );
}

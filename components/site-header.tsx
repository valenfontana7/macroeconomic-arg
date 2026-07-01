"use client";

import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { GlobalSearch } from "@/components/global-search";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";

export function SiteHeader() {
  return (
    <header className="relative border-b border-border/60 bg-card/40 backdrop-blur-sm">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brecha-oficial/50 to-brecha-paralelo/50"
        aria-hidden
      />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <BrandLogo size={36} />
          <span className="flex flex-col gap-0.5">
            <span className="text-lg font-semibold tracking-tight text-foreground">
              {BRAND_NAME}
            </span>
            <span className="text-xs text-muted-foreground">{BRAND_TAGLINE}</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <GlobalSearch />
          <nav className="hidden items-center gap-4 text-sm md:flex">
            <Link
              href="/"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link
              href="/dolar"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Dólar
            </Link>
            <Link
              href="/inflacion"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Inflación
            </Link>
            <Link
              href="/herramientas"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Herramientas
            </Link>
            <Link
              href="/aprende"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Aprendé
            </Link>
            <Link
              href="/calendario"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Calendario
            </Link>
            <Link
              href="/acerca"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Acerca
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

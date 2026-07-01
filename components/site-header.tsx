"use client";

import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-border/60 bg-card/40 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex flex-col gap-0.5">
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Pulso Macro AR
          </span>
          <span className="text-xs text-muted-foreground">
            Estado macroeconómico de Argentina
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="/aprende"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Aprendé
          </Link>
          <Link
            href="/acerca"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Acerca
          </Link>
        </nav>
      </div>
    </header>
  );
}

import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buttonVariants } from "@/components/ui/button";
import { BRAND_NAME } from "@/lib/brand";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main
        id="main-content"
        className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 px-4 py-16 text-center sm:px-6"
      >
        <BrandLogo size={48} />
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-bold">Página no encontrada</h1>
          <p className="text-muted-foreground">
            No encontramos esa ruta en {BRAND_NAME}. Probá volver al inicio o buscar un
            indicador.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className={cn(buttonVariants())}>
            Ir al inicio
          </Link>
          <Link href="/indicadores" className={cn(buttonVariants({ variant: "outline" }))}>
            Ver indicadores
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

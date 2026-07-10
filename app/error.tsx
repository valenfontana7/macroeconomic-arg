"use client";

import Link from "next/link";
import { useEffect } from "react";

import { BrandLogo } from "@/components/brand-logo";
import { buttonVariants } from "@/components/ui/button";
import { BRAND_NAME } from "@/lib/brand";
import { cn } from "@/lib/utils";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col items-center justify-center gap-6 px-4 py-16 text-center sm:px-6"
    >
      <BrandLogo size={48} />
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-bold">Algo salió mal</h1>
        <p className="text-muted-foreground">
          {BRAND_NAME} tuvo un error al cargar esta página. Podés reintentar o volver al
          inicio.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className={cn(buttonVariants())}>
          Reintentar
        </button>
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}

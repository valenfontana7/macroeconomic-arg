import Link from "next/link";

import { BrandLogo } from "@/components/brand-logo";
import { BRAND_DESCRIPTION, BRAND_NAME } from "@/lib/brand";
import { INDICATORS } from "@/lib/indicators";
import { TOOLS } from "@/lib/tools/registry";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-card/20">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
        <div className="flex flex-col gap-2 md:col-span-2">
          <div className="flex items-center gap-2">
            <BrandLogo size={28} showGap={false} />
            <span className="font-heading text-sm font-semibold text-foreground">
              {BRAND_NAME}
            </span>
          </div>
          <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
            {BRAND_DESCRIPTION} No es asesoramiento financiero.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-foreground">Explorar</span>
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            Dashboard
          </Link>
          <Link href="/dolar" className="text-muted-foreground hover:text-foreground">
            Dólar
          </Link>
          <Link href="/inflacion" className="text-muted-foreground hover:text-foreground">
            Inflación
          </Link>
          <Link href="/indicadores" className="text-muted-foreground hover:text-foreground">
            Indicadores
          </Link>
          <Link href="/herramientas" className="text-muted-foreground hover:text-foreground">
            Herramientas
          </Link>
          <Link href="/aprende" className="text-muted-foreground hover:text-foreground">
            Aprendé
          </Link>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-foreground">Legal</span>
          <Link href="/privacidad" className="text-muted-foreground hover:text-foreground">
            Privacidad
          </Link>
          <Link href="/cookies" className="text-muted-foreground hover:text-foreground">
            Cookies
          </Link>
          <Link href="/terminos" className="text-muted-foreground hover:text-foreground">
            Términos
          </Link>
          <Link href="/calendario" className="text-muted-foreground hover:text-foreground">
            Calendario
          </Link>
          <Link href="/digest" className="text-muted-foreground hover:text-foreground">
            Digest email
          </Link>
          <Link href="/citar" className="text-muted-foreground hover:text-foreground">
            Citar / embed
          </Link>
          <Link href="/acerca" className="text-muted-foreground hover:text-foreground">
            Acerca y fuentes
          </Link>
        </div>
      </div>

      <div className="border-t border-border/40 py-4 text-center text-xs text-muted-foreground">
        Datos: BCRA · INDEC · DolarAPI · ArgentinaDatos ·{" "}
        {INDICATORS.length} indicadores · {TOOLS.length} herramientas
      </div>
    </footer>
  );
}

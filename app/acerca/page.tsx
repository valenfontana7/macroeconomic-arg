import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ReportDataIssue } from "@/components/report-data-issue";
import {
  BRAND_DOMAIN_RECOMMENDED,
  BRAND_NAME,
  brandUrl,
} from "@/lib/brand";
import { METHODOLOGY_VERSION } from "@/lib/methodology";
import {
  EDITORIAL_POLICY,
  PUBLISHER_BIO,
  PUBLISHER_COUNTRY,
  PUBLISHER_EMAIL,
  PUBLISHER_NAME,
  PUBLISHER_ROLE,
} from "@/lib/publisher";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Acerca de La Brecha — fuentes y metodología",
  description: `Fuentes oficiales (BCRA, INDEC), metodología del termómetro macro, dominio ${BRAND_DOMAIN_RECOMMENDED} y avisos legales de ${BRAND_NAME}.`,
  path: "/acerca",
  keywords: ["fuentes BCRA INDEC", "metodología termómetro macro", BRAND_NAME],
});

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content" className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Acerca de {BRAND_NAME}</h1>
          <p className="text-muted-foreground">
            Dashboard independiente que integra datos públicos del BCRA, INDEC,
            cotizaciones de mercado y riesgo país para contextualizar la economía
            argentina.
          </p>
        </div>

        <Card className="border-border/60 bg-card/60">
          <CardHeader>
            <CardTitle>Quién está detrás</CardTitle>
            <CardDescription>
              {PUBLISHER_NAME} · {PUBLISHER_ROLE} · {PUBLISHER_COUNTRY}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
            <p>{PUBLISHER_BIO}</p>
            <p>
              Contacto:{" "}
              <Link href="/contacto" className="text-foreground underline underline-offset-2">
                {PUBLISHER_EMAIL}
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardHeader>
            <CardTitle>Política editorial</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
            <ul className="flex list-disc flex-col gap-2 pl-5">
              {EDITORIAL_POLICY.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardHeader>
            <CardTitle>Fuentes de datos</CardTitle>
            <CardDescription>APIs públicas oficiales y de mercado</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
            <ul className="flex list-disc flex-col gap-2 pl-5">
              <li>
                <a
                  href="https://www.bcra.gob.ar/apis-banco-central/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground underline underline-offset-2"
                >
                  BCRA
                </a>
                : reservas, base monetaria, tasas, variables monetarias v4.0 y
                cotizaciones cambiarias v1.0.
              </li>
              <li>
                <a
                  href="https://apis.datos.gob.ar/series/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground underline underline-offset-2"
                >
                  datos.gob.ar
                </a>
                : IPC mensual e interanual, IPC núcleo, EMAE y salario real
                industrial (INDEC).
              </li>
              <li>
                datos.gob.ar / IMIG (Ministerio de Economía): resultado primario y
                financiero del sector público.
              </li>
              <li>
                datos.gob.ar / INDEC: deuda externa del gobierno general.
              </li>
              <li>
                <a
                  href="https://dolarapi.com/docs/argentina/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground underline underline-offset-2"
                >
                  DolarAPI
                </a>
                : dólar oficial, blue, MEP, CCL, tarjeta, EUR, BRL, CLP y UYU.
              </li>
              <li>
                <a
                  href="https://argentinadatos.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-foreground underline underline-offset-2"
                >
                  ArgentinaDatos
                </a>
                : histórico de cotizaciones, inflación y riesgo país (EMBI).
              </li>
            </ul>
            <p>
              No reemplazan informes oficiales ni constituyen asesoramiento
              financiero, legal o de inversión.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardHeader>
            <CardTitle>Filosofía educativa</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
            <p>
              {BRAND_NAME} combina datos oficiales con explicaciones claras
              para que cualquier persona entienda qué mira y por qué importa. El
              glosario en{" "}
              <Link href="/aprende" className="text-foreground underline underline-offset-2">
                Aprendé
              </Link>{" "}
              no reemplaza asesoramiento financiero: solo traduce indicadores
              macro a decisiones del día a día.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardHeader>
            <CardTitle>Termómetro macro: cómo se calcula</CardTitle>
            <CardDescription>{METHODOLOGY_VERSION}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
            <p>
              El score (0–100) combina diez señales con pesos fijos y reglas
              transparentes. Si falta un dato para una señal, usamos 50 (neutral):
            </p>
            <ul className="flex list-disc flex-col gap-2 pl-5">
              <li>Inflación mensual (18%)</li>
              <li>Variación de reservas en 30 días (15%)</li>
              <li>Volatilidad del dólar mayorista en 30 días (12%)</li>
              <li>Crecimiento de la base monetaria en 30 días (9%)</li>
              <li>BADLAR real vs inflación anualizada (6%)</li>
              <li>Brecha CCL vs oficial (12%)</li>
              <li>Riesgo país EMBI (8%)</li>
              <li>Resultado primario acumulado 3 meses (10%)</li>
              <li>Variación interanual deuda externa pública (7%)</li>
              <li>M2 privado interanual (3%)</li>
            </ul>
            <p>
              Finanzas públicas (resultado financiero, deuda total/PIB) se muestran
              en el dashboard pero no entran al score hasta contar con series
              oficiales actualizadas. La deuda externa INDEC se publica con rezago
              trimestral.
            </p>
            <p>
              Estados: Tranquilo (≥75), Atento (55–74), Turbulento (35–54),
              Crítico (&lt;35). Cambios de metodología en{" "}
              <Link href="/novedades" className="text-primary underline-offset-2 hover:underline">
                Novedades
              </Link>
              .
            </p>
            <ReportDataIssue />
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardHeader>
            <CardTitle>Alertas de brecha</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
            <p>
              Podés configurar umbrales para la brecha entre el dólar oficial y
              los paralelos (CCL, blue, MEP). Las preferencias se guardan en el
              navegador de este dispositivo; no se envían a ningún servidor.
            </p>
            <p>
              Defaults: CCL 20%, Blue 15%, MEP 12%. Cuando se supera un umbral,
              aparece un banner en el dashboard.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardHeader>
            <CardTitle>Tipografía</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
            <p>
              Interfaz con Plus Jakarta Sans (títulos) y DM Sans (texto), más
              JetBrains Mono para cifras. Fuentes servidas vía Google Fonts /
              next/font.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardHeader>
            <CardTitle>Limitaciones</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
            <ul className="flex list-disc flex-col gap-2 pl-5">
              <li>
                Las cotizaciones paralelas (blue, MEP, CCL) provienen de fuentes
                de mercado, no del BCRA.
              </li>
              <li>
                El salario real mostrado proviene del Índice de Salarios total
                (INDEC), no del sector industria (serie discontinuada).
              </li>
              <li>
                Las alertas de brecha son locales al navegador; el digest por email es
                opcional y requiere suscripción.
              </li>
              <li>
                Cualquier fuente puede demorar o no responder; mostramos lo
                disponible con cache cuando es posible.
              </li>
              <li>
                Cada serie tiene su propia periodicidad y fecha de actualización.
              </li>
              <li>
                Los textos &quot;En simple&quot; y las señales usan reglas fijas,
                no inteligencia artificial.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardHeader>
            <CardTitle>Dominio y producción</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
            <p>
              El dominio del sitio es{" "}
              <code className="text-foreground">{BRAND_DOMAIN_RECOMMENDED}</code>.
              Configurá{" "}
              <code className="text-foreground">NEXT_PUBLIC_SITE_URL</code> con la URL canónica
              (ej. <code className="text-foreground">{brandUrl()}</code>) en Vercel. Eso actualiza
              sitemap, Open Graph, embeds y enlaces de compartir.
            </p>
            <p>
              El digest por email requiere{" "}
              <code className="text-foreground">RESEND_API_KEY</code> y{" "}
              <code className="text-foreground">RESEND_FROM_EMAIL</code>. Ver{" "}
              <code className="text-foreground">.env.example</code> en el repositorio.
            </p>
            <p>
              Medios y blogs pueden citar el sitio o insertar el termómetro desde{" "}
              <Link href="/citar" className="text-primary underline-offset-2 hover:underline">
                Citar e insertar
              </Link>
              .
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardHeader>
            <CardTitle>Aviso legal</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
            <p>
              {BRAND_NAME} no está afiliado al BCRA, INDEC ni a los proveedores
              de cotizaciones. Los datos se publican tal como los proveen las
              fuentes, sujeto a sus términos.
            </p>
            <p>
              Consultas sobre las APIs:{" "}
              <a
                href="mailto:api@bcra.gob.ar"
                className="text-foreground underline underline-offset-2"
              >
                api@bcra.gob.ar
              </a>
            </p>
            <Separator />
            <Link href="/" className="text-foreground underline underline-offset-2">
              Volver al dashboard
            </Link>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </>
  );
}

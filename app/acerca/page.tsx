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
import {
  BRAND_DOMAIN_ALTERNATIVES,
  BRAND_DOMAIN_RECOMMENDED,
  BRAND_NAME,
  brandUrl,
  pageTitle,
} from "@/lib/brand";

export const metadata = {
  title: pageTitle("Acerca"),
  description:
    `Fuentes, metodología del termómetro macro y avisos legales de ${BRAND_NAME}.`,
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6">
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
              {BRAND_NAME} combina datos oficiales con explicaciones en criollo
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
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
            <p>
              El score (0–100) combina siete señales con pesos fijos y reglas
              transparentes:
            </p>
            <ul className="flex list-disc flex-col gap-2 pl-5">
              <li>Inflación mensual (22%)</li>
              <li>Variación de reservas en 30 días (18%)</li>
              <li>Volatilidad del dólar mayorista en 30 días (15%)</li>
              <li>Crecimiento de la base monetaria en 30 días (12%)</li>
              <li>BADLAR real vs inflación anualizada (8%)</li>
              <li>Brecha CCL vs oficial (15%)</li>
              <li>Riesgo país EMBI (10%)</li>
            </ul>
            <p>
              Estados: Tranquilo (≥75), Atento (55–74), Turbulento (35–54),
              Crítico (&lt;35).
            </p>
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
                Los textos &quot;En criollo&quot; y las señales usan reglas fijas,
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
              <code className="text-foreground">labrecha.com.ar</code> no está disponible y{" "}
              <code className="text-foreground">labrecha.ar</code> no es opción en este proyecto.
              Recomendamos registrar{" "}
              <code className="text-foreground">{BRAND_DOMAIN_RECOMMENDED}</code> y apuntarlo a Vercel.
            </p>
            <p>
              Configurá{" "}
              <code className="text-foreground">NEXT_PUBLIC_SITE_URL</code> con la URL canónica
              (ej. <code className="text-foreground">{brandUrl()}</code>). Eso actualiza sitemap,
              Open Graph, embeds y enlaces de compartir.
            </p>
            <p className="font-medium text-foreground">Otras opciones si la principal ya está tomada:</p>
            <ul className="flex list-disc flex-col gap-2 pl-5">
              {BRAND_DOMAIN_ALTERNATIVES.map(({ domain, note }) => (
                <li key={domain}>
                  <code className="text-foreground">{domain}</code> — {note}
                </li>
              ))}
            </ul>
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

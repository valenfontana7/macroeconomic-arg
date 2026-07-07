import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { DigestSignup } from "@/components/digest-signup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BRAND_DESCRIPTION, BRAND_NAME } from "@/lib/brand";
import { getDashboardData } from "@/lib/dashboard-data";
import { buildDigestContent, isDigestEnabled } from "@/lib/digest-email";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Digest macro por email",
  description: `Recibí el resumen diario de dólar, inflación y brecha de ${BRAND_NAME}. ${BRAND_DESCRIPTION}`,
  path: "/digest",
});

export const revalidate = 3600;

export default async function DigestPage() {
  const data = await getDashboardData();
  const preview = buildDigestContent(data);
  const enabled = isDigestEnabled();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 py-8 sm:px-6">
        <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Digest" }]} />

        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-bold tracking-tight">Digest por email</h1>
          <p className="text-muted-foreground">
            El mismo resumen del dashboard — termómetro, inflación y brecha — directo en tu
            correo. Sin noticias: solo datos e interpretación en simple.
          </p>
        </div>

        <DigestSignup enabled={enabled} />

        <Card className="border-border/60 bg-card/60">
          <CardHeader>
            <CardTitle className="text-lg">Vista previa de hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {preview.text}
            </pre>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </>
  );
}

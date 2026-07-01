import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CiteBlocks } from "@/components/cite-blocks";
import { EmbedThermometer } from "@/components/embed-thermometer";
import { BRAND_NAME } from "@/lib/brand";
import { getDashboardData } from "@/lib/dashboard-data";
import { getSiteUrl } from "@/lib/site-url";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Citar e insertar el termómetro macro",
  description: `Cómo citar ${BRAND_NAME} en medios y blogs e insertar el widget del termómetro macro en tu sitio.`,
  path: "/citar",
});

export const revalidate = 3600;

export default async function CitarPage() {
  const data = await getDashboardData();
  const siteUrl = getSiteUrl();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6">
        <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Citar e insertar" }]} />

        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-bold tracking-tight">Citar e insertar</h1>
          <p className="text-muted-foreground">
            Para blogs, newsletters, medios y docentes. Los datos provienen de fuentes
            públicas; citá el sitio y enlazá a {siteUrl}.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Vista previa del embed</h2>
          <div className="flex justify-center rounded-xl border border-border/60 bg-muted/20 p-6">
            <EmbedThermometer score={data.macroScore} showLink={false} />
          </div>
        </div>

        <CiteBlocks siteUrl={siteUrl} />
      </main>
      <SiteFooter />
    </>
  );
}

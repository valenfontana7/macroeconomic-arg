import { MarketsTape } from "@/components/markets-tape";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { DailyCoverArticle } from "@/components/daily-cover-article";
import { getDashboardData } from "@/lib/dashboard-data";
import { buildDailyCover } from "@/lib/daily-cover";
import { articleJsonLd, buildPageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { PUBLISHER_NAME } from "@/lib/publisher";

export const revalidate = 900;

export async function generateMetadata() {
  const data = await getDashboardData();
  const cover = buildDailyCover(data);
  return buildPageMetadata({
    title: cover.title,
    description: cover.dek ?? "",
    path: "/hoy",
    type: "article",
    keywords: ["tapa", "hoy", "mercados", "economía argentina"],
  });
}

export default async function HoyPage() {
  const data = await getDashboardData();
  const cover = buildDailyCover(data);

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: cover.title,
          description: cover.dek ?? "",
          path: "/hoy",
          dateModified: cover.updatedAt,
          authorName: PUBLISHER_NAME,
        })}
      />
      <SiteHeader />
      <MarketsTape />
      <main
        id="main-content"
        className="mx-auto flex w-full max-w-[65ch] flex-col gap-8 px-4 py-8 sm:px-6"
      >
        <DailyCoverArticle cover={cover} />
      </main>
      <SiteFooter />
    </>
  );
}


import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { GuidePageView } from "@/components/guide-page-view";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  getGuideBySlug,
  getGuideConcepts,
  GUIDE_PAGES,
} from "@/lib/guide-pages";
import { buildPageMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return GUIDE_PAGES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: "Guía no encontrada" };

  return buildPageMetadata({
    title: guide.title,
    description: guide.description,
    path: `/aprende/guia/${guide.slug}`,
    type: "article",
    keywords: [guide.title, "Argentina", "macroeconomía", "guía"],
  });
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const concepts = getGuideConcepts(guide.conceptSlugs);

  return (
    <>
      <SiteHeader />
      <main id="main-content" className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Inicio", href: "/" },
            { label: "Aprendé", href: "/aprende" },
            { label: guide.title },
          ]}
          currentPath={`/aprende/guia/${guide.slug}`}
        />

        <GuidePageView guide={guide} concepts={concepts} />
      </main>
      <SiteFooter />
    </>
  );
}

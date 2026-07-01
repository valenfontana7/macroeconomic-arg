import { BRAND_DESCRIPTION, BRAND_NAME } from "@/lib/brand";
import { getSiteUrl } from "@/lib/site-url";
import type { MacroConcept } from "@/lib/macro-education";

export function faqJsonLd(concept: MacroConcept) {
  const questions = [
    { q: `¿Qué es ${concept.title}?`, a: concept.enCristiano },
    { q: `¿Para qué sirve ${concept.title}?`, a: concept.paraQueSirve },
    { q: `¿Cómo leer ${concept.title}?`, a: concept.comoLeerlo },
    { q: `¿Qué hacer con ${concept.title}?`, a: concept.enTuVida },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND_NAME,
    url: getSiteUrl(),
    description: `${BRAND_DESCRIPTION} Visualizaciones e herramientas interactivas.`,
    inLanguage: "es-AR",
  };
}

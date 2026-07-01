import type { Metadata } from "next";

import {
  BRAND_DESCRIPTION,
  BRAND_NAME,
  BRAND_OG_DESCRIPTION,
  BRAND_TAGLINE,
} from "@/lib/brand";
import type { MacroConcept } from "@/lib/macro-education";
import { getSiteUrl } from "@/lib/site-url";

export const SEO_KEYWORDS = [
  "dólar hoy argentina",
  "dólar blue hoy",
  "dólar MEP",
  "dólar CCL",
  "brecha cambiaria",
  "inflación argentina",
  "IPC INDEC",
  "economía argentina",
  "BCRA",
  "tipo de cambio",
  "reservas internacionales",
  "macroeconomía argentina",
  "cotización dólar oficial",
  "inflación mensual",
  "inflación interanual",
] as const;

export function canonicalUrl(path = ""): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export type PageSeoOptions = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  ogTitle?: string;
  noIndex?: boolean;
  type?: "website" | "article";
};

export function buildPageMetadata(options: PageSeoOptions): Metadata {
  const url = canonicalUrl(options.path ?? "/");

  return {
    title: options.title,
    description: options.description,
    keywords: [...(options.keywords ?? SEO_KEYWORDS)],
    alternates: { canonical: url },
    robots: options.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      title: options.ogTitle ?? `${options.title} | ${BRAND_NAME}`,
      description: options.description,
      url,
      siteName: BRAND_NAME,
      locale: "es_AR",
      type: options.type ?? "website",
    },
    twitter: {
      card: "summary_large_image",
      title: options.ogTitle ?? `${options.title} | ${BRAND_NAME}`,
      description: options.description,
    },
  };
}

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function breadcrumbJsonLd(items: BreadcrumbItem[], currentPath?: string) {
  const base = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const isLast = index === items.length - 1;
      const path = item.href ?? (isLast ? currentPath : undefined);
      const itemUrl = path
        ? path.startsWith("http")
          ? path
          : `${base}${path.startsWith("/") ? path : `/${path}`}`
        : undefined;

      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        ...(itemUrl ? { item: itemUrl } : {}),
      };
    }),
  };
}

export function faqJsonLdFromPairs(questions: { q: string; a: string }[]) {
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

export function faqJsonLd(concept: MacroConcept) {
  return faqJsonLdFromPairs([
    { q: `¿Qué es ${concept.title}?`, a: concept.enCristiano },
    { q: `¿Para qué sirve ${concept.title}?`, a: concept.paraQueSirve },
    { q: `¿Cómo leer ${concept.title}?`, a: concept.comoLeerlo },
    { q: `¿Qué hacer con ${concept.title}?`, a: concept.enTuVida },
  ]);
}

export function organizationJsonLd() {
  const url = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND_NAME,
    url,
    description: BRAND_DESCRIPTION,
    slogan: BRAND_TAGLINE,
    logo: {
      "@type": "ImageObject",
      url: `${url}/icon`,
      width: 48,
      height: 48,
    },
    sameAs: [],
    areaServed: {
      "@type": "Country",
      name: "Argentina",
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND_NAME,
    url: getSiteUrl(),
    description: BRAND_OG_DESCRIPTION,
    inLanguage: "es-AR",
    publisher: {
      "@type": "Organization",
      name: BRAND_NAME,
    },
  };
}

export function itemListJsonLd(
  name: string,
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export function datasetJsonLd(options: {
  name: string;
  description: string;
  path: string;
  keywords?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: options.name,
    description: options.description,
    url: canonicalUrl(options.path),
    keywords: options.keywords ?? ["Argentina", "macroeconomía", "BCRA", "INDEC"],
    creator: {
      "@type": "Organization",
      name: BRAND_NAME,
    },
    spatialCoverage: {
      "@type": "Country",
      name: "Argentina",
    },
    inLanguage: "es-AR",
  };
}

export function webApplicationJsonLd(options: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: options.name,
    description: options.description,
    url: canonicalUrl(options.path),
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "ARS",
    },
    inLanguage: "es-AR",
  };
}

export const DOLAR_FAQ = [
  {
    q: "¿Cuál es la diferencia entre el dólar oficial y el blue?",
    a: "El dólar oficial es la cotización regulada por el BCRA para operaciones autorizadas. El blue es el precio del mercado paralelo, sin controles cambiarios, y suele cotizar más alto.",
  },
  {
    q: "¿Qué es la brecha cambiaria?",
    a: "Es la diferencia porcentual entre un dólar paralelo (blue, MEP o CCL) y el oficial. Una brecha alta indica tensión en el mercado cambiario.",
  },
  {
    q: "¿Qué es el dólar MEP y el CCL?",
    a: "El MEP (bolsa) surge de comprar bonos en pesos y venderlos en dólares en Argentina. El CCL (contado con liqui) liquida esa operación en el exterior. Ambos son tipos de cambio implícitos.",
  },
] as const;

export const INFLACION_FAQ = [
  {
    q: "¿Qué es el IPC del INDEC?",
    a: "El Índice de Precios al Consumidor mide la variación promedio de precios de una canasta de bienes y servicios. Es la inflación oficial de Argentina.",
  },
  {
    q: "¿Cuál es la diferencia entre inflación mensual e interanual?",
    a: "La mensual compara precios contra el mes anterior. La interanual compara contra el mismo mes del año pasado y muestra cuánto subieron los precios en doce meses.",
  },
  {
    q: "¿Por qué importa la inflación para el dólar?",
    a: "Si los precios suben más rápido que el tipo de cambio oficial, el peso pierde valor real y suele aumentar la presión sobre dólares paralelos y la brecha.",
  },
] as const;

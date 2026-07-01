import type { MetadataRoute } from "next";

import { ALL_CONCEPTS } from "@/lib/macro-education";
import { INDICATORS } from "@/lib/indicators";
import { getSiteUrl } from "@/lib/site-url";
import { getToolSlugs } from "@/lib/tools/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/acerca",
    "/aprende",
    "/herramientas",
    "/dolar",
    "/inflacion",
    "/indicadores",
    "/digest",
    "/citar",
    "/calendario",
    "/privacidad",
    "/cookies",
    "/terminos",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "hourly" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const indicatorRoutes: MetadataRoute.Sitemap = INDICATORS.map((indicator) => ({
    url: `${base}/indicador/${indicator.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const conceptRoutes: MetadataRoute.Sitemap = ALL_CONCEPTS.map((concept) => ({
    url: `${base}/aprende/${concept.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const toolRoutes: MetadataRoute.Sitemap = getToolSlugs().map((slug) => ({
    url: `${base}/herramientas/${slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.75,
  }));

  return [...staticRoutes, ...indicatorRoutes, ...conceptRoutes, ...toolRoutes];
}

import type { MetadataRoute } from "next";

import { ALL_CONCEPTS } from "@/lib/macro-education";
import { INDICATORS } from "@/lib/indicators";
import { getSiteUrl } from "@/lib/site-url";
import { getToolSlugs } from "@/lib/tools/registry";

type SitemapEntry = MetadataRoute.Sitemap[number];

function route(
  path: string,
  priority: number,
  changeFrequency: SitemapEntry["changeFrequency"],
): SitemapEntry {
  const now = new Date();
  return {
    url: `${getSiteUrl()}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const hubRoutes: MetadataRoute.Sitemap = [
    route("/", 1, "hourly"),
    route("/dolar", 0.95, "hourly"),
    route("/inflacion", 0.95, "daily"),
    route("/indicadores", 0.9, "daily"),
    route("/finanzas-publicas", 0.85, "daily"),
    route("/herramientas", 0.85, "weekly"),
    route("/aprende", 0.85, "weekly"),
    route("/calendario", 0.75, "weekly"),
    route("/acerca", 0.5, "monthly"),
    route("/novedades", 0.5, "weekly"),
    route("/digest", 0.4, "monthly"),
    route("/citar", 0.4, "monthly"),
    route("/privacidad", 0.2, "yearly"),
    route("/cookies", 0.2, "yearly"),
    route("/terminos", 0.2, "yearly"),
  ];

  const indicatorRoutes: MetadataRoute.Sitemap = INDICATORS.map((indicator) =>
    route(`/indicador/${indicator.slug}`, 0.85, "daily"),
  );

  const conceptRoutes: MetadataRoute.Sitemap = ALL_CONCEPTS.map((concept) =>
    route(`/aprende/${concept.slug}`, 0.7, "monthly"),
  );

  const toolRoutes: MetadataRoute.Sitemap = getToolSlugs().map((slug) =>
    route(`/herramientas/${slug}`, 0.8, "weekly"),
  );

  return [...hubRoutes, ...indicatorRoutes, ...conceptRoutes, ...toolRoutes];
}

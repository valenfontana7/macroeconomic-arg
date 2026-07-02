import type { MetadataRoute } from "next";

import { BRAND_DESCRIPTION, BRAND_NAME } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND_NAME,
    short_name: BRAND_NAME,
    description: BRAND_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#0f172a",
    lang: "es-AR",
    categories: ["finance", "news"],
    icons: [
      { src: "/icons/192", type: "image/png", sizes: "192x192", purpose: "any" },
      { src: "/icons/512", type: "image/png", sizes: "512x512", purpose: "any" },
      { src: "/icons/512", type: "image/png", sizes: "512x512", purpose: "maskable" },
      { src: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
    ],
  };
}

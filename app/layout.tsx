import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";

import { CookieConsentBanner } from "@/components/cookie-consent";
import { AdSenseLoader } from "@/components/adsense-loader";
import { JsonLd } from "@/components/json-ld";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BRAND_DESCRIPTION, BRAND_NAME, BRAND_OG_DESCRIPTION } from "@/lib/brand";
import { getSiteUrl } from "@/lib/site-url";
import { organizationJsonLd, SEO_KEYWORDS, websiteJsonLd } from "@/lib/seo";

import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${BRAND_NAME} — dólar, inflación y brecha en Argentina`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: BRAND_DESCRIPTION,
  keywords: [...SEO_KEYWORDS],
  authors: [{ name: BRAND_NAME, url: getSiteUrl() }],
  creator: BRAND_NAME,
  publisher: BRAND_NAME,
  category: "finance",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    title: `${BRAND_NAME} — dólar, inflación y brecha en Argentina`,
    description: BRAND_OG_DESCRIPTION,
    locale: "es_AR",
    type: "website",
    siteName: BRAND_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} — dólar, inflación y brecha en Argentina`,
    description: BRAND_OG_DESCRIPTION,
  },
  alternates: {
    canonical: getSiteUrl(),
  },
  icons: {
    icon: [
      { url: "/icons/16", type: "image/png", sizes: "16x16" },
      { url: "/icons/32", type: "image/png", sizes: "32x32" },
      { url: "/icon", type: "image/png", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-AR"
      className={`dark ${dmSans.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background font-sans">
        <AdSenseLoader />
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <TooltipProvider>{children}</TooltipProvider>
        <CookieConsentBanner />
      </body>
    </html>
  );
}

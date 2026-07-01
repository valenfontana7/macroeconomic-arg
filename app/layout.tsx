import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";

import { TooltipProvider } from "@/components/ui/tooltip";
import { AdSenseScript } from "@/components/adsense-script";

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
  title: {
    default: "Pulso Macro AR",
    template: "%s | Pulso Macro AR",
  },
  description:
    "Dashboard visual del estado macroeconómico de Argentina con datos oficiales del BCRA: reservas, dólar, inflación y más.",
  openGraph: {
    title: "Pulso Macro AR",
    description:
      "Estado macroeconómico de Argentina explicado en criollo, con datos del BCRA.",
    locale: "es_AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`dark ${dmSans.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background font-sans">
        <AdSenseScript />
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}

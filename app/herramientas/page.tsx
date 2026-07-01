import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { pageTitle } from "@/lib/brand";
import { TOOLS } from "@/lib/tools/registry";

export const metadata = {
  title: pageTitle("Herramientas"),
  description:
    "Simuladores, comparadores y experiencias interactivas para entender la economía argentina con datos.",
};

export default function HerramientasPage() {
  const sorted = [...TOOLS].sort((a, b) => a.impactOrder - b.impactOrder);

  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Herramientas interactivas
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Experiencias que no vas a encontrar en un diario ni en un panel de
            cotizaciones: simuladores, tu termómetro personal y lectura de señales en criollo.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {sorted.map((tool) => (
            <Link
              key={tool.slug}
              href={`/herramientas/${tool.slug}`}
              className="group block h-full"
            >
              <Card className="h-full border-border/60 bg-card/60 transition-colors group-hover:border-primary/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span aria-hidden>{tool.emoji}</span>
                    {tool.title}
                  </CardTitle>
                  <CardDescription>{tool.tagline}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

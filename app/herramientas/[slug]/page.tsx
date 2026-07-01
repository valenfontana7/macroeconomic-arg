import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ConflictingSignalsTool } from "@/components/tools/conflicting-signals-tool";
import { DecisionTreeTool } from "@/components/tools/decision-tree-tool";
import { DollarizationTool } from "@/components/tools/dollarization-tool";
import { MacroTimelineTool } from "@/components/tools/macro-timeline-tool";
import { PersonalThermometerTool } from "@/components/tools/personal-thermometer-tool";
import { PulsoDelDiaTool } from "@/components/tools/pulso-del-dia-tool";
import { SalaryInflationTool } from "@/components/tools/salary-inflation-tool";
import { ScenarioSandboxTool } from "@/components/tools/scenario-sandbox-tool";
import { ToolShell } from "@/components/tools/tool-shell";
import { TravelTool } from "@/components/tools/travel-tool";
import { UncertaintyMapTool } from "@/components/tools/uncertainty-map-tool";
import { analyzeConflictingSignals } from "@/lib/tools/conflicting-signals";
import { buildDailyPulseCard } from "@/lib/tools/pulso-del-dia";
import { pageTitle } from "@/lib/brand";
import { getToolsBundle } from "@/lib/tools/bundle";
import { TOOL_BY_SLUG, getToolSlugs } from "@/lib/tools/registry";
import type { ToolSlug } from "@/lib/tools/types";

export const revalidate = 3600;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getToolSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const tool = TOOL_BY_SLUG[slug as ToolSlug];
  if (!tool) return { title: "Herramienta no encontrada" };
  return {
    title: pageTitle(`${tool.title} | Herramientas`),
    description: tool.description,
  };
}

export default async function HerramientaPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = TOOL_BY_SLUG[slug as ToolSlug];
  if (!tool) notFound();

  const bundle = await getToolsBundle();
  const { dashboard, macroInput } = bundle;

  const currentRates = {
    oficial: dashboard.dollar?.quotes.find((q) => q.casa === "oficial")?.venta ?? null,
    blue: dashboard.dollar?.quotes.find((q) => q.casa === "blue")?.venta ?? null,
    bolsa: dashboard.dollar?.quotes.find((q) => q.casa === "bolsa")?.venta ?? null,
    ccl: dashboard.dollar?.quotes.find((q) => q.casa === "contadoconliqui")?.venta ?? null,
  };

  let content: React.ReactNode;

  switch (slug as ToolSlug) {
    case "pulso-del-dia":
      content = <PulsoDelDiaTool pulse={buildDailyPulseCard(dashboard)} />;
      break;
    case "sueldo-vs-inflacion":
      content = <SalaryInflationTool ipcMonthlySeries={bundle.ipcMonthlySeries} />;
      break;
    case "arbol-decisiones":
      content = <DecisionTreeTool />;
      break;
    case "senales-contradictorias":
      content = (
        <ConflictingSignalsTool
          tensions={analyzeConflictingSignals(dashboard.macroScore.breakdown)}
        />
      );
      break;
    case "termometro-personal":
      content = (
        <PersonalThermometerTool
          breakdown={dashboard.macroScore.breakdown}
          macroScore={dashboard.macroScore.score}
        />
      );
      break;
    case "dolarizacion-historica":
      content = (
        <DollarizationTool histories={bundle.dollarHistories} currentRates={currentRates} />
      );
      break;
    case "modo-viajero":
      content = <TravelTool quotes={dashboard.forex} />;
      break;
    case "sandbox-escenarios":
      content = (
        <ScenarioSandboxTool
          baseInput={macroInput}
          currentScore={dashboard.macroScore.score}
        />
      );
      break;
    case "mapa-incertidumbre":
      content = <UncertaintyMapTool entries={bundle.volatilityMap} />;
      break;
    case "linea-de-tiempo":
      content = <MacroTimelineTool />;
      break;
    default: {
      const _exhaustive: never = slug as never;
      return _exhaustive;
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <ToolShell tool={tool}>{content}</ToolShell>
      </main>
      <SiteFooter />
    </>
  );
}

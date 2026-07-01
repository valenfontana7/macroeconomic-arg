import type { MacroScoreInput } from "@/lib/macro-score";
import type { MacroScoreResult } from "@/lib/macro-score";
import type { DashboardData } from "@/lib/dashboard-data";
import type { BcraDataPoint } from "@/types/bcra";
import type { ForeignQuote } from "@/types/external";

export type ToolSlug =
  | "pulso-del-dia"
  | "sueldo-vs-inflacion"
  | "arbol-decisiones"
  | "senales-contradictorias"
  | "termometro-personal"
  | "dolarizacion-historica"
  | "modo-viajero"
  | "sandbox-escenarios"
  | "mapa-incertidumbre"
  | "linea-de-tiempo";

export type ToolDefinition = {
  slug: ToolSlug;
  title: string;
  tagline: string;
  description: string;
  emoji: string;
  impactOrder: number;
};

export type ToolsBundle = {
  dashboard: DashboardData;
  macroInput: MacroScoreInput;
  ipcMonthlySeries: BcraDataPoint[];
  dollarHistories: {
    oficial: BcraDataPoint[];
    blue: BcraDataPoint[];
    bolsa: BcraDataPoint[];
    ccl: BcraDataPoint[];
  };
  volatilityMap: VolatilityEntry[];
};

export type VolatilityEntry = {
  id: string;
  label: string;
  volatility30d: number | null;
  volatility90d: number | null;
  level: "baja" | "normal" | "alta";
  change30d: number | null;
};

export type DailyPulseCard = {
  date: string;
  score: number;
  mood: MacroScoreResult["mood"];
  headline: string;
  lines: string[];
  keyNumbers: { label: string; value: string }[];
  shareText: string;
};

export type SignalTension = {
  id: string;
  positive: { label: string; score: number };
  negative: { label: string; score: number };
  summary: string;
};

export type TimelineMilestone = {
  year: number;
  title: string;
  description: string;
  context: string;
};

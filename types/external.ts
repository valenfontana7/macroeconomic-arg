import { z } from "zod";

export const dolarQuoteSchema = z.object({
  moneda: z.string(),
  casa: z.string(),
  nombre: z.string(),
  compra: z.number(),
  venta: z.number(),
  fechaActualizacion: z.string(),
});

export const dolarQuotesSchema = z.array(dolarQuoteSchema);

export const argentinaDatosInflacionSchema = z.array(
  z.object({
    fecha: z.string(),
    valor: z.number(),
  }),
);

export const argentinaDatosCotizacionSchema = z.array(
  z.object({
    casa: z.string(),
    compra: z.number(),
    venta: z.number(),
    fecha: z.string(),
  }),
);

export const argentinaDatosRiesgoPaisSchema = z.object({
  valor: z.number(),
  fecha: z.string(),
});

export const datosGobarSeriesMetaSchema = z.object({
  field: z
    .object({
      description: z.string(),
      id: z.string(),
      representation_mode: z.string().optional(),
      representation_mode_units: z.string().optional(),
    })
    .optional(),
});

export const datosGobarSeriesResponseSchema = z.object({
  data: z.array(z.array(z.union([z.string(), z.number(), z.null()]))),
  count: z.number(),
  meta: z.array(datosGobarSeriesMetaSchema),
});

export type DolarQuote = z.infer<typeof dolarQuoteSchema>;
export type ArgentinaDatosCotizacion = z.infer<
  typeof argentinaDatosCotizacionSchema
>[number];

export const foreignQuoteSchema = dolarQuoteSchema;

export type ForeignQuote = DolarQuote;

export type IndecSnapshot = {
  ipcMonthly: number | null;
  ipcMonthlyDate: string | null;
  ipcAnnual: number | null;
  ipcAnnualDate: string | null;
  ipcCoreMonthly: number | null;
  ipcCoreDate: string | null;
  emaeAnnual: number | null;
  emaeDate: string | null;
  salaryRealAnnual: number | null;
  salaryRealDate: string | null;
  purchasingPowerIndex: number | null;
  purchasingPowerDate: string | null;
};

export type DollarSnapshot = {
  quotes: DolarQuote[];
  brechaBluePct: number | null;
  brechaMepPct: number | null;
  brechaCclPct: number | null;
  updatedAt: string | null;
};

export type CountryRiskSnapshot = {
  valor: number;
  fecha: string;
};

export type FiscalSnapshot = {
  primaryBalanceLatest: number | null;
  primaryBalanceDate: string | null;
  primaryBalance3m: number | null;
  financialResultLatest: number | null;
  financialResultDate: string | null;
  externalDebtUsd: number | null;
  externalDebtDate: string | null;
  externalDebtChangeYoY: number | null;
};

export type ContextInsight = {
  id: string;
  title: string;
  body: string;
  level: "info" | "warning" | "alert";
  category: "cambio" | "precios" | "actividad" | "externo" | "ahorro" | "salarios" | "fiscal";
};

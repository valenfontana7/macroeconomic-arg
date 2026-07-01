import { z } from "zod";

export const bcraResultsetSchema = z.object({
  count: z.number(),
  offset: z.number(),
  limit: z.number(),
});

export const bcraMetadataSchema = z.object({
  resultset: bcraResultsetSchema,
});

export const bcraVariableSchema = z.object({
  idVariable: z.number(),
  descripcion: z.string(),
  categoria: z.string(),
  tipoSerie: z.string(),
  periodicidad: z.string(),
  unidadExpresion: z.string(),
  moneda: z.string(),
  primerFechaInformada: z.string(),
  ultFechaInformada: z.string(),
  ultValorInformado: z.number(),
});

export const bcraVariablesResponseSchema = z.object({
  status: z.number(),
  metadata: bcraMetadataSchema,
  results: z.array(bcraVariableSchema),
});

export const bcraDataPointSchema = z.object({
  fecha: z.string(),
  valor: z.number(),
});

export const bcraSeriesResultSchema = z.object({
  idVariable: z.number(),
  detalle: z.array(bcraDataPointSchema),
});

export const bcraSeriesResponseSchema = z.object({
  status: z.number(),
  metadata: bcraMetadataSchema,
  results: z.array(bcraSeriesResultSchema),
});

export const bcraCotizacionDetalleSchema = z.object({
  codigoMoneda: z.string(),
  descripcion: z.string(),
  tipoPase: z.number(),
  tipoCotizacion: z.number(),
});

export const bcraCotizacionesResponseSchema = z.object({
  status: z.number(),
  results: z.object({
    fecha: z.string(),
    detalle: z.array(bcraCotizacionDetalleSchema),
  }),
});

export type BcraVariable = z.infer<typeof bcraVariableSchema>;
export type BcraDataPoint = z.infer<typeof bcraDataPointSchema>;
export type BcraCotizacionDetalle = z.infer<typeof bcraCotizacionDetalleSchema>;

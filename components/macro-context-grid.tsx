import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataFreshnessBadge } from "@/components/data-freshness-badge";
import { LearnMoreLink } from "@/components/learn-more-link";
import { SourceLink } from "@/components/source-link";
import type { FreshnessKind } from "@/lib/data-freshness";
import { formatDate, formatPercent } from "@/lib/format";
import { indecSeriesSourceUrl } from "@/lib/source-links";
import type { CountryRiskSnapshot, IndecSnapshot } from "@/types/external";

type MacroContextGridProps = {
  indec: IndecSnapshot | null;
  countryRisk: CountryRiskSnapshot | null;
};

function ContextMetric({
  label,
  value,
  date,
  source,
  sourceUrl,
  freshnessKind,
  hint,
  learnSlug,
}: {
  label: string;
  value: string;
  date: string | null;
  source: string;
  sourceUrl?: string | null;
  freshnessKind?: FreshnessKind;
  hint?: string;
  learnSlug?: string;
}) {
  return (
    <Card className="border-border/60 bg-card/60 [--card-spacing:--spacing(5)]">
      <CardHeader className="gap-3 pb-0">
        <div className="flex items-start justify-between gap-3">
          <CardDescription className="text-xs leading-snug">{label}</CardDescription>
          {freshnessKind ? (
            <DataFreshnessBadge date={date} kind={freshnessKind} />
          ) : null}
        </div>
        <CardTitle className="text-2xl tabular-nums tracking-tight">{value}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 pt-4 text-xs leading-relaxed text-muted-foreground">
        {hint ? <p>{hint}</p> : null}
        {date ? <p>Ref. {formatDate(date)}</p> : null}
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-border/50 pt-3">
          <p>
            Fuente: {sourceUrl ? <SourceLink href={sourceUrl} label={source} className="text-xs" /> : source}
          </p>
          {learnSlug ? <LearnMoreLink slug={learnSlug} /> : null}
        </div>
      </CardContent>
    </Card>
  );
}

export function MacroContextGrid({ indec, countryRisk }: MacroContextGridProps) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex max-w-3xl flex-col gap-2">
        <h2 className="font-heading text-xl font-semibold">Contexto INDEC y mercado</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Indicadores que complementan al BCRA y ayudan a entender precios,
          actividad y percepción de riesgo. Para inflación, priorizamos IPC INDEC
          como referencia oficial frente a series BCRA.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <ContextMetric
          label="Salario real total (interanual)"
          value={
            indec?.salaryRealAnnual != null
              ? formatPercent(indec.salaryRealAnnual)
              : "—"
          }
          date={indec?.salaryRealDate ?? null}
          source="datos.gob.ar / INDEC"
          sourceUrl={indecSeriesSourceUrl("salaryIndexYoY")}
          freshnessKind="indec_monthly"
          hint="Variación real del Índice de Salarios total, descontando inflación interanual."
          learnSlug="salario-real"
        />
        <ContextMetric
          label="Índice de salarios total"
          value={
            indec?.purchasingPowerIndex != null
              ? indec.purchasingPowerIndex.toFixed(1)
              : "—"
          }
          date={indec?.purchasingPowerDate ?? null}
          source="datos.gob.ar / INDEC"
          sourceUrl={indecSeriesSourceUrl("salaryIndex")}
          freshnessKind="indec_monthly"
          hint="Índice INDEC de salarios pagados en la economía. Base octubre 2016=100."
          learnSlug="poder-adquisitivo"
        />
        <ContextMetric
          label="Inflación mensual (IPC INDEC)"
          value={indec?.ipcMonthly !== null && indec?.ipcMonthly !== undefined ? formatPercent(indec.ipcMonthly) : "—"}
          date={indec?.ipcMonthlyDate ?? null}
          source="INDEC — oficial"
          sourceUrl={indecSeriesSourceUrl("ipcMonthly")}
          freshnessKind="indec_monthly"
          hint="Cuánto subieron los precios en el último mes publicado. Este es el IPC oficial."
          learnSlug="inflacion"
        />
        <ContextMetric
          label="Inflación interanual"
          value={indec?.ipcAnnual !== null && indec?.ipcAnnual !== undefined ? formatPercent(indec.ipcAnnual) : "—"}
          date={indec?.ipcAnnualDate ?? null}
          source="INDEC — oficial"
          sourceUrl={indecSeriesSourceUrl("ipcAnnual")}
          freshnessKind="indec_monthly"
          hint="Variación de precios en los últimos 12 meses."
          learnSlug="ipc-interanual"
        />
        <ContextMetric
          label="IPC núcleo (mensual)"
          value={indec?.ipcCoreMonthly !== null && indec?.ipcCoreMonthly !== undefined ? formatPercent(indec.ipcCoreMonthly) : "—"}
          date={indec?.ipcCoreDate ?? null}
          source="datos.gob.ar / INDEC"
          sourceUrl={indecSeriesSourceUrl("ipcCore")}
          freshnessKind="indec_monthly"
          hint="Inflación sin componentes volátiles; suele anticipar la tendencia."
          learnSlug="ipc-nucleo"
        />
        <ContextMetric
          label="EMAE (var. interanual)"
          value={indec?.emaeAnnual !== null && indec?.emaeAnnual !== undefined ? formatPercent(indec.emaeAnnual) : "—"}
          date={indec?.emaeDate ?? null}
          source="datos.gob.ar / INDEC"
          sourceUrl={indecSeriesSourceUrl("emaeAnnual")}
          freshnessKind="indec_monthly"
          hint="Proxy de actividad económica: producción y consumo."
          learnSlug="emae"
        />
        <ContextMetric
          label="Riesgo país (EMBI)"
          value={countryRisk ? `${countryRisk.valor} pb` : "—"}
          date={countryRisk?.fecha ?? null}
          source="ArgentinaDatos"
          freshnessKind="quotes"
          hint="Prima de riesgo que pagan los bonos argentinos vs. EE.UU."
          learnSlug="riesgo-pais"
        />
      </div>
    </section>
  );
}

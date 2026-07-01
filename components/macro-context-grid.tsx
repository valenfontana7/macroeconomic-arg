import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LearnMoreLink } from "@/components/learn-more-link";
import { formatDate, formatPercent } from "@/lib/format";
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
  hint,
  learnSlug,
}: {
  label: string;
  value: string;
  date: string | null;
  source: string;
  hint?: string;
  learnSlug?: string;
}) {
  return (
    <Card className="border-border/60 bg-card/60">
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-xs text-muted-foreground">
        {hint ? <p>{hint}</p> : null}
        {date ? <p>Ref. {formatDate(date)}</p> : null}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p>Fuente: {source}</p>
          {learnSlug ? <LearnMoreLink slug={learnSlug} /> : null}
        </div>
      </CardContent>
    </Card>
  );
}

export function MacroContextGrid({ indec, countryRisk }: MacroContextGridProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-xl font-semibold">Contexto INDEC y mercado</h2>
        <p className="text-sm text-muted-foreground">
          Indicadores que complementan al BCRA y ayudan a entender precios,
          actividad y percepción de riesgo.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ContextMetric
          label="Salario real total (interanual)"
          value={
            indec?.salaryRealAnnual != null
              ? formatPercent(indec.salaryRealAnnual)
              : "—"
          }
          date={indec?.salaryRealDate ?? null}
          source="datos.gob.ar / INDEC"
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
          hint="Índice INDEC de salarios pagados en la economía. Base octubre 2016=100."
          learnSlug="poder-adquisitivo"
        />
        <ContextMetric
          label="Inflación mensual (IPC INDEC)"
          value={indec?.ipcMonthly !== null && indec?.ipcMonthly !== undefined ? formatPercent(indec.ipcMonthly) : "—"}
          date={indec?.ipcMonthlyDate ?? null}
          source="datos.gob.ar / INDEC"
          hint="Cuánto subieron los precios en el último mes publicado."
          learnSlug="inflacion"
        />
        <ContextMetric
          label="Inflación interanual"
          value={indec?.ipcAnnual !== null && indec?.ipcAnnual !== undefined ? formatPercent(indec.ipcAnnual) : "—"}
          date={indec?.ipcAnnualDate ?? null}
          source="datos.gob.ar / INDEC"
          hint="Variación de precios en los últimos 12 meses."
          learnSlug="ipc-interanual"
        />
        <ContextMetric
          label="IPC núcleo (mensual)"
          value={indec?.ipcCoreMonthly !== null && indec?.ipcCoreMonthly !== undefined ? formatPercent(indec.ipcCoreMonthly) : "—"}
          date={indec?.ipcCoreDate ?? null}
          source="datos.gob.ar / INDEC"
          hint="Inflación sin componentes volátiles; suele anticipar la tendencia."
          learnSlug="ipc-nucleo"
        />
        <ContextMetric
          label="EMAE (var. interanual)"
          value={indec?.emaeAnnual !== null && indec?.emaeAnnual !== undefined ? formatPercent(indec.emaeAnnual) : "—"}
          date={indec?.emaeDate ?? null}
          source="datos.gob.ar / INDEC"
          hint="Proxy de actividad económica: producción y consumo."
          learnSlug="emae"
        />
        <ContextMetric
          label="Riesgo país (EMBI)"
          value={countryRisk ? `${countryRisk.valor} pb` : "—"}
          date={countryRisk?.fecha ?? null}
          source="ArgentinaDatos"
          hint="Prima de riesgo que pagan los bonos argentinos vs. EE.UU."
          learnSlug="riesgo-pais"
        />
      </div>
    </section>
  );
}

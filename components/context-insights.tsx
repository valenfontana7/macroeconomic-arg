import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ContextInsight } from "@/types/external";
import { cn } from "@/lib/utils";

type ContextInsightsProps = {
  insights: ContextInsight[];
};

const LEVEL_STYLES: Record<ContextInsight["level"], string> = {
  info: "border-sky-500/25 bg-sky-500/5",
  warning: "border-amber-500/25 bg-amber-500/5",
  alert: "border-red-500/25 bg-red-500/5",
};

const CATEGORY_LABELS: Record<ContextInsight["category"], string> = {
  cambio: "Tipo de cambio",
  precios: "Precios",
  actividad: "Actividad",
  externo: "Sector externo",
  ahorro: "Ahorro e inversiones",
  salarios: "Salarios y trabajo",
  fiscal: "Finanzas públicas",
};

export function ContextInsights({ insights }: ContextInsightsProps) {
  if (insights.length === 0) return null;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex max-w-3xl flex-col gap-2">
        <h2 className="font-heading text-xl font-semibold tracking-tight">
          Señales para el día a día
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Lectura automática de los datos: qué mirar si estás ahorrando,
          comprando dólares o armando un presupuesto.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {insights.map((insight) => (
          <Card
            key={insight.id}
            className={cn("border [--card-spacing:--spacing(5)]", LEVEL_STYLES[insight.level])}
          >
            <CardHeader className="gap-2 pb-0">
              <CardDescription className="text-xs">{CATEGORY_LABELS[insight.category]}</CardDescription>
              <CardTitle className="text-base leading-snug">{insight.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-sm leading-relaxed text-muted-foreground">
              {insight.body}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

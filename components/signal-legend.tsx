import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const SIGNAL_STYLES = {
  good: "bg-emerald-50 text-emerald-700 border-emerald-300",
  warning: "bg-amber-50 text-amber-700 border-amber-300",
  danger: "bg-red-50 text-red-700 border-red-300",
} as const;

export function SignalLegend() {
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 px-4 py-3">
      <p className="mb-2 text-sm font-medium">¿Qué significan los colores?</p>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Badge variant="outline" className={cn("shrink-0", SIGNAL_STYLES.good)}>
            OK
          </Badge>
          Señal favorable según umbrales del indicador.
        </span>
        <span className="flex items-center gap-1.5">
          <Badge variant="outline" className={cn("shrink-0", SIGNAL_STYLES.warning)}>
            Atento
          </Badge>
          Valor en zona intermedia: conviene mirarlo de cerca.
        </span>
        <span className="flex items-center gap-1.5">
          <Badge variant="outline" className={cn("shrink-0", SIGNAL_STYLES.danger)}>
            Alerta
          </Badge>
          Valor preocupante según las reglas del panel.
        </span>
      </div>
    </div>
  );
}

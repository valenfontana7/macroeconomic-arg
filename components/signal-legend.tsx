import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const SIGNAL_STYLES = {
  good: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  danger: "bg-red-500/15 text-red-400 border-red-500/30",
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

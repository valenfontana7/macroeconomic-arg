import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { MOOD_LABELS, type MacroScoreResult } from "@/lib/macro-score";
import { scoreToGaugeColor } from "@/lib/thermometer-color";
import { cn } from "@/lib/utils";

type ThermometerPulseTeaserProps = {
  score: MacroScoreResult;
  onShowFull?: () => void;
};

export function ThermometerPulseTeaser({ score, onShowFull }: ThermometerPulseTeaserProps) {
  const accent = scoreToGaugeColor(score.score);

  return (
    <div
      id="termometro"
      className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/60 p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Termómetro macro</p>
          <p className="text-lg font-semibold" style={{ color: accent }}>
            {MOOD_LABELS[score.mood]}
          </p>
          <p className="text-xs text-muted-foreground">
            El score completo está arriba en el resumen del día.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {onShowFull ? (
            <button
              type="button"
              onClick={onShowFull}
              className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
            >
              Ver desglose completo
            </button>
          ) : (
            <Link
              href="#termometro-full"
              className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
            >
              Ver desglose completo
            </Link>
          )}
          <Link href="/digest" className={cn(buttonVariants({ size: "sm" }))}>
            Resumen por email
          </Link>
        </div>
      </div>
    </div>
  );
}

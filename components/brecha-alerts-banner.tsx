"use client";

import { useEffect, useState } from "react";

import {
  evaluateBrechaAlerts,
  loadBrechaAlerts,
  type BrechaAlertTrigger,
} from "@/lib/brecha-alerts";
import { formatPercent } from "@/lib/format";
import type { DollarSnapshot } from "@/types/external";
import { cn } from "@/lib/utils";

type BrechaAlertsBannerProps = {
  dollar: DollarSnapshot;
};

export function BrechaAlertsBanner({ dollar }: BrechaAlertsBannerProps) {
  const [triggers, setTriggers] = useState<BrechaAlertTrigger[]>([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const settings = loadBrechaAlerts();
    const active = evaluateBrechaAlerts(settings, {
      brechaCclPct: dollar.brechaCclPct,
      brechaBluePct: dollar.brechaBluePct,
      brechaMepPct: dollar.brechaMepPct,
    });
    setTriggers(active);
    setDismissed(false);
  }, [dollar]);

  if (dismissed || triggers.length === 0) return null;

  const isCritical = triggers.some((t) => t.currentPct >= t.thresholdPct + 10);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border px-4 py-3 text-sm",
        isCritical
          ? "border-red-300 bg-red-50 text-red-800"
          : "border-amber-300 bg-amber-50 text-amber-800",
      )}
      role="alert"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <p className="font-medium">
            {triggers.length === 1
              ? "Alerta de brecha cambiaria"
              : `${triggers.length} alertas de brecha activas`}
          </p>
          <ul className="flex list-disc flex-col gap-1 pl-5 text-muted-foreground">
            {triggers.map((trigger) => (
              <li key={trigger.type}>
                Brecha {trigger.label}: {formatPercent(trigger.currentPct)} (umbral:{" "}
                {formatPercent(trigger.thresholdPct)})
              </li>
            ))}
          </ul>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="shrink-0 text-xs underline underline-offset-2 opacity-80 hover:opacity-100"
        >
          Ocultar
        </button>
      </div>
    </div>
  );
}

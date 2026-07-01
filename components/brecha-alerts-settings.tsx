"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DEFAULT_BRECHA_ALERTS,
  loadBrechaAlerts,
  saveBrechaAlerts,
  type BrechaAlertsSettings,
  type BrechaType,
} from "@/lib/brecha-alerts";
import { cn } from "@/lib/utils";

const FIELDS: Array<{ key: BrechaType; label: string }> = [
  { key: "ccl", label: "CCL" },
  { key: "blue", label: "Blue" },
  { key: "mep", label: "MEP" },
];

export function BrechaAlertsSettings() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<BrechaAlertsSettings>(DEFAULT_BRECHA_ALERTS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(loadBrechaAlerts());
  }, []);

  function updateThreshold(type: BrechaType, value: number) {
    setSettings((prev) => ({
      ...prev,
      [type]: { ...prev[type], thresholdPct: value },
    }));
    setSaved(false);
  }

  function toggleEnabled(type: BrechaType) {
    setSettings((prev) => ({
      ...prev,
      [type]: { ...prev[type], enabled: !prev[type].enabled },
    }));
    setSaved(false);
  }

  function handleSave() {
    saveBrechaAlerts(settings);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    setSettings(DEFAULT_BRECHA_ALERTS);
    saveBrechaAlerts(DEFAULT_BRECHA_ALERTS);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <Card className="border-border/60 bg-card/60">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">Mis alertas de brecha</CardTitle>
            <CardDescription>
              Umbrales guardados en tu navegador. Te avisamos en el dashboard si
              se superan.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Cerrar" : "Configurar"}
          </Button>
        </div>
      </CardHeader>

      {open ? (
        <CardContent className="flex flex-col gap-4 border-t border-border/60 pt-4">
          {FIELDS.map(({ key, label }) => (
            <div
              key={key}
              className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={settings[key].enabled}
                  onChange={() => toggleEnabled(key)}
                  className="size-4 rounded border-border"
                />
                Brecha {label}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.5}
                  value={settings[key].thresholdPct}
                  disabled={!settings[key].enabled}
                  onChange={(event) =>
                    updateThreshold(key, Number(event.target.value))
                  }
                  className={cn(
                    "h-9 w-24 rounded-md border border-input bg-background px-3 font-mono text-sm tabular-nums",
                    !settings[key].enabled && "opacity-50",
                  )}
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
          ))}

          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" onClick={handleSave}>
              Guardar
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={handleReset}>
              Restaurar defaults
            </Button>
            {saved ? (
              <span className="self-center text-xs text-emerald-400">Guardado</span>
            ) : null}
          </div>
        </CardContent>
      ) : null}
    </Card>
  );
}

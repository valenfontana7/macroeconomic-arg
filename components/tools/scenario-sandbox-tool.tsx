"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOOD_EMOJI, MOOD_LABELS, type MacroScoreInput } from "@/lib/macro-score";
import { scenarioScore } from "@/lib/tools/calculations";
import { scoreToGaugeColor } from "@/lib/thermometer-color";

type ScenarioSandboxToolProps = {
  baseInput: MacroScoreInput;
  currentScore: number;
};

export function ScenarioSandboxTool({ baseInput, currentScore }: ScenarioSandboxToolProps) {
  const [inflation, setInflation] = useState(baseInput.inflationMonthly ?? 4);
  const [brecha, setBrecha] = useState(baseInput.brechaCclPct ?? 15);
  const [reserves, setReserves] = useState(baseInput.reservesChange30d ?? 0);

  const scenario = useMemo(
    () =>
      scenarioScore(baseInput, {
        inflationMonthly: inflation,
        brechaCclPct: brecha,
        reservesChange30d: reserves,
      }),
    [baseInput, inflation, brecha, reserves],
  );

  const accent = scoreToGaugeColor(scenario.score);
  const delta = scenario.score - currentScore;

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-border/60 bg-card/60">
        <CardContent className="flex flex-col gap-5 pt-6">
          <label className="flex flex-col gap-2 text-sm">
            Inflación mensual: {inflation.toFixed(1)}%
            <input
              type="range"
              min={0}
              max={12}
              step={0.1}
              value={inflation}
              onChange={(e) => setInflation(Number(e.target.value))}
              className="w-full"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            Brecha CCL: {brecha.toFixed(1)}%
            <input
              type="range"
              min={0}
              max={60}
              step={0.5}
              value={brecha}
              onChange={(e) => setBrecha(Number(e.target.value))}
              className="w-full"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            Variación reservas 30d: {reserves.toFixed(1)}%
            <input
              type="range"
              min={-15}
              max={15}
              step={0.5}
              value={reserves}
              onChange={(e) => setReserves(Number(e.target.value))}
              className="w-full"
            />
          </label>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/60 text-center">
        <CardHeader>
          <CardTitle className="text-base">Termómetro en tu escenario</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-2">
          <p className="text-5xl font-bold tabular-nums" style={{ color: accent }}>
            {scenario.score}
          </p>
          <Badge variant="outline">
            {MOOD_EMOJI[scenario.mood]} {MOOD_LABELS[scenario.mood]}
          </Badge>
          <p className="text-sm text-muted-foreground">
            Hoy real: {currentScore}/100 ·{" "}
            <span className={delta >= 0 ? "text-emerald-700" : "text-red-700"}>
              {delta >= 0 ? "+" : ""}
              {delta} pts en tu escenario
            </span>
          </p>
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground">
        Usa las mismas reglas del termómetro macro. El resto de variables se mantiene
        en los valores actuales del mercado.
      </p>
    </div>
  );
}

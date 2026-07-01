"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOOD_EMOJI, MOOD_LABELS, type MacroScoreResult } from "@/lib/macro-score";
import {
  calculatePersonalScore,
  CONCERN_LABELS,
  type PersonalConcern,
} from "@/lib/tools/calculations";
import { scoreToGaugeColor } from "@/lib/thermometer-color";

const ALL_CONCERNS = Object.keys(CONCERN_LABELS) as PersonalConcern[];

type PersonalThermometerToolProps = {
  breakdown: MacroScoreResult["breakdown"];
  macroScore: number;
};

export function PersonalThermometerTool({
  breakdown,
  macroScore,
}: PersonalThermometerToolProps) {
  const [selected, setSelected] = useState<PersonalConcern[]>(["inflacion", "dolar"]);

  const personal = useMemo(
    () => calculatePersonalScore(breakdown, selected),
    [breakdown, selected],
  );

  function toggle(concern: PersonalConcern) {
    setSelected((prev) =>
      prev.includes(concern) ? prev.filter((c) => c !== concern) : [...prev, concern],
    );
  }

  const accent = scoreToGaugeColor(personal.score);

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-border/60 bg-card/60">
        <CardHeader>
          <CardTitle className="text-base">¿Qué te importa hoy?</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {ALL_CONCERNS.map((concern) => {
            const active = selected.includes(concern);
            return (
              <button
                key={concern}
                type="button"
                onClick={() => toggle(concern)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border/60 text-muted-foreground hover:border-primary/40"
                }`}
              >
                {CONCERN_LABELS[concern]}
              </button>
            );
          })}
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/60 text-center">
        <CardContent className="flex flex-col items-center gap-2 pt-8 pb-8">
          <p className="text-sm text-muted-foreground">Tu termómetro personal</p>
          <p className="text-6xl font-bold tabular-nums" style={{ color: accent }}>
            {personal.score}
          </p>
          <Badge variant="outline">
            {MOOD_EMOJI[personal.mood]} {MOOD_LABELS[personal.mood]}
          </Badge>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Macro general: {macroScore}/100. Tu score pondera solo lo que elegiste arriba.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MACRO_TIMELINE } from "@/lib/tools/timeline-data";

export function MacroTimelineTool() {
  const [active, setActive] = useState(0);
  const milestone = MACRO_TIMELINE[active];

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex gap-2 overflow-x-auto pb-2 lg:max-w-[200px] lg:flex-col lg:overflow-visible">
        {MACRO_TIMELINE.map((m, i) => (
          <button
            key={m.year}
            type="button"
            onClick={() => setActive(i)}
            className={`shrink-0 rounded-lg border px-3 py-2 text-left text-sm transition-colors lg:w-full ${
              i === active
                ? "border-primary bg-primary/15 text-primary"
                : "border-border/60 text-muted-foreground hover:border-primary/40"
            }`}
          >
            <span className="font-mono font-bold">{m.year}</span>
            <span className="mt-0.5 block text-xs opacity-80">{m.title}</span>
          </button>
        ))}
      </div>

      <Card className="min-w-0 flex-1 border-border/60 bg-card/60">
        <CardHeader>
          <CardTitle>
            {milestone.year} — {milestone.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
          <p>{milestone.description}</p>
          <p className="rounded-lg border border-border/40 bg-muted/30 p-3 text-foreground">
            {milestone.context}
          </p>
          <p className="text-xs">
            Explorá el dashboard para ver cómo dólar, inflación y reservas se comportan
            hoy frente a estos momentos históricos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

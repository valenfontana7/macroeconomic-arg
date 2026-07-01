"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { scoreToGaugeColor } from "@/lib/thermometer-color";
import type { SignalTension } from "@/lib/tools/types";

type ConflictingSignalsToolProps = {
  tensions: SignalTension[];
};

export function ConflictingSignalsTool({ tensions }: ConflictingSignalsToolProps) {
  return (
    <div className="flex flex-col gap-4">
      {tensions.map((tension) => (
        <Card key={tension.id} className="border-border/60 bg-card/60">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap gap-4 text-sm">
              {tension.negative.score > 0 ? (
                <>
                  <span style={{ color: scoreToGaugeColor(tension.positive.score) }}>
                    ↑ {tension.positive.label} ({tension.positive.score})
                  </span>
                  <span className="text-muted-foreground">vs</span>
                  <span style={{ color: scoreToGaugeColor(tension.negative.score) }}>
                    ↓ {tension.negative.label} ({tension.negative.score})
                  </span>
                </>
              ) : (
                <span style={{ color: scoreToGaugeColor(tension.positive.score) }}>
                  {tension.positive.label} ({tension.positive.score})
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">{tension.summary}</p>
          </CardContent>
        </Card>
      ))}

      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-muted-foreground">
        Cada señal se puntúa de 0 a 100 según reglas fijas del termómetro macro.
        Cuando dos indicadores importantes están en extremos opuestos, la economía
        &quot;no te cierra el panorama&quot; con un solo número.
      </div>
    </div>
  );
}

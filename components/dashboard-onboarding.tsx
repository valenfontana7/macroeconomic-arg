"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { isOnboardingDone, markOnboardingDone } from "@/lib/dashboard-view-mode";

const STEPS = [
  {
    title: "Termómetro macro",
    body: "Un score de 0 a 100 resume inflación, dólar, reservas, fiscal y más. Tocá «¿Cómo se calcula?» para ver los pesos.",
  },
  {
    title: "Dólar y brecha",
    body: "Arriba ves oficial, MEP, CCL y blue. La brecha mide cuánto más caro está el paralelo vs el oficial.",
  },
  {
    title: "Alertas y digest",
    body: "Configurá alertas de brecha y recibí el resumen semanal por email cuando quieras profundizar.",
  },
] as const;

export function DashboardOnboarding() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setVisible(!isOnboardingDone());
  }, []);

  if (!visible) return null;

  const finish = () => {
    markOnboardingDone();
    setVisible(false);
  };

  const current = STEPS[step];

  return (
    <div className="rounded-xl border border-primary/25 bg-primary/5 p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-primary">
          Primeros pasos · {step + 1}/{STEPS.length}
        </p>
        <button
          type="button"
          onClick={finish}
          className="text-xs text-muted-foreground underline decoration-dotted underline-offset-2"
        >
          Omitir
        </button>
      </div>
      <h3 className="font-medium">{current.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{current.body}</p>
      <div className="mt-3 flex gap-2">
        {step > 0 ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setStep((value) => value - 1)}
          >
            Anterior
          </Button>
        ) : null}
        {step < STEPS.length - 1 ? (
          <Button type="button" size="sm" onClick={() => setStep((value) => value + 1)}>
            Siguiente
          </Button>
        ) : (
          <Button type="button" size="sm" onClick={finish}>
            Listo
          </Button>
        )}
      </div>
    </div>
  );
}

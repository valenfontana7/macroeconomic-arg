"use client";

import { useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  METHODOLOGY_VERSION,
  THERMOMETER_MOODS,
  THERMOMETER_NOTES,
  THERMOMETER_WEIGHTS,
} from "@/lib/methodology";

export function ThermometerMethodologyPanel() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const open = () => {
    dialogRef.current?.showModal();
  };

  const close = () => {
    dialogRef.current?.close();
  };

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={open}>
        ¿Cómo se calcula?
      </Button>

      <dialog
        ref={dialogRef}
        className="fixed inset-0 z-50 m-auto w-[min(100%,32rem)] max-h-[85vh] overflow-y-auto rounded-xl border border-border bg-card p-0 shadow-xl backdrop:bg-black/50 open:flex open:flex-col"
        onClose={close}
      >
        <div className="flex flex-col gap-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-heading text-lg font-semibold">
                Metodología del termómetro
              </h2>
              <p className="text-xs text-muted-foreground">{METHODOLOGY_VERSION}</p>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={close}>
              Cerrar
            </Button>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium">Pesos de las 10 señales</h3>
            <ul className="space-y-1 text-sm">
              {THERMOMETER_WEIGHTS.map((item) => (
                <li key={item.label} className="flex justify-between gap-2">
                  <span>{item.label}</span>
                  <span className="tabular-nums text-muted-foreground">{item.weight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium">Estados de ánimo</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {THERMOMETER_MOODS.map((item) => (
                <li key={item.label}>
                  <span className="font-medium text-foreground">{item.label}</span>{" "}
                  — score {item.range}
                </li>
              ))}
            </ul>
          </div>

          <ul className="space-y-2 text-xs leading-relaxed text-muted-foreground">
            {THERMOMETER_NOTES.map((note) => (
              <li key={note}>• {note}</li>
            ))}
          </ul>

          <p className="text-xs text-muted-foreground">
            Detalle ampliado en{" "}
            <a href="/acerca" className="text-primary underline-offset-2 hover:underline">
              Acerca y metodología
            </a>
            .
          </p>
        </div>
      </dialog>
    </>
  );
}

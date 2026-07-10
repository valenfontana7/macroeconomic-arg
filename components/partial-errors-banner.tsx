"use client";

import { useState } from "react";

import { formatPartialError } from "@/lib/partial-error-labels";

type PartialErrorsBannerProps = {
  errors: string[];
};

export function PartialErrorsBanner({ errors }: PartialErrorsBannerProps) {
  const [expanded, setExpanded] = useState(false);
  if (errors.length === 0) return null;

  const formatted = errors.map(formatPartialError);

  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p>
          Algunas fuentes no respondieron ({errors.length}). Mostramos los datos
          disponibles.
        </p>
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="shrink-0 font-medium underline decoration-dotted underline-offset-2"
        >
          {expanded ? "Ocultar detalle" : "Ver qué falló"}
        </button>
      </div>
      {expanded ? (
        <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
          {formatted.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

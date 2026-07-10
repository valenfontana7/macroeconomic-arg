"use client";

import { useState } from "react";

import { DollarPanel } from "@/components/dollar-panel";
import type { DollarSnapshot } from "@/types/external";
import { cn } from "@/lib/utils";

type CollapsibleDollarPanelProps = {
  dollar: DollarSnapshot;
};

export function CollapsibleDollarPanel({ dollar }: CollapsibleDollarPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 rounded-xl border border-border/60 bg-card/40 px-5 py-4 text-left transition-colors hover:border-primary/30"
        aria-expanded={open}
      >
        <span className="text-sm font-medium">
          Ver todas las cotizaciones y brechas
        </span>
        <span
          className={cn(
            "shrink-0 text-xs text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        >
          ▼
        </span>
      </button>
      {open ? <DollarPanel dollar={dollar} embedded /> : null}
    </section>
  );
}

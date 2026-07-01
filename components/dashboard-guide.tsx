"use client";

import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/utils";

export function DashboardGuide() {
  const [open, setOpen] = useState(true);

  return (
    <section className="rounded-xl border border-border/60 bg-card/40">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-medium">¿Cómo leer este panel?</span>
        <span
          className={cn(
            "text-xs text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        >
          ▼
        </span>
      </button>

      {open ? (
        <div className="border-t border-border/40 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          <ul className="flex list-disc flex-col gap-2 pl-5">
            <li>
              El{" "}
              <Link
                href="/aprende/termometro-macro"
                className="text-foreground underline underline-offset-2"
              >
                termómetro macro
              </Link>{" "}
              resume en un número si el panorama se ve tranquilo o complicado.
            </li>
            <li>
              Si tenés 30 segundos: mirá inflación, brecha CCL y reservas. Son
              las tres señales que más impactan el día a día.
            </li>
            <li>
              Cada tarjeta tiene color OK / Atento / Alerta. Tocá una para ver
              el histórico y aprender qué significa.
            </li>
            <li>
              Explorá el{" "}
              <Link
                href="/aprende"
                className="text-foreground underline underline-offset-2"
              >
                glosario en criollo
              </Link>{" "}
              para entender cada concepto sin ser economista.
            </li>
          </ul>
        </div>
      ) : null}
    </section>
  );
}

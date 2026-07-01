"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  CATEGORY_LABELS,
  type MacroConcept,
  type MacroConceptCategory,
} from "@/lib/macro-education";

type AprendeGlossaryProps = {
  concepts: MacroConcept[];
};

const CATEGORY_ORDER: MacroConceptCategory[] = [
  "precios",
  "cambio",
  "externo",
  "monetario",
  "actividad",
  "panel",
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function AprendeGlossary({ concepts }: AprendeGlossaryProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return concepts;
    return concepts.filter(
      (concept) =>
        normalize(concept.title).includes(q) ||
        normalize(concept.enCristiano).includes(q) ||
        normalize(concept.slug).includes(q),
    );
  }, [concepts, query]);

  const grouped = useMemo(() => {
    const map = new Map<MacroConceptCategory, MacroConcept[]>();
    for (const category of CATEGORY_ORDER) {
      map.set(category, []);
    }
    for (const concept of filtered) {
      map.get(concept.category)?.push(concept);
    }
    return map;
  }, [filtered]);

  return (
    <div className="flex flex-col gap-6">
      <input
        type="search"
        placeholder="Buscar concepto (inflación, brecha, UVA…)"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="max-w-md rounded-md border border-border/60 bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Filtrar conceptos"
      />

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No encontramos conceptos con ese texto. Probá con otra palabra.
        </p>
      ) : null}

      {CATEGORY_ORDER.map((category) => {
        const items = grouped.get(category) ?? [];
        if (items.length === 0) return null;

        return (
          <section key={category} className="flex flex-col gap-3">
            <h2 className="font-heading text-xl font-semibold">
              {CATEGORY_LABELS[category]}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {items.map((concept) => (
                <Link
                  key={concept.slug}
                  href={`/aprende/${concept.slug}`}
                  className="group rounded-xl border border-border/60 bg-card/60 p-4 transition-colors hover:border-primary/30"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="font-medium group-hover:text-primary">
                      {concept.title}
                    </h3>
                    <Badge variant="outline" className="shrink-0 text-xs">
                      {CATEGORY_LABELS[concept.category]}
                    </Badge>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {concept.enCristiano}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

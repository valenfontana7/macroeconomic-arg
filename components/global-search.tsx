"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { searchItems, type SearchGroup } from "@/lib/search-index";
import { cn } from "@/lib/utils";

const GROUP_ORDER: SearchGroup[] = ["Páginas", "Indicadores", "Herramientas", "Aprendé"];

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [modKey, setModKey] = useState("Ctrl");
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => searchItems(query, 14), [query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    setModKey(/Mac|iPhone|iPad/i.test(navigator.platform) ? "⌘" : "Ctrl");
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close]);

  useEffect(() => {
    if (open) {
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }
    if (event.key === "Enter" && results[activeIndex]) {
      event.preventDefault();
      window.location.href = results[activeIndex].href;
      close();
    }
  };

  const grouped = GROUP_ORDER.map((group) => ({
    group,
    items: results.filter((item) => item.group === group),
  })).filter((section) => section.items.length > 0);

  let flatIndex = -1;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-background/60 px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        aria-label="Buscar en el sitio"
      >
        <Search className="size-4" aria-hidden />
        <span className="hidden sm:inline">Buscar</span>
        <kbd className="hidden rounded border border-border/80 bg-muted/50 px-1.5 py-0.5 font-mono text-[10px] sm:inline">
          {modKey}+K
        </kbd>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 p-4 pt-[12vh] backdrop-blur-sm"
          role="presentation"
          onClick={close}
        >
          <div
            role="dialog"
            aria-label="Búsqueda global"
            className="w-full max-w-xl overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
              <Search className="size-4 text-muted-foreground" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Indicadores, conceptos, herramientas…"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-2">
              {results.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                  Sin resultados para &quot;{query}&quot;
                </p>
              ) : (
                grouped.map((section) => (
                  <div key={section.group} className="mb-2">
                    <p className="px-3 py-1 text-xs font-medium text-muted-foreground">
                      {section.group}
                    </p>
                    <ul>
                      {section.items.map((item) => {
                        flatIndex += 1;
                        const index = flatIndex;
                        return (
                          <li key={item.id}>
                            <Link
                              href={item.href}
                              onClick={close}
                              className={cn(
                                "flex flex-col gap-0.5 rounded-lg px-3 py-2 text-sm transition-colors",
                                index === activeIndex
                                  ? "bg-primary/15 text-foreground"
                                  : "hover:bg-muted/60",
                              )}
                              onMouseEnter={() => setActiveIndex(index)}
                            >
                              <span className="font-medium">{item.title}</span>
                              <span className="line-clamp-1 text-xs text-muted-foreground">
                                {item.subtitle}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

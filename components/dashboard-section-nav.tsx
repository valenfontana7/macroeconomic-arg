"use client";

const SECTIONS = [
  { id: "dolar", label: "Dólar" },
  { id: "termometro-full", label: "Termómetro" },
  { id: "fiscal", label: "Fiscal" },
  { id: "indicadores", label: "Indicadores" },
  { id: "graficos", label: "Gráficos" },
] as const;

type DashboardSectionNavProps = {
  visible?: boolean;
};

export function DashboardSectionNav({ visible = true }: DashboardSectionNavProps) {
  if (!visible) return null;

  return (
    <nav
      aria-label="Secciones del dashboard"
      className="sticky top-[4.5rem] z-30 -mx-4 overflow-x-auto border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6"
    >
      <ul className="flex min-w-max gap-3 text-sm">
        {SECTIONS.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="rounded-full border border-border/60 bg-card/80 px-4 py-1.5 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

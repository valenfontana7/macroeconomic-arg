export type MacroCalendarSource = "INDEC" | "BCRA";

export type MacroCalendarCategory =
  | "precios"
  | "actividad"
  | "monetario"
  | "externo";

export type MacroCalendarTemplate = {
  id: string;
  title: string;
  source: MacroCalendarSource;
  description: string;
  category: MacroCalendarCategory;
  typicalDay: number;
  intervalMonths: number;
};

export type MacroCalendarEvent = {
  id: string;
  title: string;
  source: MacroCalendarSource;
  description: string;
  category: MacroCalendarCategory;
  date: string;
  status: "upcoming" | "recent";
};

export const CALENDAR_TEMPLATES: MacroCalendarTemplate[] = [
  {
    id: "ipc",
    title: "IPC — inflación mensual",
    source: "INDEC",
    description: "Variación de precios del mes anterior. Mueve expectativas, paritarias y UVA.",
    category: "precios",
    typicalDay: 13,
    intervalMonths: 1,
  },
  {
    id: "emae",
    title: "EMAE — actividad económica",
    source: "INDEC",
    description: "Estimador mensual de actividad. Señal de si la economía acelera o frena.",
    category: "actividad",
    typicalDay: 22,
    intervalMonths: 1,
  },
  {
    id: "ipi",
    title: "IPI — producción industrial",
    source: "INDEC",
    description: "Índice de producción industrial mensual.",
    category: "actividad",
    typicalDay: 18,
    intervalMonths: 1,
  },
  {
    id: "rem",
    title: "REM — expectativas de mercado",
    source: "BCRA",
    description: "Relevamiento de inflación, tipo de cambio y actividad esperada por analistas.",
    category: "monetario",
    typicalDay: 28,
    intervalMonths: 1,
  },
  {
    id: "pbi-trim",
    title: "PBI trimestral",
    source: "INDEC",
    description: "Cuenta nacional trimestral (publicación aproximada).",
    category: "actividad",
    typicalDay: 20,
    intervalMonths: 3,
  },
];

const CATEGORY_LABELS: Record<MacroCalendarCategory, string> = {
  precios: "Precios",
  actividad: "Actividad",
  monetario: "Monetario",
  externo: "Externo",
};

export function getCategoryLabel(category: MacroCalendarCategory): string {
  return CATEGORY_LABELS[category];
}

function formatDateISO(year: number, month: number, day: number): string {
  const d = new Date(year, month, Math.min(day, 28));
  return d.toISOString().slice(0, 10);
}

function isValidMonthForTemplate(template: MacroCalendarTemplate, month: number): boolean {
  if (template.intervalMonths === 1) return true;
  return month % template.intervalMonths === 0;
}

export function getMacroCalendarEvents(options?: {
  monthsBack?: number;
  monthsAhead?: number;
}): MacroCalendarEvent[] {
  const monthsBack = options?.monthsBack ?? 1;
  const monthsAhead = options?.monthsAhead ?? 2;
  const now = new Date();
  now.setHours(12, 0, 0, 0);

  const events: MacroCalendarEvent[] = [];

  for (const template of CALENDAR_TEMPLATES) {
    for (let offset = -monthsBack; offset <= monthsAhead; offset++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() + offset, 1);
      const month = monthDate.getMonth();
      const year = monthDate.getFullYear();

      if (!isValidMonthForTemplate(template, month)) continue;

      const dateStr = formatDateISO(year, month, template.typicalDay);
      const eventDate = new Date(dateStr);
      eventDate.setHours(12, 0, 0, 0);

      const diffDays = Math.round(
        (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );

      let status: MacroCalendarEvent["status"] | null = null;
      if (diffDays >= -7 && diffDays < 0) status = "recent";
      if (diffDays >= 0 && diffDays <= 45) status = "upcoming";
      if (!status) continue;

      events.push({
        id: `${template.id}-${dateStr}`,
        title: template.title,
        source: template.source,
        description: template.description,
        category: template.category,
        date: dateStr,
        status,
      });
    }
  }

  return events.sort((a, b) => a.date.localeCompare(b.date));
}

export function getUpcomingEvents(limit = 5): MacroCalendarEvent[] {
  return getMacroCalendarEvents()
    .filter((e) => e.status === "upcoming")
    .slice(0, limit);
}

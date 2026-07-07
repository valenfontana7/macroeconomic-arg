import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getCategoryLabel,
  getMacroCalendarEvents,
  getUpcomingEvents,
  type MacroCalendarEvent,
} from "@/lib/macro-calendar";
import { formatDate } from "@/lib/format";

type MacroCalendarPanelProps = {
  compact?: boolean;
  limit?: number;
};

const SOURCE_STYLES = {
  INDEC: "border-sky-300 text-sky-800",
  BCRA: "border-violet-300 text-violet-800",
} as const;

function EventRow({ event }: { event: MacroCalendarEvent }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border/40 py-3 last:border-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">{event.title}</span>
        <Badge variant="outline" className={SOURCE_STYLES[event.source]}>
          {event.source}
        </Badge>
        {event.status === "recent" ? (
          <Badge variant="outline" className="border-emerald-300 text-emerald-700">
            Reciente
          </Badge>
        ) : null}
      </div>
      <p className="text-xs text-muted-foreground">{event.description}</p>
      <p className="text-xs tabular-nums text-muted-foreground">
        {formatDate(event.date)} · {getCategoryLabel(event.category)}
      </p>
    </div>
  );
}

export function MacroCalendarPanel({ compact = false, limit = 5 }: MacroCalendarPanelProps) {
  const events = compact ? getUpcomingEvents(limit) : getMacroCalendarEvents();

  const upcoming = events.filter((e) => e.status === "upcoming");
  const recent = events.filter((e) => e.status === "recent");

  return (
    <Card className="border-border/60 bg-card/60">
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
        <div>
          <CardTitle className="text-lg">Calendario macro</CardTitle>
          {!compact ? (
            <p className="mt-1 text-sm text-muted-foreground">
              Fechas habituales de publicaciones INDEC y BCRA. Son estimadas; confirmá en
              fuentes oficiales.
            </p>
          ) : null}
        </div>
        {compact ? (
          <Link
            href="/calendario"
            className="shrink-0 text-sm text-primary underline-offset-2 hover:underline"
          >
            Ver todo
          </Link>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {upcoming.length > 0 ? (
          <div>
            {!compact ? (
              <h3 className="mb-1 text-sm font-medium text-foreground">Próximas</h3>
            ) : null}
            {upcoming.slice(0, limit).map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No hay publicaciones próximas en el horizonte.</p>
        )}

        {!compact && recent.length > 0 ? (
          <div>
            <h3 className="mb-1 text-sm font-medium text-foreground">Publicadas recientemente</h3>
            {recent.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

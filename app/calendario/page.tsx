import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { MacroCalendarPanel } from "@/components/macro-calendar-panel";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Calendario macro — INDEC y BCRA",
  description:
    "Próximas publicaciones de inflación, EMAE, REM y otros datos macro argentinos.",
};

export default function CalendarioPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:px-6">
        <Breadcrumbs
          items={[{ label: "Inicio", href: "/" }, { label: "Calendario macro" }]}
        />

        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-bold tracking-tight">Calendario macro</h1>
          <p className="text-muted-foreground">
            Fechas habituales en que el INDEC y el BCRA publican los datos que movemos en el
            dashboard. Son estimaciones basadas en el calendario histórico — el día exacto puede
            variar.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Badge variant="outline" className="border-sky-500/30 text-sky-400">
              INDEC
            </Badge>
            <Badge variant="outline" className="border-violet-500/30 text-violet-400">
              BCRA
            </Badge>
          </div>
        </div>

        <MacroCalendarPanel />

        <p className="text-xs text-muted-foreground">
          Tip: el IPC suele salir la segunda semana del mes con datos del mes anterior. Si
          mañana hay inflación, volvé al dashboard para ver el impacto en el termómetro.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardData } from "@/lib/dashboard-data";
import { buildDailyCover } from "@/lib/daily-cover";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type DailyCoverTeaserProps = {
  data: DashboardData;
};

export function DailyCoverTeaser({ data }: DailyCoverTeaserProps) {
  const cover = buildDailyCover(data);
  const excerpt =
    cover.sections[0]?.paragraphs[0]?.split(". ").slice(0, 2).join(". ") ?? "";

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-card/60">
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-center justify-between">
          <span className="rounded-md border border-primary/30 px-2 py-1 text-xs text-primary">
            Tapa del día
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDate(cover.dateIso)}
          </span>
        </div>
        <p className="text-base font-semibold leading-snug text-foreground/90">
          {cover.title}
        </p>
        {excerpt ? (
          <p className="text-sm leading-relaxed text-muted-foreground">{excerpt}…</p>
        ) : null}
        <div className="pt-1">
          <Link href="/hoy" className={cn(buttonVariants({ size: "sm" }))}>
            Leer la tapa →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}


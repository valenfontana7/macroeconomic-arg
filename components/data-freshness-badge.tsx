import { Badge } from "@/components/ui/badge";
import {
  formatRelativeAge,
  getDataFreshness,
  type FreshnessKind,
} from "@/lib/data-freshness";
import { cn } from "@/lib/utils";

type DataFreshnessBadgeProps = {
  date: string | null;
  kind: FreshnessKind;
  className?: string;
};

export function DataFreshnessBadge({ date, kind, className }: DataFreshnessBadgeProps) {
  const status = getDataFreshness(date, kind);
  if (status === "fresh" || status === "unknown") return null;

  const age = formatRelativeAge(date);

  return (
    <Badge
      variant="outline"
      className={cn(
        "border-amber-300 bg-amber-50 text-[10px] text-amber-800",
        className,
      )}
      title={age ? `Última observación ${age}` : undefined}
    >
      Dato antiguo
    </Badge>
  );
}

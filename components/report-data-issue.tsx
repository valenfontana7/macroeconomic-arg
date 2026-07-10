import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { BRAND_NAME } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function ReportDataIssue() {
  const subject = encodeURIComponent(`[${BRAND_NAME}] Reportar dato incorrecto`);
  const body = encodeURIComponent(
    "Indicador:\nValor mostrado:\nValor esperado / fuente:\nURL de la página:\n\nDescripción del problema:\n",
  );

  return (
    <Link
      href={`mailto:contacto@labrecha.ar?subject=${subject}&body=${body}`}
      className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
    >
      Reportar dato incorrecto
    </Link>
  );
}

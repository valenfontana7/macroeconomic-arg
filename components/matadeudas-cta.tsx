import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MatadeudasCta() {
  return (
    <section className="flex flex-col">
      <Card className="ring-primary/20 bg-primary/5">
        <CardHeader className="pb-1">
          <CardTitle className="text-base leading-snug">
            Tu tarjeta se cura sola todos los meses.
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <p className="text-sm text-muted-foreground">
            Cargá una deuda en Matadeudas y ves cuándo se muere si seguís pagando el mínimo. Gratis,
            sin cuenta, los datos no salen de tu dispositivo.
          </p>
          <Link
            href="https://matadeudas.com.ar/?utm_source=labrecha&utm_medium=web&utm_campaign=deuda_semana"
            className={cn(buttonVariants(), "mt-3 inline-flex")}
          >
            Ver mi deuda →
          </Link>
        </CardContent>
      </Card>
    </section>
  );
}


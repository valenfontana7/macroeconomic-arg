import Link from "next/link";

import { MacroBriefingArticle } from "@/components/macro-briefing-article";
import { PageFaq } from "@/components/page-faq";
import type { MacroBriefing, BriefingScope } from "@/lib/macro-briefing";
import { DOLAR_FAQ, INFLACION_FAQ } from "@/lib/seo";

type HubEditorialPanelProps = {
  briefing: MacroBriefing;
  scope: BriefingScope;
};

const FAQ_BY_SCOPE: Partial<
  Record<BriefingScope, readonly { q: string; a: string }[]>
> = {
  dolar: DOLAR_FAQ,
  inflacion: INFLACION_FAQ,
};

export function HubEditorialPanel({ briefing, scope }: HubEditorialPanelProps) {
  const faq = FAQ_BY_SCOPE[scope];

  return (
    <section className="flex flex-col gap-6 rounded-2xl border border-border/60 bg-card/30 p-5 sm:p-6">
      <MacroBriefingArticle briefing={briefing} compact />

      {faq ? <PageFaq items={faq} /> : null}

      {scope === "home" || scope === "full" ? (
        <p className="text-sm text-muted-foreground">
          Lectura completa del día en{" "}
          <Link href="/pulso" className="text-primary underline-offset-2 hover:underline">
            Pulso macro
          </Link>
          .
        </p>
      ) : null}
    </section>
  );
}

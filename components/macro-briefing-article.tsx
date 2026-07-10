import Link from "next/link";

import type { MacroBriefing } from "@/lib/macro-briefing";
import { formatDate } from "@/lib/format";
import { publisherAttribution } from "@/lib/publisher";

type MacroBriefingArticleProps = {
  briefing: MacroBriefing;
  showAuthor?: boolean;
  compact?: boolean;
};

export function MacroBriefingArticle({
  briefing,
  showAuthor = true,
  compact = false,
}: MacroBriefingArticleProps) {
  return (
    <article className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h2 className={compact ? "font-heading text-xl font-semibold" : "font-heading text-2xl font-bold tracking-tight"}>
          {briefing.title}
        </h2>
        <p className="text-sm text-muted-foreground">
          Actualizado {formatDate(briefing.updatedAt)}
          {showAuthor ? ` · ${publisherAttribution()}` : null}
        </p>
      </header>

      {briefing.sections.map((section) => (
        <section key={section.heading} className="flex flex-col gap-3">
          <h3 className="font-heading text-lg font-semibold">{section.heading}</h3>
          <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}

      {briefing.faq && briefing.faq.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h3 className="font-heading text-lg font-semibold">Preguntas frecuentes</h3>
          <dl className="flex flex-col gap-4 text-sm">
            {briefing.faq.map((item) => (
              <div key={item.q}>
                <dt className="font-medium text-foreground">{item.q}</dt>
                <dd className="mt-1 leading-relaxed text-muted-foreground">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {!compact ? (
        <footer className="rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          Este análisis es informativo y se genera con reglas editoriales fijas sobre datos
          públicos. No constituye asesoramiento financiero.{" "}
          <Link href="/contacto" className="text-primary underline-offset-2 hover:underline">
            Contacto
          </Link>
          {" · "}
          <Link href="/acerca" className="text-primary underline-offset-2 hover:underline">
            Metodología
          </Link>
        </footer>
      ) : null}
    </article>
  );
}

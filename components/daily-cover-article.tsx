import type { DailyCover } from "@/lib/daily-cover";
import { formatDate } from "@/lib/format";

type DailyCoverArticleProps = {
  cover: DailyCover;
};

export function DailyCoverArticle({ cover }: DailyCoverArticleProps) {
  return (
    <article className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {cover.title}
        </h1>
        {cover.dek ? (
          <p className="max-w-[70ch] text-base leading-relaxed text-foreground/80">{cover.dek}</p>
        ) : null}
        <p className="text-sm text-muted-foreground">Actualizado {formatDate(cover.updatedAt)}</p>
      </header>

      {cover.sections.map((section) => (
        <section key={section.heading} className="flex flex-col gap-3">
          <h2 className="font-heading text-xl font-semibold">{section.heading}</h2>
          <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-foreground/85">
            {section.paragraphs.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
          </div>
        </section>
      ))}
    </article>
  );
}


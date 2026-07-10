type FaqItem = {
  q: string;
  a: string;
};

type PageFaqProps = {
  title?: string;
  items: readonly FaqItem[];
};

export function PageFaq({ title = "Preguntas frecuentes", items }: PageFaqProps) {
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/40 p-5">
      <h2 className="font-heading text-lg font-semibold">{title}</h2>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <details
            key={item.q}
            className="group rounded-xl border border-border/60 bg-background/50"
          >
            <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-2">
                {item.q}
                <span className="text-xs text-muted-foreground transition-transform group-open:rotate-180">
                  ▼
                </span>
              </span>
            </summary>
            <div className="border-t border-border/40 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

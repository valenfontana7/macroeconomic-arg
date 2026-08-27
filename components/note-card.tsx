import Link from "next/link";

export type NoteCardProps = {
  kicker: string;
  title: string;
  dek?: string | null;
  href: string;
  className?: string;
  variant?: "card" | "paper";
};

export function NoteCard({
  kicker,
  title,
  dek,
  href,
  className,
  variant = "card",
}: NoteCardProps) {
  const baseWrapper =
    "flex flex-col gap-2" +
    (variant === "card" ? " border border-border/60 bg-card/40 p-4" : " p-0 bg-transparent");

  return (
    <article className={[baseWrapper, className].filter(Boolean).join(" ")}>
      <span className="text-[11px] font-semibold uppercase tracking-wide text-foreground/70">
        {kicker}
      </span>
      <h3 className="font-heading text-lg font-semibold leading-snug">{title}</h3>
      {dek ? (
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{dek}</p>
      ) : null}
      <div className="pt-1">
        <Link
          href={href}
          className="inline-flex text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          Leer →
        </Link>
      </div>
    </article>
  );
}


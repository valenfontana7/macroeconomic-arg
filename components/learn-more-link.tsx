import Link from "next/link";

type LearnMoreLinkProps = {
  slug: string;
  className?: string;
};

export function LearnMoreLink({ slug, className }: LearnMoreLinkProps) {
  return (
    <Link
      href={`/aprende/${slug}`}
      className={
        className ??
        "text-xs text-primary underline-offset-2 hover:underline"
      }
    >
      Aprendé más →
    </Link>
  );
}

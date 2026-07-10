import { ExternalLink } from "lucide-react";

type SourceLinkProps = {
  href: string;
  label?: string;
  className?: string;
};

export function SourceLink({ href, label = "Ver fuente", className }: SourceLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className ?? "inline-flex items-center gap-1 text-primary underline-offset-2 hover:underline"}
    >
      {label}
      <ExternalLink className="size-3" aria-hidden />
    </a>
  );
}

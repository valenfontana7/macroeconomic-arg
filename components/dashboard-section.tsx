import { cn } from "@/lib/utils";

type DashboardSectionProps = {
  id?: string;
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
};

export function DashboardSection({
  id,
  title,
  description,
  className,
  children,
}: DashboardSectionProps) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-24 flex flex-col gap-6", className)}
    >
      {title ? (
        <header className="flex max-w-3xl flex-col gap-2">
          <h2 className="font-heading text-xl font-semibold tracking-tight">{title}</h2>
          {description ? (
            <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
          ) : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}

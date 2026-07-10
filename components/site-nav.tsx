"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type SiteNavProps = {
  links: readonly { href: string; label: string }[];
  className?: string;
};

export function SiteNav({ links, className }: SiteNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("hidden items-center gap-5 text-sm font-medium md:flex", className)}>
      {links.map((link) => {
        const active =
          link.href === "/"
            ? pathname === "/"
            : pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "transition-colors hover:text-primary",
              active ? "text-primary" : "text-foreground/80",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

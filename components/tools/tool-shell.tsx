import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { ToolDefinition } from "@/lib/tools/types";

type ToolShellProps = {
  tool: ToolDefinition;
  children: React.ReactNode;
};

export function ToolShell({ tool, children }: ToolShellProps) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-3">
        <Link
          href="/herramientas"
          className="text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          ← Todas las herramientas
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-2xl" aria-hidden>
            {tool.emoji}
          </span>
          <h1 className="font-heading text-3xl font-bold tracking-tight">{tool.title}</h1>
          <Badge variant="outline">{tool.tagline}</Badge>
        </div>
        <p className="text-muted-foreground">{tool.description}</p>
      </div>
      {children}
    </div>
  );
}

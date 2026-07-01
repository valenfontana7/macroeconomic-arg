import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type WeeklyDigestProps = {
  lines: string[];
};

export function WeeklyDigest({ lines }: WeeklyDigestProps) {
  return (
    <Card className="border-border/60 bg-card/60">
      <CardHeader>
        <CardTitle>En criollo</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
        <Link
          href="/digest"
          className="text-xs text-primary underline-offset-2 hover:underline"
        >
          Recibirlo por email →
        </Link>
      </CardContent>
    </Card>
  );
}

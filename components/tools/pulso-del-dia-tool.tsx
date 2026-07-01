"use client";

import { useCallback, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BRAND_NAME } from "@/lib/brand";
import { MOOD_EMOJI, MOOD_LABELS } from "@/lib/macro-score";
import { scoreToGaugeColor } from "@/lib/thermometer-color";
import type { DailyPulseCard } from "@/lib/tools/types";
import { formatDate } from "@/lib/format";

type PulsoDelDiaToolProps = {
  pulse: DailyPulseCard;
};

export function PulsoDelDiaTool({ pulse }: PulsoDelDiaToolProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const accent = scoreToGaugeColor(pulse.score);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: BRAND_NAME,
          text: pulse.shareText,
        });
        return;
      } catch {
        // usuario canceló
      }
    }
    await navigator.clipboard.writeText(pulse.shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [pulse.shareText]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(pulse.shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [pulse.shareText]);

  const handleDownload = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, 600, 400);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 22px system-ui";
    ctx.fillText(BRAND_NAME, 32, 48);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "14px system-ui";
    ctx.fillText(formatDate(pulse.date), 32, 72);

    ctx.fillStyle = accent;
    ctx.font = "bold 48px system-ui";
    ctx.fillText(String(pulse.score), 32, 140);
    ctx.font = "18px system-ui";
    ctx.fillStyle = "#e2e8f0";
    ctx.fillText(`/ 100 · ${MOOD_EMOJI[pulse.mood]} ${MOOD_LABELS[pulse.mood]}`, 120, 140);

    ctx.font = "16px system-ui";
    ctx.fillStyle = "#cbd5e1";
    let y = 190;
    for (const line of pulse.lines) {
      const wrapped = wrapText(ctx, line, 536);
      for (const row of wrapped) {
        ctx.fillText(row, 32, y);
        y += 24;
      }
    }

    y += 12;
    for (const kn of pulse.keyNumbers) {
      ctx.fillStyle = "#64748b";
      ctx.fillText(`${kn.label}:`, 32, y);
      ctx.fillStyle = "#f1f5f9";
      ctx.fillText(kn.value, 200, y);
      y += 28;
    }

    ctx.fillStyle = "#475569";
    ctx.font = "12px system-ui";
    ctx.fillText(window.location.host, 32, 380);

    const link = document.createElement("a");
    link.download = `la-brecha-${pulse.date.slice(0, 10)}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [pulse, accent]);

  return (
    <div className="flex flex-col gap-6">
      <Card
        ref={cardRef}
        className="border-border/60 bg-gradient-to-br from-card/80 to-card/40"
      >
        <CardHeader>
          <CardTitle className="text-lg">{pulse.headline}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-end gap-3">
            <span className="text-5xl font-bold tabular-nums" style={{ color: accent }}>
              {pulse.score}
            </span>
            <span className="pb-2 text-muted-foreground">/ 100</span>
            <Badge variant="outline" className="mb-2">
              {MOOD_EMOJI[pulse.mood]} {MOOD_LABELS[pulse.mood]}
            </Badge>
          </div>
          <ul className="flex flex-col gap-2 text-sm leading-relaxed text-muted-foreground">
            {pulse.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <div className="grid gap-2 sm:grid-cols-3">
            {pulse.keyNumbers.map((kn) => (
              <div key={kn.label} className="rounded-lg bg-muted/40 px-3 py-2 text-center">
                <p className="text-xs text-muted-foreground">{kn.label}</p>
                <p className="font-semibold tabular-nums">{kn.value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Actualizado {formatDate(pulse.date)}
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={handleShare}>
          Compartir
        </Button>
        <Button type="button" variant="outline" onClick={handleCopy}>
          {copied ? "¡Copiado!" : "Copiar texto"}
        </Button>
        <Button type="button" variant="outline" onClick={handleDownload}>
          Descargar imagen
        </Button>
      </div>
    </div>
  );
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

import { NextResponse } from "next/server";
import { ImageResponse } from "next/og";
import { z } from "zod";

import { BRAND_NAME } from "@/lib/brand";
import { MOOD_LABELS, type MacroMood } from "@/lib/macro-score";
import { OG_SIZE, PulsoOgMarkup, type PulsoOgData } from "@/lib/og-pulso";

const querySchema = z.object({
  score: z.coerce.number().min(0).max(100).optional(),
  mood: z.string().optional(),
  headline: z.string().max(200).optional(),
  inflation: z.string().max(20).optional(),
  brecha: z.string().max(20).optional(),
  date: z.string().max(40).optional(),
});

function parseMood(value: string | undefined): MacroMood {
  const normalized = value?.toLowerCase();
  if (normalized === "tranquilo") return "tranquilo";
  if (normalized === "atento") return "atento";
  if (normalized === "turbulento") return "turbulento";
  if (normalized === "critico" || normalized === "crítico") return "critico";
  return "atento";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse(Object.fromEntries(searchParams.entries()));

  if (!parsed.success) {
    return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
  }

  const p = parsed.data;
  const mood = parseMood(p.mood);

  const data: PulsoOgData = {
    score: p.score ?? 50,
    mood,
    headline: p.headline ?? `${BRAND_NAME}: ${MOOD_LABELS[mood].toLowerCase()}`,
    inflation: p.inflation ?? "—",
    brecha: p.brecha ?? "—",
    date:
      p.date ??
      new Date().toLocaleDateString("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
  };

  return new ImageResponse(<PulsoOgMarkup data={data} />, { ...OG_SIZE });
}

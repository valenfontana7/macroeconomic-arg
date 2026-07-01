import { NextResponse } from "next/server";

import { getForeignQuotes } from "@/lib/dolar-api-client";

export async function GET() {
  try {
    const quotes = await getForeignQuotes();
    return NextResponse.json({ status: 200, results: quotes });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Error al consultar monedas",
      },
      { status: 502 },
    );
  }
}

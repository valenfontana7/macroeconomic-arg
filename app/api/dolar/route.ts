import { NextResponse } from "next/server";

import { getDollarSnapshot } from "@/lib/dolar-api-client";

export async function GET() {
  try {
    const snapshot = await getDollarSnapshot();
    return NextResponse.json({ status: 200, results: snapshot });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Error al consultar DolarAPI",
      },
      { status: 502 },
    );
  }
}

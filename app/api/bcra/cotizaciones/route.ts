import { NextRequest, NextResponse } from "next/server";

import { getCotizaciones } from "@/lib/bcra-client";

export async function GET(request: NextRequest) {
  const fecha = request.nextUrl.searchParams.get("fecha") ?? undefined;

  try {
    const cotizaciones = await getCotizaciones(fecha);
    return NextResponse.json({ status: 200, results: cotizaciones });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Error al consultar el BCRA",
      },
      { status: 502 },
    );
  }
}

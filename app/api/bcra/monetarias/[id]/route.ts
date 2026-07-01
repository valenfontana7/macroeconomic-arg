import { NextRequest, NextResponse } from "next/server";

import { getVariableSeries } from "@/lib/bcra-client";
import { INDICATOR_BY_ID } from "@/lib/indicators";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const idVariable = Number(id);

  if (Number.isNaN(idVariable)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const desde = request.nextUrl.searchParams.get("desde") ?? undefined;
  const hasta = request.nextUrl.searchParams.get("hasta") ?? undefined;
  const indicator = INDICATOR_BY_ID[idVariable];

  try {
    const series = await getVariableSeries(
      idVariable,
      desde,
      hasta,
      indicator?.revalidateSeconds ?? 3600,
    );

    return NextResponse.json({
      status: 200,
      results: [{ idVariable, detalle: series }],
    });
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

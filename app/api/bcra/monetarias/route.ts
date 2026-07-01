import { NextRequest, NextResponse } from "next/server";

import { getVariableMetadata } from "@/lib/bcra-client";

export async function GET(request: NextRequest) {
  const idVariable = request.nextUrl.searchParams.get("IdVariable");

  if (!idVariable) {
    return NextResponse.json(
      { error: "Se requiere el parámetro IdVariable" },
      { status: 400 },
    );
  }

  try {
    const variable = await getVariableMetadata(Number(idVariable));
    if (!variable) {
      return NextResponse.json({ error: "Variable no encontrada" }, { status: 404 });
    }
    return NextResponse.json({ status: 200, results: [variable] });
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

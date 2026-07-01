import { NextResponse } from "next/server";

import { getCountryRisk } from "@/lib/argentinadatos-client";
import { getIndecSnapshot } from "@/lib/datos-gobar-client";

export async function GET() {
  try {
    const [indec, countryRisk] = await Promise.all([
      getIndecSnapshot(),
      getCountryRisk(),
    ]);
    return NextResponse.json({
      status: 200,
      results: { indec, countryRisk },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Error al consultar fuentes INDEC",
      },
      { status: 502 },
    );
  }
}

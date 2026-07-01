import { z } from "zod";

import { isDigestEnabled, subscribeDigestEmail } from "@/lib/digest-email";

const bodySchema = z.object({
  email: z.string().email("Email inválido"),
});

export async function POST(request: Request) {
  if (!isDigestEnabled()) {
    return Response.json(
      {
        error:
          "Digest no disponible. Configurá RESEND_API_KEY y RESEND_FROM_EMAIL en el servidor.",
      },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Datos inválidos" },
      { status: 400 },
    );
  }

  const result = await subscribeDigestEmail(parsed.data.email);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 502 });
  }

  return Response.json({ ok: true });
}

import { brandFaviconImageResponse, isFaviconSize } from "@/lib/brand-favicon";

export const runtime = "edge";

type RouteContext = {
  params: Promise<{ size: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { size: raw } = await context.params;
  const size = Number.parseInt(raw, 10);

  if (!Number.isFinite(size) || !isFaviconSize(size)) {
    return new Response("Not found", { status: 404 });
  }

  return brandFaviconImageResponse(size);
}

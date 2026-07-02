import { brandFaviconImageResponse } from "@/lib/brand-favicon";

export const size = { width: 48, height: 48 };
export const contentType = "image/png";

export default function Icon() {
  return brandFaviconImageResponse(48);
}

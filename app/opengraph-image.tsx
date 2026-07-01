import { ImageResponse } from "next/og";

import { BRAND_OG_DESCRIPTION } from "@/lib/brand";
import { getDashboardData } from "@/lib/dashboard-data";
import { dashboardToOgData, OG_SIZE, PulsoOgMarkup } from "@/lib/og-pulso";

export const alt = BRAND_OG_DESCRIPTION;
export const size = OG_SIZE;
export const contentType = "image/png";
export const revalidate = 3600;

export default async function Image() {
  const data = await getDashboardData();
  const og = dashboardToOgData(data);

  return new ImageResponse(<PulsoOgMarkup data={og} />, { ...OG_SIZE });
}

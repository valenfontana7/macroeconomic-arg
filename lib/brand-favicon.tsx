import { ImageResponse } from "next/og";

import { BRAND_COLORS } from "@/lib/brand";

export const FAVICON_SIZES = [16, 32, 48, 180, 192, 512] as const;

export type FaviconSize = (typeof FAVICON_SIZES)[number];

export function isFaviconSize(value: number): value is FaviconSize {
  return (FAVICON_SIZES as readonly number[]).includes(value);
}

type BrandFaviconProps = {
  size: number;
};

export function BrandFaviconMarkup({ size }: BrandFaviconProps) {
  const radius = Math.max(2, Math.round(size * 0.25));
  const stroke = Math.max(1.5, size * 0.08);
  const svgSize = Math.round(size * 0.85);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: BRAND_COLORS.surface,
        borderRadius: radius,
      }}
    >
      <svg width={svgSize} height={svgSize} viewBox="0 0 32 32" fill="none">
        <path
          d="M6 24 L18 21"
          stroke={BRAND_COLORS.oficial}
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <path
          d="M6 24 L26 10"
          stroke={BRAND_COLORS.paralelo}
          strokeWidth={stroke}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export function brandFaviconImageResponse(size: number) {
  return new ImageResponse(<BrandFaviconMarkup size={size} />, {
    width: size,
    height: size,
  });
}

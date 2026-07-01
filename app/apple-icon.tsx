import { ImageResponse } from "next/og";

import { BRAND_COLORS } from "@/lib/brand";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: BRAND_COLORS.surface,
          borderRadius: 36,
        }}
      >
        <svg width="140" height="140" viewBox="0 0 32 32" fill="none">
          <path
            d="M6 24 L18 21"
            stroke={BRAND_COLORS.oficial}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M6 24 L26 10"
            stroke={BRAND_COLORS.paralelo}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}

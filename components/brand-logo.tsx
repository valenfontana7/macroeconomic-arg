import { BRAND_COLORS } from "@/lib/brand";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  size?: number;
  className?: string;
  showGap?: boolean;
};

/**
 * Dos líneas que divergen: oficial (plana) vs paralelo (más empinada) = la brecha.
 */
export function BrandLogo({ size = 32, className, showGap = true }: BrandLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <rect width="32" height="32" rx="8" fill={BRAND_COLORS.surface} />
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
      {showGap ? (
        <path
          d="M18 21 L26 10"
          stroke={BRAND_COLORS.gap}
          strokeWidth="1.5"
          strokeDasharray="2 2"
          strokeLinecap="round"
          opacity="0.9"
        />
      ) : null}
    </svg>
  );
}

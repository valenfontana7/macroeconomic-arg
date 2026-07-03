"use client";

import { useEffect, useRef } from "react";

import { pushAdUnit, useAdSenseReady } from "@/components/adsense-loader";
import { useAdsConsent } from "@/components/cookie-consent";
import {
  AD_PLACEMENTS,
  getAdSenseClientId,
  getAdSlotId,
  isAdsEnabled,
  type AdPlacement,
} from "@/lib/ads-config";
import { cn } from "@/lib/utils";

type AdSlotProps = {
  placement: AdPlacement;
  className?: string;
};

export function AdSlot({ placement, className }: AdSlotProps) {
  const pushed = useRef(false);
  const consent = useAdsConsent();
  const scriptReady = useAdSenseReady();
  const config = AD_PLACEMENTS[placement];
  const clientId = getAdSenseClientId();
  const slotId = getAdSlotId(placement);
  const enabled = isAdsEnabled() && slotId !== null && consent && scriptReady;

  useEffect(() => {
    pushed.current = false;
  }, [placement, consent]);

  useEffect(() => {
    if (!enabled || pushed.current) return;

    try {
      pushAdUnit();
      pushed.current = true;
    } catch {
      // Script aún no listo
    }
  }, [enabled, placement]);

  if (!consent) return null;

  if (!scriptReady) {
    if (process.env.NODE_ENV === "production") {
      return (
        <div
          className={cn(
            "flex items-center justify-center rounded-xl border border-border/30 bg-card/20",
            config.format === "horizontal" ? "min-h-[90px]" : "min-h-[250px]",
            className,
          )}
          aria-hidden
        />
      );
    }

    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 px-4 py-6 text-center text-xs text-muted-foreground",
          config.format === "horizontal" ? "min-h-[90px]" : "min-h-[250px]",
          className,
        )}
        aria-hidden
      >
        Cargando publicidad…
      </div>
    );
  }

  if (!slotId) {
    if (process.env.NODE_ENV === "production") return null;
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 px-4 py-6 text-center text-xs text-muted-foreground",
          config.format === "horizontal" ? "min-h-[90px]" : "min-h-[250px]",
          className,
        )}
        aria-hidden
      >
        Falta NEXT_PUBLIC_ADSENSE_SLOT_DEFAULT
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex min-h-[90px] justify-center overflow-hidden rounded-xl border border-border/40 bg-card/30",
        config.format === "rectangle" && "min-h-[250px]",
        className,
      )}
    >
      <ins
        className="adsbygoogle block w-full"
        style={{ display: "block" }}
        data-ad-client={clientId!}
        data-ad-slot={slotId}
        data-ad-format={config.format === "horizontal" ? "auto" : "rectangle"}
        data-full-width-responsive="true"
      />
    </div>
  );
}

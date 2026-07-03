"use client";

import { useEffect, useRef } from "react";

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

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

function pushAdUnit() {
  (window.adsbygoogle = window.adsbygoogle || []).push({});
}

export function AdSlot({ placement, className }: AdSlotProps) {
  const pushed = useRef(false);
  const consent = useAdsConsent();
  const config = AD_PLACEMENTS[placement];
  const clientId = getAdSenseClientId();
  const slotId = getAdSlotId(placement);
  const enabled = isAdsEnabled() && slotId !== null && consent;

  useEffect(() => {
    if (!enabled || pushed.current) return;

    const tryPush = () => {
      try {
        pushAdUnit();
        pushed.current = true;
        return true;
      } catch {
        return false;
      }
    };

    if (tryPush()) return;

    const interval = window.setInterval(() => {
      if (tryPush()) window.clearInterval(interval);
    }, 400);

    const timeout = window.setTimeout(() => window.clearInterval(interval), 12_000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [enabled, placement]);

  if (!enabled) {
    if (process.env.NODE_ENV === "production") return null;

    const missingSlot = isAdsEnabled() && slotId === null;

    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 px-4 py-6 text-center text-xs text-muted-foreground",
          config.format === "horizontal" ? "min-h-[90px]" : "min-h-[250px]",
          className,
        )}
        aria-hidden
      >
        Espacio publicitario ({config.label})
        <br />
        <span className="opacity-70">
          {missingSlot
            ? "Configurá NEXT_PUBLIC_ADSENSE_SLOT_DEFAULT en Vercel"
            : !consent
              ? "Aceptá cookies para ver el anuncio de prueba"
              : `Configurá ${config.slotEnvKey}`}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex justify-center overflow-hidden rounded-xl border border-border/40 bg-card/30",
        className,
      )}
    >
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={clientId!}
        data-ad-slot={slotId!}
        data-ad-format={config.format === "horizontal" ? "auto" : "rectangle"}
        data-full-width-responsive="true"
      />
    </div>
  );
}

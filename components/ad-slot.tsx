"use client";

import { useEffect, useRef, useState } from "react";

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

const FILL_CHECK_MS = 6_000;
const MIN_AD_HEIGHT = 40;

function hasFilledAd(ins: HTMLElement): boolean {
  const iframe = ins.querySelector("iframe");
  if (!iframe) return false;
  return ins.getBoundingClientRect().height >= MIN_AD_HEIGHT;
}

export function AdSlot({ placement, className }: AdSlotProps) {
  const insRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);
  const consent = useAdsConsent();
  const scriptReady = useAdSenseReady();
  const config = AD_PLACEMENTS[placement];
  const clientId = getAdSenseClientId();
  const slotId = getAdSlotId(placement);
  const canRender = isAdsEnabled() && slotId !== null && consent && scriptReady;
  const [showSlot, setShowSlot] = useState(true);

  useEffect(() => {
    if (!canRender || !insRef.current || pushedRef.current) return;

    try {
      pushAdUnit();
      pushedRef.current = true;
    } catch {
      return;
    }

    const timer = window.setTimeout(() => {
      if (!insRef.current || !hasFilledAd(insRef.current)) {
        setShowSlot(false);
      }
    }, FILL_CHECK_MS);

    return () => window.clearTimeout(timer);
  }, [canRender, placement]);

  useEffect(() => {
    pushedRef.current = false;
    setShowSlot(true);
  }, [placement, consent]);

  if (!consent || !canRender || !showSlot || !slotId) return null;

  return (
    <div
      className={cn(
        "flex w-full justify-center overflow-hidden",
        className,
      )}
    >
      <ins
        ref={insRef}
        className="adsbygoogle block w-full"
        style={{ display: "block", minHeight: config.format === "rectangle" ? 250 : 90 }}
        data-ad-client={clientId!}
        data-ad-slot={slotId}
        data-ad-format={config.format === "horizontal" ? "auto" : "rectangle"}
        data-full-width-responsive="true"
      />
    </div>
  );
}

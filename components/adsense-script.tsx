"use client";

import Script from "next/script";

import { useAdsConsent } from "@/components/cookie-consent";
import { getAdSenseClientId, isAdsEnabled } from "@/lib/ads-config";

export function AdSenseScript() {
  const consent = useAdsConsent();
  const clientId = getAdSenseClientId();

  if (!isAdsEnabled() || !clientId || !consent) return null;

  return (
    <Script
      id="adsense-loader"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

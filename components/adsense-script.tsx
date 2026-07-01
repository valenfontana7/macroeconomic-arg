import Script from "next/script";

import { getAdSenseClientId, isAdsEnabled } from "@/lib/ads-config";

export function AdSenseScript() {
  const clientId = getAdSenseClientId();
  if (!isAdsEnabled() || !clientId) return null;

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

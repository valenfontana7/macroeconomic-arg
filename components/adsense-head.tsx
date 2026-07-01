import Script from "next/script";

import { getAdSenseClientId } from "@/lib/ads-config";

/**
 * AdSense en <head> vía next/script (evita mismatch de hidratación con <head> manual).
 * Los bloques <ins> en AdSlot solo se renderizan tras consentimiento de cookies.
 */
export function AdSenseHead() {
  const clientId = getAdSenseClientId();
  if (!clientId) return null;

  return (
    <Script
      id="adsense-loader"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="beforeInteractive"
    />
  );
}

import { getAdSenseClientId } from "@/lib/ads-config";

/**
 * Script de AdSense en <head> (requerido por Google para verificación y auto-ads).
 * Los bloques <ins> en AdSlot solo se renderizan tras consentimiento de cookies.
 */
export function AdSenseHead() {
  const clientId = getAdSenseClientId();
  if (!clientId) return null;

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
    />
  );
}

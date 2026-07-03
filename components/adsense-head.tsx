import { getAdSenseClientId } from "@/lib/ads-config";

/**
 * Script idéntico al snippet de AdSense (Auto ads + base para unidades manuales).
 * Server component: aparece en el HTML inicial para verificación de Google.
 */
export function AdSenseHead() {
  const clientId = getAdSenseClientId();
  if (!clientId) return null;

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      suppressHydrationWarning
    />
  );
}

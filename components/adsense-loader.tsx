"use client";

import { useEffect, useState } from "react";

import { useAdsConsent } from "@/components/cookie-consent";
import { getAdSenseClientId } from "@/lib/ads-config";

let loadPromise: Promise<void> | null = null;

function loadAdSenseScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.adsbygoogle) return Promise.resolve();

  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const clientId = getAdSenseClientId();
    if (!clientId) {
      reject(new Error("AdSense client ID missing"));
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[src*="pagead/js/adsbygoogle.js"]',
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("AdSense blocked")), {
        once: true,
      });
      if (window.adsbygoogle) resolve();
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
    script.crossOrigin = "anonymous";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("AdSense blocked"));
    document.head.appendChild(script);
  });

  return loadPromise;
}

/** Carga el script de AdSense solo tras consentimiento de cookies. */
export function AdSenseLoader() {
  const consent = useAdsConsent();

  useEffect(() => {
    if (!consent || !getAdSenseClientId()) return;
    loadAdSenseScript().catch(() => {
      // Bloqueado por Tracking Prevention, uBlock, etc.
    });
  }, [consent]);

  return null;
}

export function useAdSenseReady(): boolean {
  const consent = useAdsConsent();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!consent || !getAdSenseClientId()) {
      setReady(false);
      return;
    }

    if (window.adsbygoogle) {
      setReady(true);
      return;
    }

    loadAdSenseScript()
      .then(() => setReady(true))
      .catch(() => setReady(false));
  }, [consent]);

  return ready;
}

export function pushAdUnit() {
  (window.adsbygoogle = window.adsbygoogle || []).push({});
}

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

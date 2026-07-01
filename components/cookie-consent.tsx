"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  readCookieConsent,
  writeCookieConsent,
  type CookieConsent,
} from "@/lib/cookie-consent";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(readCookieConsent() === null);
  }, []);

  const handleChoice = (value: CookieConsent) => {
    writeCookieConsent(value);
    setVisible(false);
    window.dispatchEvent(new CustomEvent("pulso-cookie-consent", { detail: value }));
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentimiento de cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border/60 bg-card/95 p-4 shadow-lg backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Usamos cookies esenciales y, si aceptás, publicidad de Google AdSense.{" "}
          <Link href="/cookies" className="text-primary underline-offset-2 hover:underline">
            Más info
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => handleChoice("rejected")}>
            Rechazar
          </Button>
          <Button type="button" size="sm" onClick={() => handleChoice("accepted")}>
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  );
}

export function useAdsConsent(): boolean {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const sync = () => setAllowed(readCookieConsent() === "accepted");
    sync();
    window.addEventListener("pulso-cookie-consent", sync);
    return () => window.removeEventListener("pulso-cookie-consent", sync);
  }, []);

  return allowed;
}

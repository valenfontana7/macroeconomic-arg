"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

type DigestSignupProps = {
  enabled: boolean;
};

export function DigestSignup({ enabled }: DigestSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/digest/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "No se pudo completar la suscripción.");
        return;
      }

      setStatus("success");
      setMessage("¡Listo! Te enviamos el resumen de hoy. Revisá tu bandeja de entrada.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Error de red. Intentá de nuevo.");
    }
  };

  if (!enabled) {
    return (
      <p className="rounded-lg border border-dashed border-border/60 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
        El digest por email se activará cuando el sitio configure Resend en producción
        (variables <code className="text-foreground">RESEND_API_KEY</code> y{" "}
        <code className="text-foreground">RESEND_FROM_EMAIL</code>).
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="tu@email.com"
          className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          disabled={status === "loading"}
        />
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Enviando…" : "Recibir resumen de hoy"}
        </Button>
      </div>
      {message ? (
        <p
          className={
            status === "success"
              ? "text-sm text-emerald-400"
              : status === "error"
                ? "text-sm text-red-400"
                : "text-sm text-muted-foreground"
          }
        >
          {message}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Sin spam. Un correo con el resumen del día al suscribirte. Podés pedir la baja
          respondiendo al email.
        </p>
      )}
    </form>
  );
}

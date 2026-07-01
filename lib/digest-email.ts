import { BRAND_NAME } from "@/lib/brand";
import type { DashboardData } from "@/lib/dashboard-data";
import { formatDate } from "@/lib/format";
import { MOOD_EMOJI, MOOD_LABELS } from "@/lib/macro-score";
import { getSiteUrl } from "@/lib/site-url";

export type DigestContent = {
  subject: string;
  text: string;
  html: string;
};

export function buildDigestContent(data: DashboardData): DigestContent {
  const { macroScore, digest, dollar, indec, indicators } = data;
  const inflation = indicators.find((i) => i.slug === "inflacion");
  const inflationLabel =
    indec?.ipcMonthly != null
      ? `${indec.ipcMonthly.toFixed(1)}%`
      : inflation
        ? `${inflation.latestValue.toFixed(1)}%`
        : "—";
  const brecha =
    dollar?.brechaCclPct != null ? `${dollar.brechaCclPct.toFixed(1)}%` : "—";
  const dateLabel = formatDate(data.fetchedAt);
  const siteUrl = getSiteUrl();

  const subject = `${BRAND_NAME} — ${MOOD_LABELS[macroScore.mood]} (${macroScore.score}/100)`;

  const textLines = [
    `${BRAND_NAME} · ${dateLabel}`,
    "",
    `${MOOD_EMOJI[macroScore.mood]} Termómetro: ${macroScore.score}/100 — ${MOOD_LABELS[macroScore.mood]}`,
    ...digest,
    "",
    `Inflación: ${inflationLabel} · Brecha CCL: ${brecha}`,
    "",
    siteUrl,
    "",
    "Para dejar de recibir estos correos, respondé a este email con 'baja'.",
  ];

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 560px; color: #0f172a; line-height: 1.5;">
      <p style="color: #64748b; font-size: 14px;">${BRAND_NAME} · ${dateLabel}</p>
      <h1 style="font-size: 22px; margin: 16px 0 8px;">
        ${MOOD_EMOJI[macroScore.mood]} ${macroScore.score}/100 — ${MOOD_LABELS[macroScore.mood]}
      </h1>
      ${digest.map((line) => `<p style="margin: 8px 0; color: #334155;">${escapeHtml(line)}</p>`).join("")}
      <p style="margin-top: 16px; font-size: 14px; color: #475569;">
        Inflación: <strong>${inflationLabel}</strong> · Brecha CCL: <strong>${brecha}</strong>
      </p>
      <p style="margin-top: 24px;">
        <a href="${siteUrl}" style="color: #0284c7;">Ver dashboard completo →</a>
      </p>
      <p style="margin-top: 32px; font-size: 12px; color: #94a3b8;">
        Datos del BCRA, INDEC y mercado. No es asesoramiento financiero.
      </p>
    </div>
  `;

  return { subject, text: textLines.join("\n"), html };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function isDigestEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

export async function subscribeDigestEmail(email: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    return { ok: false, error: "El digest por email aún no está configurado en el servidor." };
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (audienceId) {
    const contactRes = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, unsubscribed: false }),
    });

    if (!contactRes.ok && contactRes.status !== 409) {
      const body = await contactRes.text();
      return { ok: false, error: `No se pudo registrar el contacto: ${body}` };
    }
  }

  const { getDashboardData } = await import("@/lib/dashboard-data");
  const data = await getDashboardData();
  const digest = buildDigestContent(data);

  const sendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: email,
      subject: digest.subject,
      text: digest.text,
      html: digest.html,
    }),
  });

  if (!sendRes.ok) {
    const body = await sendRes.text();
    return { ok: false, error: `No se pudo enviar el correo: ${body}` };
  }

  return { ok: true };
}

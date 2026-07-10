"use client";

import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { BRAND_NAME, brandCitation } from "@/lib/brand";

type CopyBlockProps = {
  label: string;
  value: string;
};

function CopyBlock({ label, value }: CopyBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [value]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">{label}</span>
        <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
          {copied ? "¡Copiado!" : "Copiar"}
        </Button>
      </div>
      <pre className="overflow-x-auto rounded-lg border border-border/60 bg-muted/30 p-3 text-xs leading-relaxed text-muted-foreground">
        {value}
      </pre>
    </div>
  );
}

type CiteBlocksProps = {
  siteUrl: string;
};

export function CiteBlocks({ siteUrl }: CiteBlocksProps) {
  const citation = brandCitation(siteUrl);
  const markdownLink = `[${BRAND_NAME}](${siteUrl}) — dólar, inflación e indicadores de Argentina`;
  const embedThermometer = `<iframe src="${siteUrl}/embed/termometro" width="320" height="220" style="border:0;border-radius:12px" title="${BRAND_NAME} — termómetro macro" loading="lazy"></iframe>`;
  const embedBrecha = `<iframe src="${siteUrl}/embed/brecha" width="280" height="160" style="border:0;border-radius:12px" title="${BRAND_NAME} — brecha CCL" loading="lazy"></iframe>`;
  const embedDollar = `<iframe src="${siteUrl}/embed/dollar" width="320" height="200" style="border:0;border-radius:12px" title="${BRAND_NAME} — dólar hoy" loading="lazy"></iframe>`;

  return (
    <div className="flex flex-col gap-6">
      <CopyBlock label="Cita bibliográfica / periodística" value={citation} />
      <CopyBlock label="Enlace Markdown" value={markdownLink} />
      <CopyBlock label="Insertar termómetro (iframe)" value={embedThermometer} />
      <CopyBlock label="Insertar brecha CCL (iframe)" value={embedBrecha} />
      <CopyBlock label="Insertar panel dólar (iframe)" value={embedDollar} />
    </div>
  );
}

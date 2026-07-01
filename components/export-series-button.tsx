"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { downloadCsv, seriesToCsv } from "@/lib/csv-export";
import type { BcraDataPoint } from "@/types/bcra";

type ExportSeriesButtonProps = {
  series: BcraDataPoint[];
  filename: string;
  valueLabel: string;
};

export function ExportSeriesButton({ series, filename, valueLabel }: ExportSeriesButtonProps) {
  const handleExport = () => {
    if (series.length === 0) return;
    const csv = seriesToCsv(series, valueLabel);
    downloadCsv(filename, csv);
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={series.length === 0}
    >
      <Download className="size-4" aria-hidden />
      Exportar CSV
    </Button>
  );
}

import type { BcraDataPoint } from "@/types/bcra";

export function seriesToCsv(series: BcraDataPoint[], valueLabel: string): string {
  const header = `fecha,${escapeCsvField(valueLabel)}`;
  const rows = series.map((point) => `${point.fecha},${point.valor}`);
  return [header, ...rows].join("\n");
}

function escapeCsvField(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

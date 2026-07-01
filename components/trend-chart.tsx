"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNumber, formatShortDate } from "@/lib/format";
import { sliceSeriesByDays } from "@/lib/series-utils";
import type { BcraDataPoint } from "@/types/bcra";

export type TrendChartFormat = "currency" | "percent" | "number" | "index";

type TrendChartProps = {
  title: string;
  subtitle?: string;
  series: BcraDataPoint[];
  format?: TrendChartFormat;
  color?: string;
};

const PERIODS = [
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
  { label: "1a", days: 365 },
] as const;

function formatChartValue(value: number, format: TrendChartFormat): string {
  switch (format) {
    case "currency":
      return `$ ${formatNumber(value, 2)}`;
    case "percent":
      return `${formatNumber(value, 1)}%`;
    case "index":
      return formatNumber(value, 2);
    case "number":
    default:
      return formatNumber(value, 0);
  }
}

export function TrendChart({
  title,
  subtitle,
  series,
  format = "number",
  color = "var(--color-chart-2)",
}: TrendChartProps) {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]["label"]>("90d");

  const chartData = useMemo(() => {
    const days = PERIODS.find((item) => item.label === period)?.days ?? 90;
    return sliceSeriesByDays(series, days).map((point) => ({
      fecha: point.fecha,
      valor: point.valor,
      label: formatShortDate(point.fecha),
    }));
  }, [period, series]);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/60 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {subtitle ? (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        <Tabs
          value={period}
          onValueChange={(value) =>
            setPeriod(value as (typeof PERIODS)[number]["label"])
          }
        >
          <TabsList>
            {PERIODS.map((item) => (
              <TabsTrigger key={item.label} value={item.label}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="h-64 w-full">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Sin datos para este período
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11 }}
                minTickGap={24}
                className="text-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                width={72}
                tickFormatter={(value: number) => formatChartValue(value, format)}
                className="text-muted-foreground"
              />
              <RechartsTooltip
                formatter={(value) => formatChartValue(Number(value), format)}
                labelFormatter={(_, payload) => {
                  const item = payload?.[0]?.payload as { fecha?: string } | undefined;
                  return item?.fecha ? formatShortDate(item.fecha) : "";
                }}
                contentStyle={{
                  background: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="valor"
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

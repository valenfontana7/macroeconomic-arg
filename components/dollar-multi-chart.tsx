"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BRAND_COLORS } from "@/lib/brand";
import { formatNumber, formatShortDate } from "@/lib/format";
import type { BcraDataPoint } from "@/types/bcra";

type DollarMultiChartProps = {
  oficial: BcraDataPoint[];
  blue: BcraDataPoint[];
  bolsa: BcraDataPoint[];
  ccl: BcraDataPoint[];
};

const PERIODS = [
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
  { label: "1a", days: 365 },
] as const;

const LINES = [
  { key: "oficial", label: "Oficial", color: BRAND_COLORS.oficial },
  { key: "blue", label: "Blue", color: BRAND_COLORS.paraleloAlt },
  { key: "bolsa", label: "MEP", color: "#7c3aed" },
  { key: "ccl", label: "CCL", color: BRAND_COLORS.paralelo },
] as const;

function sliceByDays(series: BcraDataPoint[], days: number): BcraDataPoint[] {
  if (series.length <= days) return series;
  return series.slice(-days);
}

function mergeSeries(
  oficial: BcraDataPoint[],
  blue: BcraDataPoint[],
  bolsa: BcraDataPoint[],
  ccl: BcraDataPoint[],
) {
  const dates = new Set<string>();
  for (const s of [oficial, blue, bolsa, ccl]) {
    for (const p of s) dates.add(p.fecha);
  }

  const oficialMap = new Map(oficial.map((p) => [p.fecha, p.valor]));
  const blueMap = new Map(blue.map((p) => [p.fecha, p.valor]));
  const bolsaMap = new Map(bolsa.map((p) => [p.fecha, p.valor]));
  const cclMap = new Map(ccl.map((p) => [p.fecha, p.valor]));

  return [...dates]
    .sort()
    .map((fecha) => ({
      fecha,
      oficial: oficialMap.get(fecha) ?? null,
      blue: blueMap.get(fecha) ?? null,
      bolsa: bolsaMap.get(fecha) ?? null,
      ccl: cclMap.get(fecha) ?? null,
    }));
}

export function DollarMultiChart({ oficial, blue, bolsa, ccl }: DollarMultiChartProps) {
  const [days, setDays] = useState<(typeof PERIODS)[number]["days"]>(90);

  const data = useMemo(() => {
    return mergeSeries(
      sliceByDays(oficial, days),
      sliceByDays(blue, days),
      sliceByDays(bolsa, days),
      sliceByDays(ccl, days),
    );
  }, [oficial, blue, bolsa, ccl, days]);

  return (
    <div className="flex flex-col gap-3">
      <Tabs
        value={String(days)}
        onValueChange={(v) => setDays(Number(v) as (typeof PERIODS)[number]["days"])}
      >
        <TabsList>
          {PERIODS.map((p) => (
            <TabsTrigger key={p.days} value={String(p.days)}>
              {p.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
            <XAxis
              dataKey="fecha"
              tickFormatter={(v) => formatShortDate(String(v))}
              tick={{ fontSize: 10 }}
            />
            <YAxis
              tickFormatter={(v) => `$${formatNumber(Number(v), 0)}`}
              tick={{ fontSize: 10 }}
              width={70}
            />
            <Tooltip
              formatter={(value) => `$ ${formatNumber(Number(value), 2)}`}
              labelFormatter={(label) => formatShortDate(String(label))}
            />
            <Legend />
            {LINES.map((line) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                name={line.label}
                stroke={line.color}
                dot={false}
                strokeWidth={2}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { MOOD_LABELS } from "@/lib/macro-score";
import { scoreToGaugeColor } from "@/lib/thermometer-color";
import type { ThermometerHistoryPoint } from "@/lib/thermometer-history";
import { formatShortDate } from "@/lib/format";

type ThermometerHistoryChartProps = {
  history: ThermometerHistoryPoint[];
  compact?: boolean;
};

export function ThermometerHistoryChart({ history, compact = false }: ThermometerHistoryChartProps) {
  if (history.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay datos suficientes para mostrar el histórico del termómetro.
      </p>
    );
  }

  const latest = history.at(-1)!;
  const oldest = history[0]!;
  const delta = latest.score - oldest.score;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs leading-relaxed text-muted-foreground">
        El histórico no incluye riesgo país (EMBI): no hay serie histórica integrada en
        este cálculo. El score actual sí lo incorpora cuando hay dato disponible.
      </p>
      {!compact ? (
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            Evolución del score macro (muestreo semanal, últimos 90 días)
          </p>
          <p className="text-sm tabular-nums">
            <span style={{ color: scoreToGaugeColor(latest.score) }} className="font-semibold">
              {latest.score}
            </span>
            <span className="text-muted-foreground">
              {" "}
              hoy · {delta >= 0 ? "+" : ""}
              {delta} vs hace 90d
            </span>
          </p>
        </div>
      ) : null}

      <div className={compact ? "h-40 w-full" : "h-56 w-full"}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
            <XAxis
              dataKey="fecha"
              tickFormatter={(v) => formatShortDate(String(v))}
              tick={{ fontSize: 10 }}
            />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} width={32} />
            <Tooltip
              formatter={(value) => [`${value}/100`, "Score"]}
              labelFormatter={(label) => formatShortDate(String(label))}
              content={({ active, payload, label }) => {
                if (!active || !payload?.[0]) return null;
                const point = payload[0].payload as ThermometerHistoryPoint;
                return (
                  <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-md">
                    <p className="font-medium">{formatShortDate(String(label))}</p>
                    <p className="tabular-nums" style={{ color: scoreToGaugeColor(point.score) }}>
                      {point.score}/100 — {MOOD_LABELS[point.mood]}
                    </p>
                  </div>
                );
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="var(--color-chart-1)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatNumber } from "@/lib/format";
import { computeSalaryErosion } from "@/lib/tools/calculations";

type SalaryInflationToolProps = {
  ipcMonthlySeries: { fecha: string; valor: number }[];
};

export function SalaryInflationTool({ ipcMonthlySeries }: SalaryInflationToolProps) {
  const [salary, setSalary] = useState(500000);
  const [months, setMonths] = useState(12);

  const erosion = useMemo(
    () => computeSalaryErosion(salary, ipcMonthlySeries, months),
    [salary, ipcMonthlySeries, months],
  );

  const latest = erosion.at(-1);
  const lossPct =
    latest !== undefined ? ((salary - latest.real) / salary) * 100 : 0;

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-border/60 bg-card/60">
        <CardHeader>
          <CardTitle className="text-base">Tu sueldo de referencia</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm">
            Sueldo en pesos (sin cambios nominales)
            <input
              type="number"
              min={1}
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value) || 0)}
              className="rounded-md border border-border/60 bg-background px-3 py-2 font-mono"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            Meses hacia atrás: {months}
            <input
              type="range"
              min={3}
              max={24}
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="w-full"
            />
          </label>
        </CardContent>
      </Card>

      {latest ? (
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Si tu sueldo nominal no subió en {months} meses:
            </p>
            <p className="mt-2 text-2xl font-bold text-red-400">
              Hoy compra como ${formatNumber(latest.real, 0)} de antes
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Perdiste ~{lossPct.toFixed(1)}% de poder de compra (IPC INDEC acumulado).
            </p>
          </CardContent>
        </Card>
      ) : null}

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={erosion}>
            <XAxis
              dataKey="fecha"
              tickFormatter={(v) => formatDate(String(v)).slice(0, 5)}
              tick={{ fontSize: 10 }}
            />
            <YAxis tick={{ fontSize: 10 }} width={70} />
            <Tooltip
              formatter={(value) => [
                `$ ${formatNumber(Number(value), 0)}`,
                "Poder de compra",
              ]}
              labelFormatter={(label) => formatDate(String(label))}
            />
            <Area
              type="monotone"
              dataKey="real"
              stroke="#f87171"
              fill="#f87171"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-muted-foreground">
        La línea muestra cuánto vale tu sueldo nominal en &quot;pesos de hoy&quot; mes a mes,
        usando inflación mensual INDEC. No incluye aumentos de sueldo.
      </p>
    </div>
  );
}

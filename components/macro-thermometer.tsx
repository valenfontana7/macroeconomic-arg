import Link from "next/link";

import {
  MOOD_EMOJI,
  MOOD_LABELS,
  type MacroScoreResult,
} from "@/lib/macro-score";
import { scoreToArcPoint, scoreToGaugeColor } from "@/lib/thermometer-color";

type MacroThermometerProps = {
  score: MacroScoreResult;
};

const GAUGE = {
  centerX: 110,
  centerY: 108,
  radius: 82,
  strokeWidth: 12,
} as const;

const ARC_PATH = `M 28 108 A ${GAUGE.radius} ${GAUGE.radius} 0 0 1 192 108`;

const ZONE_LABELS = [
  { label: "Crítico", at: 0 },
  { label: "Turbulento", at: 35 },
  { label: "Atento", at: 55 },
  { label: "Tranquilo", at: 75 },
] as const;

export function MacroThermometer({ score }: MacroThermometerProps) {
  const { centerX, centerY, radius, strokeWidth } = GAUGE;
  const circumference = Math.PI * radius;
  const progress = (score.score / 100) * circumference;
  const accentColor = scoreToGaugeColor(score.score);
  const marker = scoreToArcPoint(score.score, centerX, centerY, radius);

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-card/60 p-6">
      <div className="text-center">
        <p className="text-sm font-medium text-muted-foreground">
          Termómetro macro
        </p>
        <p
          className="mt-1 text-2xl font-semibold"
          style={{ color: accentColor }}
        >
          {MOOD_EMOJI[score.mood]} {MOOD_LABELS[score.mood]}
        </p>
        <Link
          href="/aprende/termometro-macro"
          className="mt-1 inline-block text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          ¿Qué significa este score?
        </Link>
      </div>

      <div className="relative w-full max-w-[280px]">
        <svg
          viewBox="0 0 220 132"
          className="w-full"
          role="img"
          aria-label={`Termómetro macro: ${score.score} de 100, ${MOOD_LABELS[score.mood]}`}
        >
          <defs>
            <linearGradient
              id="thermometer-gradient"
              x1="28"
              y1="108"
              x2="192"
              y2="108"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="35%" stopColor="#f97316" />
              <stop offset="55%" stopColor="#fbbf24" />
              <stop offset="75%" stopColor="#84cc16" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>

          {/* Pista base */}
          <path
            d={ARC_PATH}
            fill="none"
            stroke="currentColor"
            className="text-muted-foreground/20"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Progreso con degradado rojo → verde hasta el score */}
          <path
            d={ARC_PATH}
            fill="none"
            stroke="url(#thermometer-gradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${progress} ${circumference}`}
          />

          {/* Marcador */}
          <circle
            cx={marker.x}
            cy={marker.y}
            r={strokeWidth / 2 + 3}
            fill={accentColor}
            stroke="var(--background)"
            strokeWidth={2.5}
          />

          {/* Escala: 0 y 100 en los extremos, 50 arriba del arco */}
          <text
            x={28}
            y={127}
            textAnchor="middle"
            fill="rgb(248 113 113 / 0.9)"
            fontSize={11}
            fontWeight={500}
          >
            0
          </text>
          <text
            x={centerX}
            y={centerY - radius - 11}
            textAnchor="middle"
            fill="rgb(251 191 36 / 0.9)"
            fontSize={11}
            fontWeight={500}
          >
            50
          </text>
          <text
            x={192}
            y={127}
            textAnchor="middle"
            fill="rgb(74 222 128 / 0.9)"
            fontSize={11}
            fontWeight={500}
          >
            100
          </text>

          {/* Score centrado dentro del arco */}
          <text
            x={centerX}
            y={centerY - 10}
            textAnchor="middle"
            fill={accentColor}
            fontSize={36}
            fontWeight={700}
          >
            {score.score}
          </text>
          <text
            x={centerX}
            y={centerY + 14}
            textAnchor="middle"
            fill="var(--muted-foreground)"
            fontSize={11}
          >
            de 100
          </text>
        </svg>
      </div>

      <div className="flex w-full flex-wrap justify-center gap-x-3 gap-y-1.5 text-[10px]">
        {ZONE_LABELS.map((zone) => (
          <span key={zone.label} style={{ color: scoreToGaugeColor(zone.at) }}>
            {zone.label} ≥{zone.at}
          </span>
        ))}
      </div>

      <div className="grid w-full grid-cols-2 gap-2 text-xs sm:grid-cols-4 lg:grid-cols-7">
        {(
          [
            ["Inflación", score.breakdown.inflation],
            ["Reservas", score.breakdown.reserves],
            ["Vol. $", score.breakdown.dollarVolatility],
            ["Base $", score.breakdown.monetaryBase],
            ["BADLAR", score.breakdown.badlarReal],
            ["Brecha", score.breakdown.brecha],
            ["Riesgo", score.breakdown.countryRisk],
          ] as const
        ).map(([label, value]) => (
          <div
            key={label}
            className="rounded-lg bg-muted/40 px-2 py-2 text-center"
          >
            <p className="text-muted-foreground">{label}</p>
            <p
              className="font-semibold tabular-nums"
              style={{ color: scoreToGaugeColor(value) }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

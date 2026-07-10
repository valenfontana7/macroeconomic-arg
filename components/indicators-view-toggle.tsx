"use client";

import { useState } from "react";

import { IndicatorsTable } from "@/components/indicators-table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { FiscalIndicatorSnapshot, IndicatorSnapshot } from "@/lib/dashboard-data";

type IndicatorsViewToggleProps = {
  indicators: IndicatorSnapshot[];
  fiscalIndicators: FiscalIndicatorSnapshot[];
  cards: React.ReactNode;
};

export function IndicatorsViewToggle({
  indicators,
  fiscalIndicators,
  cards,
}: IndicatorsViewToggleProps) {
  const [view, setView] = useState<"cards" | "table">("cards");

  return (
    <div className="flex flex-col gap-6">
      <Tabs value={view} onValueChange={(value) => setView(value === "table" ? "table" : "cards")}>
        <TabsList>
          <TabsTrigger value="cards">Tarjetas</TabsTrigger>
          <TabsTrigger value="table">Tabla</TabsTrigger>
        </TabsList>
      </Tabs>

      {view === "table" ? (
        <IndicatorsTable indicators={indicators} fiscalIndicators={fiscalIndicators} />
      ) : (
        cards
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  loadDashboardViewMode,
  saveDashboardViewMode,
  type DashboardViewMode,
} from "@/lib/dashboard-view-mode";

type DashboardViewModeToggleProps = {
  onChange?: (mode: DashboardViewMode) => void;
};

export function DashboardViewModeToggle({ onChange }: DashboardViewModeToggleProps) {
  const [mode, setMode] = useState<DashboardViewMode>("pulse");

  useEffect(() => {
    setMode(loadDashboardViewMode());
  }, []);

  const handleChange = (value: string) => {
    const next = value === "full" ? "full" : "pulse";
    setMode(next);
    saveDashboardViewMode(next);
    onChange?.(next);
  };

  return (
    <Tabs value={mode} onValueChange={handleChange}>
      <TabsList>
        <TabsTrigger value="pulse">Pulso</TabsTrigger>
        <TabsTrigger value="full">Completo</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

export function useDashboardViewMode(): DashboardViewMode {
  const [mode, setMode] = useState<DashboardViewMode>("pulse");

  useEffect(() => {
    setMode(loadDashboardViewMode());
  }, []);

  return mode;
}

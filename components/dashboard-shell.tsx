"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { DashboardOnboarding } from "@/components/dashboard-onboarding";
import { DashboardSectionNav } from "@/components/dashboard-section-nav";
import { DashboardViewModeToggle } from "@/components/dashboard-view-mode-toggle";
import { PartialErrorsBanner } from "@/components/partial-errors-banner";
import {
  loadDashboardViewMode,
  saveDashboardViewMode,
  type DashboardViewMode,
} from "@/lib/dashboard-view-mode";

type DashboardShellProps = {
  partialErrors: string[];
  children: React.ReactNode;
};

type DashboardModeContextValue = {
  mode: DashboardViewMode;
  switchToFull: () => void;
};

const DashboardModeContext = createContext<DashboardModeContextValue>({
  mode: "pulse",
  switchToFull: () => {},
});

export function useDashboardMode() {
  return useContext(DashboardModeContext);
}

export function DashboardShell({ partialErrors, children }: DashboardShellProps) {
  const [mode, setMode] = useState<DashboardViewMode>("pulse");

  useEffect(() => {
    setMode(loadDashboardViewMode());
  }, []);

  const switchToFull = () => {
    setMode("full");
    saveDashboardViewMode("full");
    requestAnimationFrame(() => {
      document.getElementById("termometro-full")?.scrollIntoView({ behavior: "smooth" });
    });
  };

  return (
    <DashboardModeContext.Provider value={{ mode, switchToFull }}>
      <div
        data-dashboard-mode={mode}
        className="flex flex-col gap-8 data-[dashboard-mode=full]:[&_.pulse-hero-score]:hidden data-[dashboard-mode=full]:[&_[data-section=pulse-only]]:hidden data-[dashboard-mode=pulse]:[&_[data-section=full-only]]:hidden"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <DashboardViewModeToggle onChange={setMode} />
          <p className="text-xs text-muted-foreground">
            {mode === "pulse"
              ? "Vista rápida (~30 s)"
              : "Vista completa con todos los indicadores"}
          </p>
        </div>

        <PartialErrorsBanner errors={partialErrors} />

        {mode === "full" ? <DashboardSectionNav /> : null}

        <DashboardOnboarding />

        {children}
      </div>
    </DashboardModeContext.Provider>
  );
}

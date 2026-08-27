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
  headerControls?: boolean;
  showSectionNav?: boolean;
  initialMode?: DashboardViewMode;
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

export function DashboardShell({
  partialErrors,
  children,
  headerControls = true,
  showSectionNav = true,
  initialMode,
}: DashboardShellProps) {
  const [mode, setMode] = useState<DashboardViewMode>(initialMode ?? "pulse");

  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
      return;
    }
    setMode(loadDashboardViewMode());
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {headerControls ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <DashboardViewModeToggle onChange={setMode} />
            <p className="text-xs text-muted-foreground">
              {mode === "pulse"
                ? "Vista rápida (~30 s)"
                : "Vista completa con todos los indicadores"}
            </p>
          </div>
        ) : null}

        <PartialErrorsBanner errors={partialErrors} />

        {showSectionNav && mode === "full" ? <DashboardSectionNav /> : null}

        {headerControls ? <DashboardOnboarding /> : null}

        {children}
      </div>
    </DashboardModeContext.Provider>
  );
}

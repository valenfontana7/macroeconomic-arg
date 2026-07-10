export type DashboardViewMode = "pulse" | "full";

const STORAGE_KEY = "la-brecha-dashboard-mode";

export function loadDashboardViewMode(): DashboardViewMode {
  if (typeof window === "undefined") return "pulse";
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === "full" ? "full" : "pulse";
  } catch {
    return "pulse";
  }
}

export function saveDashboardViewMode(mode: DashboardViewMode): void {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // ignore quota errors
  }
}

const ONBOARDING_KEY = "la-brecha-onboarding-done";

export function isOnboardingDone(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return localStorage.getItem(ONBOARDING_KEY) === "1";
  } catch {
    return true;
  }
}

export function markOnboardingDone(): void {
  try {
    localStorage.setItem(ONBOARDING_KEY, "1");
  } catch {
    // ignore
  }
}

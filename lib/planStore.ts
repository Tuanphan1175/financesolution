
export type PlanProgress = {
  key: string; // e.g. "actions7d"
  checked: Record<string, boolean>;
  updatedAt: string;
};

export type PlaybookState = {
    monthlyIncome: number;
    essentialCost: number;
    emergencyFund: number;
    debtPay: number;
    hasDebtHigh: boolean;
    customJars: Record<string, number> | null;
    updatedAt: string;
}

const LS_PROGRESS_KEY = "smartfinance_plan_progress_v1";
const LS_PLAYBOOK_KEY = "smartfinance_playbook_v1";

// --- Plan Progress (Checklist) ---

export function loadPlanProgress(): PlanProgress {
  try {
    const raw = localStorage.getItem(LS_PROGRESS_KEY);
    if (!raw) return { key: "actions7d", checked: {}, updatedAt: new Date().toISOString() };
    return JSON.parse(raw);
  } catch {
    return { key: "actions7d", checked: {}, updatedAt: new Date().toISOString() };
  }
}

export function savePlanProgress(p: PlanProgress) {
  localStorage.setItem(LS_PROGRESS_KEY, JSON.stringify({ ...p, updatedAt: new Date().toISOString() }));
}

// --- Playbook Scenario (Inputs & Allocation) ---

export function loadPlaybookState(): PlaybookState | null {
    try {
        const raw = localStorage.getItem(LS_PLAYBOOK_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function savePlaybookState(state: PlaybookState) {
    localStorage.setItem(LS_PLAYBOOK_KEY, JSON.stringify(state));
}

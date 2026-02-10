// types.ts

// =========================
// ENUM TYPES
// =========================
export type TransactionType = "income" | "expense";
export type PaymentMethod = "cash" | "credit_card" | "bank_transfer";
export type AccountType = "personal" | "business";
export type SpendingClassification = "need" | "want";

/**
 * Sidebar + App keys
 */
export type View =
  | "dashboard"
  | "transactions"
  | "budgets"
  | "reports"
  | "journey"
  | "rules"
  | "income-ladder"
  | "net-worth"
  | "30-day-journey"
  | "ai-coach"
  | "playbook"
  | "category-settings"
  | "upgrade-plan"
  | "pyramid"
  | "portfolio";

// =========================
// CATEGORIES / TRANSACTIONS
// =========================
export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
  defaultClassification?: SpendingClassification;
}

export interface Transaction {
  id: string;
  categoryId: string;
  amount: number;

  // nhiều nơi có thể để trống, nên optional để seed dễ
  description?: string;

  type: TransactionType;

  /** ISO: YYYY-MM-DD */
  date: string;

  paymentMethod?: PaymentMethod;
  accountType?: AccountType;

  /**
   * App đang dùng transaction.classification trong UI.
   * expense: nên có, income: có thể bỏ trống.
   */
  classification?: SpendingClassification;

  isAsset?: boolean;
  isLiability?: boolean;
}

// =========================
// BUDGETS
// =========================
export type BudgetPeriod = "monthly" | "yearly";

export interface Budget {
  id: string;
  categoryId: string;

  /** current app usage */
  amount: number;
  spent: number;

  /** backward compatibility */
  period?: BudgetPeriod;
  limit?: number;

  /** date range compatibility */
  startDate?: string; // ISO
  endDate?: string; // ISO
}

// =========================
// NET WORTH
// =========================
export type AssetType =
  | "cash"
  | "savings"
  | "checking"
  | "investment"
  | "stock"
  | "bond"
  | "crypto"
  | "real_estate"
  | "business"
  | "vehicle"
  | "other";

export interface Asset {
  id: string;
  name: string;

  /** canonical numeric value */
  value: number;

  /**
   * compatibility: some old code used a.amount
   * keep optional to avoid breaking imports
   */
  amount?: number;

  type: AssetType;
  accountType?: AccountType;
  note?: string;
  createdAt?: string;
}

export type LiabilityType =
  | "credit_card"
  | "loan"
  | "mortgage"
  | "personal_loan"
  | "business_loan"
  | "other";

export interface Liability {
  id: string;
  name: string;

  /** canonical numeric amount */
  amount: number;

  /**
   * compatibility: some old code used l.value
   * keep optional
   */
  value?: number;

  type: LiabilityType;
  accountType?: AccountType;
  interestRate?: number;
  dueDate?: string; // ISO
  note?: string;
}

// =========================
// GOLDEN RULES
// =========================
export interface GoldenRule {
  id: string;

  /** use 1 field (name) but allow title for legacy seed/UI */
  name: string;
  title?: string;

  description: string;
  content?: string;

  /**
   * allow multiple flags (legacy toggles)
   * canonical: isCompliant
   */
  isCompliant?: boolean;
  active?: boolean;
  enabled?: boolean;
  isEnabled?: boolean;

  scoreWeight: number;
}

// =========================
// JOURNEY / 30-DAY JOURNEY
// =========================
export type TaskPillar =
  | "expense"
  | "protection"
  | "investment"
  | "income"
  | "mindset";

/**
 * Task item for 30-day journey
 * IMPORTANT: id is required (your error was missing id in constants.ts)
 */
export interface JourneyTask {
  id: string;

  day: number; // 1..30
  week: number; // 1..4

  title: string;
  description: string;

  action: string;
  coachMessage: string;

  pillar: TaskPillar;

  completed?: boolean;
}

export interface JourneyDay {
  id: string; // usually "day-1"...
  day: number;
  tasks: JourneyTask[];
}

export type JourneyProgress =
  | Record<
    number,
    {
      completed: boolean;
      note?: string;
      completedAt?: string;
    }
  >
  | {
    completedTaskIds: string[];
    completedDays?: number[];
    currentDay?: number;
  };

// =========================
// OPTIONAL / UI HELPERS
// =========================
export interface NetWorthItem {
  id: string;
  name: string;
  amount: number;
  type: "asset" | "liability";
  accountType?: AccountType;
}

// types.ts

// =========================
// CORE ENUMS / TYPES
// =========================
export type TransactionType = "income" | "expense";
export type PaymentMethod = "cash" | "credit_card" | "bank_transfer";
export type AccountType = "personal" | "business";
export type SpendingClassification = "need" | "want";

/**
 * ✅ Sidebar + App đang dùng thêm:
 * - 'category-settings'
 * - 'upgrade-plan'
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
  | "upgrade-plan";

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
  description: string;
  type: TransactionType;
  date: string; // ISO: YYYY-MM-DD
  paymentMethod: PaymentMethod;
  accountType: AccountType;

  /**
   * ✅ app đang dùng transaction.classification trong Transactions.tsx
   * Lưu ý: income vẫn có thể giữ field này, nhưng UI thường chỉ dùng cho expense.
   */
  classification: SpendingClassification;

  // optional flags
  isAsset?: boolean;
  isLiability?: boolean;
}

// =========================
// BUDGETS
// =========================
export type BudgetPeriod = "monthly" | "yearly";

/**
 * Hợp nhất 2 phiên bản:
 * - Upstream: amount/spent/startDate/endDate
 * - Stash: amount/spent/period/limit
 */
export interface Budget {
  id: string;
  categoryId: string;

  amount: number;
  spent: number;

  // Upstream style (date range)
  startDate?: string; // ISO: YYYY-MM-DD
  endDate?: string; // ISO: YYYY-MM-DD

  // Stash style (period)
  period?: BudgetPeriod;
  limit?: number; // tương thích ngược / tùy UI dùng
}

// =========================
// NET WORTH
// =========================
/**
 * Hợp nhất AssetType:
 * - Upstream: cash, real_estate, investment, vehicle, other
 * - Stash: thêm savings/checking/stock/bond/crypto/business...
 */
export type AssetType =
  | "cash"
  | "savings"
  | "checking"
  | "investment"
  | "stock"
  | "bond"
  | "crypto"
  | "real_estate"
  | "vehicle"
  | "business"
  | "other";

export interface Asset {
  id: string;
  name: string;
  value: number; // code đang dùng a.value
  type: AssetType;
  accountType: AccountType;
  note?: string;
  createdAt?: string;
}

/**
 * Hợp nhất LiabilityType:
 * - Upstream: credit_card, loan, mortgage, other
 * - Stash: thêm personal_loan, business_loan
 */
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
  amount: number; // code đang dùng l.amount
  type: LiabilityType;
  accountType: AccountType;
  interestRate?: number;
  dueDate?: string;
  note?: string;
}

// =========================
// GOLDEN RULES
// =========================
/**
 * Hợp nhất GoldenRule:
 * - Upstream dùng name/description/isCompliant (bản Bác Sĩ)
 * - Stash có active boolean
 *
 * Quy ước:
 * - isCompliant: trạng thái tuân thủ hiện tại (AI Coach dùng)
 * - active: rule có đang bật theo UI hay không (nếu UI có toggle)
 */
export interface GoldenRule {
  id: string;
  name: string;
  description: string;

  // UI toggle (nếu có)
  active?: boolean;

  // compliance state
  isCompliant?: boolean;

  scoreWeight: number;
}

// =========================
// JOURNEY / 30-DAY JOURNEY
// =========================
export type TaskPillar = "income" | "expense" | "protection" | "investment" | "mindset";

/**
 * Hợp nhất 2 phiên bản JourneyTask:
 * - Upstream: day/week/title/description/action/coachMessage/pillar
 * - Stash: id + optional fields + completed flags
 */
export interface JourneyTask {
  // Stash id
  id?: string;

  // Upstream structure
  day?: number;
  week: number; // 1-4

  title?: string;
  description?: string;

  action?: string;
  coachMessage?: string;

  pillar: TaskPillar;

  // optional status (stash)
  completed?: boolean;
}

/**
 * Ngày trong hành trình (stash)
 */
export interface JourneyDay {
  day: number;
  title?: string;
  tasks: JourneyTask[];
}

/**
 * Hợp nhất JourneyProgress:
 * - Upstream: Record<number, {completed, note, completedAt}>
 * - Stash: { completedTaskIds, completedDays, currentDay }
 *
 * Để không gãy code nào, giữ cả 2 dạng:
 * - progressByDay: map theo ngày
 * - completedTaskIds/currentDay/...: object theo task/day
 */
export type JourneyProgressByDay = Record<
  number,
  {
    completed: boolean;
    note?: string;
    completedAt?: string;
  }
>;

export interface JourneyProgress {
  // Upstream style (map by day)
  progressByDay?: JourneyProgressByDay;

  // Stash style (by task ids / days)
  completedTaskIds?: string[];
  completedDays?: number[];
  currentDay?: number;
}

// =========================
// OPTIONAL / COMPAT HELPERS
// =========================
export interface NetWorthItem {
  id: string;
  name: string;
  amount: number;
  type: "asset" | "liability";
  accountType?: AccountType;
}

// types.ts

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

  isAsset?: boolean;
  isLiability?: boolean;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  spent: number;
  startDate: string; // ISO: YYYY-MM-DD
  endDate: string; // ISO: YYYY-MM-DD
}

export type AssetType = "cash" | "real_estate" | "investment" | "vehicle" | "other";

export interface Asset {
  id: string;
  name: string;
  value: number;
  type: AssetType;
  accountType: AccountType;
}

export type LiabilityType = "credit_card" | "loan" | "mortgage" | "other";

export interface Liability {
  id: string;
  name: string;
  amount: number;
  type: LiabilityType;
  accountType: AccountType;
}

export interface FinancialPyramidLevel {
  level: number;
  name: string;
  description: string;
  criteria: string[];
  isAchieved: boolean;
}

export interface GoldenRule {
  id: string;
  title: string;
  description: string;

  /**
   * ✅ Nếu GoldenRules.tsx đang toggle theo field enabled/isEnabled
   * thì nên thống nhất 1 tên. Ở đây giữ theo bản gốc của Bác Sĩ.
   */
  isCompliant: boolean;

  scoreWeight: number;
}

// ==============================
// 30-Day Journey
// ==============================
export type TaskPillar =
  | "income"
  | "expense"
  | "protection"
  | "investment"
  | "mindset";

export interface JourneyTask {
  day: number;
  week: number; // 1-4
  title: string;
  description: string;
  action: string;
  coachMessage: string;
  pillar: TaskPillar;
}

/**
 * ✅ Dạng map theo ngày:
 * progress[1], progress[2]...
 */
export type JourneyProgress = Record<
  number,
  {
    completed: boolean;
    note?: string;
    completedAt?: string;
  }
>;

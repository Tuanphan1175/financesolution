
export type TransactionType = 'income' | 'expense';
export type PaymentMethod = 'cash' | 'credit_card' | 'bank_transfer';
export type View = 'dashboard' | 'transactions' | 'budgets' | 'reports' | 'journey' | 'rules' | 'income-ladder' | 'net-worth' | '30-day-journey' | 'ai-coach';
export type AccountType = 'personal' | 'business';
export type SpendingClassification = 'need' | 'want';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  categoryId: string;
  amount: number;
  description: string;
  type: TransactionType;
  date: string; // ISO 8601 format: "YYYY-MM-DD"
  paymentMethod: PaymentMethod;
  accountType: AccountType;
  classification: SpendingClassification;
  isAsset?: boolean;
  isLiability?: boolean;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  spent: number;
  startDate: string; // ISO 8601 format: "YYYY-MM-DD"
  endDate: string; // ISO 8601 format: "YYYY-MM-DD"
}

export interface Asset {
  id: string;
  name: string;
  value: number;
  type: 'cash' | 'real_estate' | 'investment' | 'vehicle' | 'other';
}

export interface Liability {
  id: string;
  name: string;
  amount: number;
  type: 'credit_card' | 'loan' | 'mortgage' | 'other';
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
  isCompliant: boolean; // Auto-calculated or user checked
  scoreWeight: number;
}

// 30 Day Journey Types
export interface JourneyTask {
    day: number;
    week: number; // 1-4
    title: string;
    description: string;
    action: string;
    coachMessage: string;
}

export interface JourneyProgress {
    [day: number]: {
        completed: boolean;
        note?: string;
        completedAt?: string;
    }
}

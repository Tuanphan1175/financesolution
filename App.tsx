// App.tsx
import React, { useEffect, useMemo, useState } from "react";

// ✅ Sidebar đang là named export => phải import dạng { Sidebar }
import { Sidebar } from './components/Sidebar';

// ✅ Dashboard đã export default => import default
import { Dashboard } from "./components/Dashboard";

import { Transactions } from "./components/Transactions";
import { Budgets } from "./components/Budgets";
import { Reports } from "./components/Reports";
import { Journey } from "./components/Journey";
import { GoldenRules } from "./components/GoldenRules";
import { IncomeLadder } from "./components/IncomeLadder";
import { NetWorth } from "./components/NetWorth";
import { ThirtyDayJourney } from "./components/ThirtyDayJourney";
import { AICoach } from "./components/AICoach";
import { WealthPlaybookPanel } from "./components/WealthPlaybookPanel";
import { MenuIcon, XIcon, ArrowUpIcon } from "./components/Icons";

import type {
  View,
  AccountType,
  GoldenRule,
  Transaction,
  JourneyProgress,
  Category,
  Budget,
  Asset,
  Liability,
} from "./types";

import {
  ASSETS as INITIAL_ASSETS,
  LIABILITIES as INITIAL_LIABILITIES,
  GOLDEN_RULES_SEED,
  TRANSACTIONS as INITIAL_TRANSACTIONS,
  BUDGETS as INITIAL_BUDGETS,
} from "./constants";

import { calculatePyramidStatus } from "./lib/pyramidLogic";
import { CategorySettings } from "./components/CategorySettings";
import { UpgradePlan } from "./components/UpgradePlan";
import { PricingModal } from "./components/PricingModal";
import { UpgradeButton } from "./components/UpgradeButton";

// ✅ AuthGate (file cùng cấp với App.tsx trong repo root)
import { AuthGate } from "./AuthGate";

// ===============================
// LocalStorage keys (chuẩn hoá 1 nơi)
// ===============================
const LS_KEYS = {
  assets: "smartfinance_assets",
  liabilities: "smartfinance_liabilities",
  transactions: "smartfinance_transactions",
  categories: "smartfinance_categories",
  budgets: "smartfinance_budgets",
  rules: "smartfinance_rules",
  journey: "smartfinance_journey",
  targetLevel: "smartfinance_target_level",
} as const;

// Fallback keys (để MIGRATE dữ liệu cũ nếu trước đây lưu sai)
const LEGACY_KEYS = {
  transactions: ["transactions", "smartfinance_tx", "smartfinance_transaction"],
} as const;

// ===============================
// Helpers: safe JSON + migrate
// ===============================
function safeJsonParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function loadWithMigration<T>(primaryKey: string, legacyKeys: string[], fallback: T): T {
  const primaryRaw = localStorage.getItem(primaryKey);
  if (primaryRaw) return safeJsonParse<T>(primaryRaw, fallback);

  for (const k of legacyKeys) {
    const legacyRaw = localStorage.getItem(k);
    if (legacyRaw) {
      localStorage.setItem(primaryKey, legacyRaw);
      try {
        localStorage.removeItem(k);
      } catch {
        // ignore
      }
      return safeJsonParse<T>(legacyRaw, fallback);
    }
  }

  return fallback;
}

// ===============================
// Default categories
// ===============================
const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Lương", type: "income", icon: "Briefcase", color: "#10b981", defaultClassification: "need" },
  { id: "cat-2", name: "Tạp hóa", type: "expense", icon: "ShoppingCart", color: "#ef4444", defaultClassification: "need" },
  { id: "cat-3", name: "Tiền thuê nhà", type: "expense", icon: "Home", color: "#f97316", defaultClassification: "need" },
  { id: "cat-4", name: "Đi lại", type: "expense", icon: "Bus", color: "#3b82f6", defaultClassification: "need" },
  { id: "cat-5", name: "Giải trí", type: "expense", icon: "Ticket", color: "#8b5cf6", defaultClassification: "want" },
  { id: "cat-6", name: "Làm tự do", type: "income", icon: "Pencil", color: "#14b8a6", defaultClassification: "need" },
  { id: "cat-7", name: "Tiện ích", type: "expense", icon: "LightningBolt", color: "#f59e0b", defaultClassification: "need" },
  { id: "cat-8", name: "Sức khỏe", type: "expense", icon: "Heart", color: "#ec4899", defaultClassification: "need" },
  { id: "cat-9", name: "Kinh doanh", type: "income", icon: "ChartPie", color: "#6366f1", defaultClassification: "need" },
];

const viewTitles: Record<View, string> = {
  dashboard: "Bảng Điều Khiển",
  transactions: "Nhật Ký Giao Dịch",
  budgets: "Quản Lý Ngân Sách",
  reports: "Báo Cáo Tài Chính",
  journey: "Tháp Tài Chính Lead Up",
  rules: "11 Nguyên Tắc Vàng",
  "income-ladder": "7 Cấp Độ Kiếm Tiền",
  "net-worth": "Bảng Cân Đối Tài Sản",
  "30-day-journey": "Hành Trình Tỉnh Thức 30 Ngày",
  "ai-coach": "AI Financial Coach",
  playbook: "Chiến Lược Tài Chính Premium",
  "category-settings": "Quản Lý Danh Mục",
  "upgrade-plan": "Nâng Cấp Gói",
};

// ===============================
// PREVIEW BADGE
// ===============================
function getDeployEnv(): "preview" | "production" | "unknown" {
  const env = (import.meta as any)?.env?.VITE_DEPLOY_ENV as string | undefined;

  if (env === "preview") return "preview";
  if (env === "production") return "production";

  if (typeof window !== "undefined") {
    const host = window.location.hostname || "";
    const isLikelyPreview = host.includes("-git-") || host.includes("--");
    if (isLikelyPreview) return "preview";
  }

  return "unknown";
}

const PreviewBadge: React.FC = () => {
  const deployEnv = getDeployEnv();
  if (deployEnv !== "preview") return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 12,
        right: 12,
        zIndex: 9999,
        padding: "8px 10px",
        borderRadius: 10,
        fontSize: 12,
        fontWeight: 800,
        letterSpacing: 0.8,
        background: "rgba(255, 193, 7, 0.92)",
        color: "#111",
        boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
      }}
      title="Bạn đang ở môi trường Preview (không phải Production)."
      aria-label="Preview Mode"
    >
      PREVIEW MODE
    </div>
  );
};

// ===============================
// AppShell
// ===============================
const AppShell: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const [accountFilter, setAccountFilter] = useState<"all" | AccountType>("all");
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  const [assets, setAssets] = useState<Asset[]>(() =>
    safeJsonParse<Asset[]>(localStorage.getItem(LS_KEYS.assets), INITIAL_ASSETS)
  );

  const [liabilities, setLiabilities] = useState<Liability[]>(() =>
    safeJsonParse<Liability[]>(localStorage.getItem(LS_KEYS.liabilities), INITIAL_LIABILITIES)
  );

  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    loadWithMigration<Transaction[]>(
      LS_KEYS.transactions,
      [...(LEGACY_KEYS.transactions ?? [])],
      INITIAL_TRANSACTIONS
    )
  );

  const [categories, setCategories] = useState<Category[]>(() =>
    safeJsonParse<Category[]>(localStorage.getItem(LS_KEYS.categories), DEFAULT_CATEGORIES)
  );

  const [budgets, setBudgets] = useState<Budget[]>(() =>
    safeJsonParse<Budget[]>(localStorage.getItem(LS_KEYS.budgets), INITIAL_BUDGETS)
  );

  const [goldenRules, setGoldenRules] = useState<GoldenRule[]>(() =>
    safeJsonParse<GoldenRule[]>(localStorage.getItem(LS_KEYS.rules), GOLDEN_RULES_SEED)
  );

  const [journeyProgress, setJourneyProgress] = useState<JourneyProgress>(() =>
    safeJsonParse<JourneyProgress>(localStorage.getItem(LS_KEYS.journey), {})
  );

  const [targetLevelId, setTargetLevelId] = useState<number>(() => {
    const raw = localStorage.getItem(LS_KEYS.targetLevel);
    const parsed = raw ? parseInt(raw, 10) : NaN;
    return Number.isFinite(parsed) ? parsed : 2;
  });

  useEffect(() => {
    localStorage.setItem(LS_KEYS.assets, JSON.stringify(assets));
    localStorage.setItem(LS_KEYS.liabilities, JSON.stringify(liabilities));
    localStorage.setItem(LS_KEYS.transactions, JSON.stringify(transactions));
    localStorage.setItem(LS_KEYS.categories, JSON.stringify(categories));
    localStorage.setItem(LS_KEYS.budgets, JSON.stringify(budgets));
    localStorage.setItem(LS_KEYS.rules, JSON.stringify(goldenRules));
    localStorage.setItem(LS_KEYS.journey, JSON.stringify(journeyProgress));
    localStorage.setItem(LS_KEYS.targetLevel, targetLevelId.toString());
  }, [assets, liabilities, transactions, categories, budgets, goldenRules, journeyProgress, targetLevelId]);

  const pyramidStatus = useMemo(() => {
    const filteredTransactions =
      accountFilter === "all" ? transactions : transactions.filter((t) => t.accountType === accountFilter);

    const filteredAssets = accountFilter === "all" ? assets : assets.filter((a) => a.accountType === accountFilter);

    const filteredLiabilities =
      accountFilter === "all" ? liabilities : liabilities.filter((l) => l.accountType === accountFilter);

    return calculatePyramidStatus(filteredTransactions, filteredAssets, filteredLiabilities, goldenRules);
  }, [transactions, assets, liabilities, goldenRules, accountFilter]);

  const handleCompleteDay = (day: number, note?: string) => {
    setJourneyProgress((prev) => ({
      ...prev,
      [day]: { completed: true, completedAt: new Date().toISOString(), note },
    }));
  };

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        // ✅ Dashboard hiện tại chỉ cần transactions + categories
        return <Dashboard transactions={transactions} categories={categories} />;

      case "transactions":
        return (
          <Transactions
            transactions={transactions}
            setTransactions={setTransactions}
            categories={categories}
            onAddCategory={(cat) => setCategories((p) => [...p, cat])}
            onUpdateCategory={(cat) => setCategories((p) => p.map((c) => (c.id === cat.id ? cat : c)))}
          />
        );

      case "budgets":
        return <Budgets categories={categories} transactions={transactions} budgets={budgets} setBudgets={setBudgets} />;

      case "reports":
        return <Reports transactions={transactions} categories={categories} />;

      case "journey":
        return <Journey pyramidStatus={pyramidStatus} />;

      case "rules":
        return (
          <GoldenRules
            rules={goldenRules}
            onToggleRule={(id) =>
              setGoldenRules((p) => p.map((r) => (r.id === id ? { ...r, isCompliant: !r.isCompliant } : r)))
            }
          />
        );

      case "income-ladder":
        return <IncomeLadder />;

      case "net-worth":
        return (
          <NetWorth
            assets={assets}
            setAssets={setAssets}
            liabilities={liabilities}
            setLiabilities={setLiabilities}
            monthlyExpenseAvg={pyramidStatus.metrics.avgExpense}
            accountFilter={accountFilter}
            setAccountFilter={setAccountFilter}
          />
        );

      case "30-day-journey":
        return (
          <ThirtyDayJourney
            progress={journeyProgress}
            onCompleteDay={handleCompleteDay}
            currentLevel={pyramidStatus.currentLevel}
            targetLevelId={targetLevelId}
            onSetTarget={setTargetLevelId}
          />
        );

      case "ai-coach":
        return (
          <AICoach
            transactions={transactions}
            assets={assets}
            liabilities={liabilities}
            journeyProgress={journeyProgress}
            goldenRules={goldenRules}
            setIsPricingModalOpen={setIsPricingModalOpen}
            isPremium={isPremium}
          />
        );

      case "playbook":
        return <WealthPlaybookPanel />;

      case "category-settings":
        return <CategorySettings categories={categories} setCategories={setCategories} />;

      case "upgrade-plan":
        return <UpgradePlan />;

      default:
        return <Dashboard transactions={transactions} categories={categories} />;
    }
  };

  return (
    <div className="flex h-screen bg-luxury-obsidian text-slate-100 font-sans selection:bg-luxury-gold selection:text-black">
      <PreviewBadge />

      <div
        className={`fixed inset-y-0 left-0 z-40 w-96 bg-luxury-obsidian shadow-premium transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-500 md:relative md:translate-x-0 md:flex md:flex-shrink-0 border-r border-slate-800`}
      >
        <Sidebar
          currentView={currentView}
          setCurrentView={(view) => {
            setCurrentView(view);
            setSidebarOpen(false);
          }}
          isPremium={isPremium}
          setIsPremium={setIsPremium}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-6 bg-luxury-obsidian/80 backdrop-blur-md border-b border-slate-800 md:hidden sticky top-0 z-30">
          <h1 className="text-3xl font-extrabold text-luxury-gold tracking-tight uppercase">TÀI CHÍNH THÔNG MINH</h1>
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 text-slate-300 hover:text-luxury-gold transition-all"
          >
            {isSidebarOpen ? <XIcon className="h-8 w-8" /> : <MenuIcon className="h-8 w-8" />}
          </button>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto luxury-gradient scroll-smooth pb-40">
          <div className="container mx-auto px-6 md:px-12 py-12 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {currentView !== "dashboard" && (
                    <button
                      onClick={() => setCurrentView("dashboard")}
                      className="flex items-center gap-2 group mr-4 bg-white/5 hover:bg-luxury-gold px-5 py-2.5 rounded-xl transition-all border border-white/10 hover:border-luxury-gold shadow-luxury"
                    >
                      <ArrowUpIcon className="h-5 w-5 -rotate-90 text-luxury-gold group-hover:text-black" />
                      <span className="text-xs font-black text-white group-hover:text-black uppercase tracking-widest">
                        QUAY LẠI
                      </span>
                    </button>
                  )}
                  <div className="h-px w-10 bg-luxury-gold opacity-60"></div>
                  <div className="text-sm font-black uppercase text-luxury-gold tracking-[0.4em] opacity-90">
                    PREMIUM EXPERIENCE
                  </div>
                </div>

                <h2 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-none italic">
                  {viewTitles[currentView]}
                </h2>
              </div>

              <div className="flex items-center gap-4 bg-slate-900/50 backdrop-blur-md px-8 py-4 rounded-2xl border border-slate-800 shadow-luxury shrink-0">
                <div className="w-3 h-3 rounded-full bg-luxury-gold animate-pulse shadow-[0_0_12px_#C5A059]"></div>
                <span className="text-sm font-black uppercase text-slate-300 tracking-[0.2em] whitespace-nowrap">
                  Lead Up Global • Coach Tuấn Dr
                </span>
              </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">{renderView()}</div>
          </div>
        </main>
      </div>

      <UpgradeButton onClick={() => setIsPricingModalOpen(true)} />
      <PricingModal isOpen={isPricingModalOpen} onClose={() => setIsPricingModalOpen(false)} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthGate>
      <AppShell />
    </AuthGate>
  );
};

export default App;

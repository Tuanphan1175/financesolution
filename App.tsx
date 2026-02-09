import React, { useEffect, useMemo, useState } from "react";
import type { View, Transaction, Category } from "./types";

// ================= ICONS =================
import {
  ChartPieIcon,
  CollectionIcon,
  ClipboardListIcon,
  ClipboardListIcon as ClipboardListIcon2,
  DocumentReportIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  ScaleIcon,
  CalendarIcon,
  SparklesIcon,
  BookOpenIcon,
  PencilIcon,
  RefreshIcon,
} from "./components/Icons";

// ================= LOGOUT =================
import { logout } from "./lib/logout";

// ================= SUPABASE PLAN (NEW) =================
import { loadMyPlan, subscribeAuth } from "./lib/supabaseClient";

// ================= VIEWS (CONTENT PANELS) =================
import Dashboard from "./components/Dashboard";
import { Transactions } from "./components/Transactions";
import { Budgets } from "./components/Budgets";
import { Reports } from "./components/Reports";
import { Journey } from "./components/Journey";
import { GoldenRules } from "./components/GoldenRules";
import { IncomeLadder } from "./components/IncomeLadder";
import { NetWorth } from "./components/NetWorth";
import { ThirtyDayJourney } from "./components/ThirtyDayJourney";
import { AICoach } from "./components/AICoach";
import { CategorySettings } from "./components/CategorySettings";
import { WealthPlaybookPanel } from "./components/WealthPlaybookPanel";
import { UpgradePlan } from "./components/UpgradePlan";

// ================= TYPES =================
interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isPremium: boolean;
  setIsPremium: (isPremium: boolean) => void;
  className?: string;
}

// ================= PREMIUM POPUP CONTENT (NEW) =================
type LockKey = "ai_coach" | "forecast" | "community" | "generic";

const LOCK_CONTENT: Record<
  LockKey,
  { title: string; lines: [string, string, string]; cta: string }
> = {
  ai_coach: {
    title: "AI Coach là tính năng Premium",
    lines: [
      "1) Bạn đang ở gói Free – chỉ để nhận thức dòng tiền.",
      "2) AI Coach giúp nhắc kỷ luật, soi thói quen chi tiêu và điều chỉnh hằng ngày.",
      "3) Nâng cấp để bắt đầu hành trình kỷ luật 90 ngày cùng AI.",
    ],
    cta: "Mở khóa AI Coach",
  },
  forecast: {
    title: "Dự báo dòng tiền là tính năng Premium",
    lines: [
      "1) Gói Free chỉ xem hiện tại – chưa có dự báo tương lai.",
      "2) Dự báo giúp bạn biết trước tháng tới thiếu hay dư để ra quyết định sớm.",
      "3) Nâng cấp để kiểm soát dòng tiền theo kế hoạch 30–90 ngày.",
    ],
    cta: "Mở khóa Dự báo",
  },
  community: {
    title: "Cộng đồng kỷ luật là đặc quyền Premium",
    lines: [
      "1) Một mình rất dễ bỏ cuộc – Free chỉ giúp bạn bắt đầu.",
      "2) Premium có cộng đồng kín: kỷ luật, nhắc nhau làm và theo dõi tiến bộ.",
      "3) Nâng cấp để tham gia kỷ luật 90 ngày và có người đồng hành.",
    ],
    cta: "Tham gia Cộng đồng",
  },
  generic: {
    title: "Tính năng dành cho người cam kết",
    lines: [
      "1) Bạn đang dùng gói Free – chỉ để nhận thức dòng tiền.",
      "2) Tính năng này cần kỷ luật & AI đồng hành.",
      "3) Nâng cấp để bắt đầu hành trình kỷ luật 90 ngày.",
    ],
    cta: "Nâng cấp ngay",
  },
};

// ================= PREMIUM LOCK MODAL (NEW) =================
function PremiumLockModal(props: {
  open: boolean;
  lockKey: LockKey;
  onClose: () => void;
  onUpgrade: () => void;
}) {
  const { open, lockKey, onClose, onUpgrade } = props;
  if (!open) return null;

  const content = LOCK_CONTENT[lockKey] ?? LOCK_CONTENT.generic;

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* overlay */}
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
        aria-label="Đóng"
      />

      {/* modal */}
      <div className="absolute inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center p-4">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/85 backdrop-blur-xl shadow-[0_25px_80px_rgba(0,0,0,0.6)] overflow-hidden">
          <div className="p-6">
            <div className="flex items-start gap-3">
              <div className="h-11 w-11 rounded-2xl bg-white/10 border border-white/10 grid place-items-center">
                <span className="text-lg font-black">🔒</span>
              </div>
              <div className="min-w-0">
                <div className="text-lg font-black text-white">{content.title}</div>
                <div className="mt-1 text-xs text-white/60">
                  Premium không chỉ là tính năng — đó là cam kết kỷ luật.
                </div>
              </div>
            </div>

            {/* 3 dòng nội dung */}
            <div className="mt-4 space-y-2 text-sm text-white/85 leading-relaxed">
              <div>{content.lines[0]}</div>
              <div>{content.lines[1]}</div>
              <div>{content.lines[2]}</div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-white/15 bg-white/5 py-3 text-sm font-semibold text-white/80 hover:bg-white/10"
              >
                Để sau
              </button>

              <button
                type="button"
                onClick={onUpgrade}
                className="rounded-2xl bg-luxury-gold py-3 text-sm font-black text-black hover:opacity-95 active:opacity-90"
              >
                {content.cta}
              </button>
            </div>

            <div className="mt-4 text-xs text-white/55">
              Gợi ý: Nâng cấp xong, hệ thống sẽ mở khóa ngay sau khi xác nhận gói.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= NAV ITEM =================
type NavItemProps = {
  label: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
};

const NavItem: React.FC<NavItemProps> = ({
  label,
  icon,
  isActive = false,
  onClick,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition " +
        (isActive
          ? "bg-slate-800 text-white"
          : "text-slate-300 hover:bg-slate-800/60") +
        " " +
        className
      }
    >
      {icon ? <span className="shrink-0">{icon}</span> : null}
      <span className="truncate">{label}</span>
    </button>
  );
};

// ================= SIDEBAR =================
export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  isPremium,
  setIsPremium,
  className = "",
}) => {
  const [userName, setUserName] = useState("Người dùng");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("smartfinance_username");
    if (stored) setUserName(stored);
  }, []);

  const handleSaveName = () => {
    const name = userName.trim() || "Người dùng";
    setUserName(name);
    localStorage.setItem("smartfinance_username", name);
    setIsEditing(false);
  };

  const navItems = useMemo<{ view: View; label: string; icon: React.ReactNode }[]>(
    () => [
      { view: "dashboard", label: "Bảng điều khiển", icon: <ChartPieIcon className="h-5 w-5" /> },
      { view: "ai-coach", label: "AI Coach", icon: <SparklesIcon className="h-5 w-5" /> },
      { view: "playbook", label: "Chiến lược", icon: <BookOpenIcon className="h-5 w-5" /> },
      { view: "30-day-journey", label: "Hành trình 30 ngày", icon: <CalendarIcon className="h-5 w-5" /> },
      { view: "journey", label: "Tháp tài chính", icon: <TrendingUpIcon className="h-5 w-5" /> },
      { view: "transactions", label: "Giao dịch", icon: <CollectionIcon className="h-5 w-5" /> },
      { view: "budgets", label: "Ngân sách", icon: <ClipboardListIcon className="h-5 w-5" /> },
      { view: "rules", label: "Nguyên tắc vàng", icon: <ShieldCheckIcon className="h-5 w-5" /> },
      { view: "net-worth", label: "Tài sản ròng", icon: <ScaleIcon className="h-5 w-5" /> },
      { view: "income-ladder", label: "Cấp độ kiếm tiền", icon: <CurrencyDollarIcon className="h-5 w-5" /> },
      { view: "reports", label: "Báo cáo", icon: <DocumentReportIcon className="h-5 w-5" /> },
      { view: "category-settings", label: "Quản lý danh mục", icon: <PencilIcon className="h-5 w-5" /> },
      { view: "upgrade-plan", label: "Nâng cấp gói", icon: <SparklesIcon className="h-5 w-5" /> },
    ],
    []
  );

  const membershipLabel = isPremium ? "Elite Member" : "Member";

  return (
    <div
      className={
        "flex flex-col w-full h-screen px-6 py-12 bg-luxury-obsidian overflow-y-auto " +
        className
      }
    >
      {/* LOGO */}
      <div
        className="flex items-center mb-16 px-4 cursor-pointer select-none"
        onClick={() => setCurrentView("dashboard")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setCurrentView("dashboard")}
      >
        <div className="bg-luxury-gold p-3 rounded-[1.4rem] shadow-luxury border border-white/10">
          <CurrencyDollarIcon className="h-8 w-8 text-black" />
        </div>
        <div className="ml-5 min-w-0">
          <h2 className="text-xl font-black text-white tracking-[0.2em] italic truncate">
            TÀI CHÍNH
          </h2>
          <span className="block text-[10px] font-black text-luxury-gold tracking-[0.55em] opacity-80">
            PREMIUM
          </span>
        </div>
      </div>

      {/* MENU */}
      <nav className="flex-1 space-y-1 mb-12">
        <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] mb-6 ml-4">
          Architecture
        </p>

        {navItems.map((item) => (
          <NavItem
            key={item.view}
            label={item.label}
            icon={item.icon}
            isActive={currentView === item.view}
            onClick={() => setCurrentView(item.view)}
          />
        ))}
      </nav>

      {/* FOOTER */}
      <div className="mt-auto shrink-0 pt-8 border-t border-slate-800">
        {import.meta.env.DEV && (
          <button
            onClick={() => setIsPremium(!isPremium)}
            type="button"
            className="w-full flex items-center px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-500 text-slate-500 hover:text-white hover:bg-slate-800/50 mb-4"
          >
            <RefreshIcon className="h-5 w-5 mr-4 text-slate-600" />
            Dev: Toggle VIP ({isPremium ? "ON" : "OFF"})
          </button>
        )}

        <div className="p-4 rounded-[1.8rem] bg-slate-900 border border-slate-800 shadow-inner">
          <div className="flex items-center">
            <div className="relative shrink-0">
              <img
                className="w-14 h-14 rounded-2xl bg-luxury-gold object-cover shadow-luxury border-2 border-black"
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  userName
                )}&background=C5A059&color=000&bold=true&font-size=0.4`}
                alt="User"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-slate-900 rounded-full" />
            </div>

            <div className="ml-5 flex-1 min-w-0">
              {isEditing ? (
                <input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onBlur={handleSaveName}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                  className="w-full text-sm font-black text-white bg-transparent border-b-2 border-luxury-gold focus:outline-none py-1"
                  autoFocus
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="w-full text-left"
                  aria-label="Chỉnh sửa tên hiển thị"
                >
                  <p className="text-[16px] font-black text-white truncate flex items-center mb-2">
                    {userName}
                    <PencilIcon className="h-3 w-3 ml-3 text-slate-500" />
                  </p>
                  <p className="text-[9px] font-black text-luxury-gold uppercase tracking-[0.3em] opacity-60">
                    {membershipLabel}
                  </p>
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 px-1">
            <button
              onClick={logout}
              type="button"
              className="w-full rounded-xl bg-red-500/10 text-red-300 px-4 py-2 text-sm hover:bg-red-500/20 transition"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ================= HELPERS =================
function safeParseArray<T>(raw: string | null, fallback: T[] = []): T[] {
  if (!raw) return fallback;
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? (v as T[]) : fallback;
  } catch {
    return fallback;
  }
}

// ================= APP ROOT =================
export default function App() {
  const [currentView, setCurrentView] = useState<View>("dashboard");

  // ✅ Premium state (driven by Supabase profiles)
  const [isPremium, setIsPremium] = useState(false);
  const [planLoading, setPlanLoading] = useState(true);

  // ✅ Popup lock state (NEW)
  const [lockOpen, setLockOpen] = useState(false);
  const [lockKey, setLockKey] = useState<LockKey>("generic");

  // ✅ App-level states
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // ✅ Load localStorage
  useEffect(() => {
    const cats = safeParseArray<Category>(localStorage.getItem("smartfinance_categories"), []);
    const trans = safeParseArray<Transaction>(localStorage.getItem("smartfinance_transactions"), []);
    setCategories(cats);
    setTransactions(trans);
  }, []);

  // ✅ Persist localStorage
  useEffect(() => {
    localStorage.setItem("smartfinance_categories", JSON.stringify(categories ?? []));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("smartfinance_transactions", JSON.stringify(transactions ?? []));
  }, [transactions]);

  const onAddCategory = (cat: Category) => {
    setCategories((prev) => {
      const base = Array.isArray(prev) ? prev : [];
      if (base.some((c) => c.id === cat.id)) return base;
      return [cat, ...base];
    });
  };

  const onUpdateCategory = (cat: Category) => {
    setCategories((prev) => {
      const base = Array.isArray(prev) ? prev : [];
      return base.map((c) => (c.id === cat.id ? cat : c));
    });
  };

  // ================= PLAN LOAD =================
  async function refreshPlan() {
    try {
      setPlanLoading(true);
      const { isPremium: vip } = await loadMyPlan();
      setIsPremium(vip);
    } catch {
      setIsPremium(false);
    } finally {
      setPlanLoading(false);
    }
  }

  useEffect(() => {
    refreshPlan();
    const unsub = subscribeAuth(() => refreshPlan());
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ================= PREMIUM MAP (NEW) =================
  // Mapping menu view -> popup copy theo tính năng
  const premiumMap = useMemo(
    () =>
      new Map<View, LockKey>([
        ["ai-coach", "ai_coach"],
        // "playbook" em gán vào forecast (dự báo) vì nằm nhóm chiến lược/dòng tiền tương lai
        ["playbook", "forecast"],
        // "30-day-journey" em gán vào community vì đúng tinh thần kỷ luật/đồng hành
        ["30-day-journey", "community"],
      ]),
    []
  );

  const premiumViews = useMemo<View[]>(
    () => Array.from(premiumMap.keys()),
    [premiumMap]
  );

  // ================= NAVIGATE WRAPPER (NEW) =================
  const handleNavigate = (view: View) => {
    if (!planLoading && !isPremium && premiumMap.has(view)) {
      setLockKey(premiumMap.get(view) ?? "generic");
      setLockOpen(true);
      return;
    }
    setCurrentView(view);
  };

  // Fallback guard: nếu user vào trực tiếp premium view bằng cách khác
  useEffect(() => {
    if (!planLoading && !isPremium && premiumViews.includes(currentView)) {
      setCurrentView("upgrade-plan");
    }
  }, [currentView, isPremium, planLoading, premiumViews]);

  const renderPremiumBlocked = () => (
    <div className="space-y-4">
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
        <h2 className="text-xl font-black mb-2 text-white">Tính năng Premium</h2>
        <p className="text-slate-300">
          Tài khoản của bạn đang ở gói <b>Free</b>. Vui lòng nâng cấp để mở khóa tính năng này.
        </p>
      </div>
      <UpgradePlan />
    </div>
  );

  const renderView = () => {
    if (planLoading) {
      return (
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
          <div className="text-white font-black text-lg">Đang kiểm tra gói tài khoản...</div>
          <div className="text-slate-400 mt-1">Vui lòng chờ trong giây lát.</div>
        </div>
      );
    }

    switch (currentView) {
      case "dashboard":
        return <Dashboard transactions={transactions} categories={categories} />;

      case "transactions":
        return (
          <Transactions
            transactions={transactions}
            setTransactions={setTransactions}
            categories={categories}
            onAddCategory={onAddCategory}
            onUpdateCategory={onUpdateCategory}
          />
        );

      case "budgets":
        return <Budgets
          categories={categories}
          transactions={transactions}
        />;

      case "reports":
        return <Reports
          transactions={transactions}
          categories={categories}
        />;

      case "journey":
        return <Journey />;

      case "rules":
        return <GoldenRules />;

      case "income-ladder":
        return <IncomeLadder />;

      case "net-worth":
        return <NetWorth />;

      // ===== Premium gated =====
      case "30-day-journey":
        return isPremium ? (
          <ThirtyDayJourney />
        ) : renderPremiumBlocked();

      case "ai-coach":
        return isPremium ? (
          <AICoach
            transactions={transactions}
            isPremium={isPremium}
          />
        ) : renderPremiumBlocked();

      case "playbook":
        return isPremium ? <WealthPlaybookPanel /> : renderPremiumBlocked();

      case "upgrade-plan":
        return <UpgradePlan />;

      case "category-settings":
        return (
          <CategorySettings
            categories={categories}
            setCategories={setCategories}
          />
        );

      default:
        return <Dashboard transactions={transactions} categories={categories} />;
    }
  };

  return (
    <div className="flex w-screen h-screen bg-luxury-obsidian text-white overflow-hidden">
      {/* PREMIUM POPUP (NEW) */}
      <PremiumLockModal
        open={lockOpen}
        lockKey={lockKey}
        onClose={() => setLockOpen(false)}
        onUpgrade={() => {
          setLockOpen(false);
          setCurrentView("upgrade-plan");
        }}
      />

      {/* SIDEBAR */}
      <aside className="w-[340px] shrink-0">
        <Sidebar
          currentView={currentView}
          setCurrentView={handleNavigate} // ✅ intercept click để hiện popup
          isPremium={isPremium}
          setIsPremium={setIsPremium}
        />
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto p-8">{renderView()}</main>
    </div>
  );
}

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
  MenuIcon,
  XIcon,
} from "./components/Icons";

// ================= LOGOUT =================
import { logout } from "./lib/logout";

// ================= SUPABASE PLAN (NEW) =================
import { supabase, getUserSafe, loadMyPlan, subscribeAuth } from "./lib/supabaseClient";

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
import { SpeedInsights } from "@vercel/speed-insights/react";

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
        "w-full flex items-center gap-4 rounded-2xl px-6 py-4 text-left transition-all duration-500 group relative " +
        (isActive
          ? "bg-gradient-to-r from-luxury-gold to-amber-600 text-black shadow-luxury"
          : "text-slate-400 hover:text-white hover:bg-slate-800/40") +
        " " +
        className
      }
    >
      {icon ? (
        <span className={`shrink-0 transition-transform duration-500 group-hover:scale-110 ${isActive ? 'text-black' : 'text-slate-600 group-hover:text-luxury-gold'}`}>
          {icon}
        </span>
      ) : null}
      <span className="truncate text-[11px] font-black uppercase tracking-[0.2em]">{label}</span>
      {isActive && (
        <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-black/30" />
      )}
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
      { view: "dashboard", label: "Dashboard", icon: <ChartPieIcon className="h-5 w-5" /> },
      { view: "ai-coach", label: "AI Coach", icon: <SparklesIcon className="h-5 w-5" /> },
      { view: "playbook", label: "Chiến lược", icon: <BookOpenIcon className="h-5 w-5" /> },
      { view: "30-day-journey", label: "Hành trình", icon: <CalendarIcon className="h-5 w-5" /> },
      { view: "journey", label: "Tháp tài chính", icon: <TrendingUpIcon className="h-5 w-5" /> },
      { view: "transactions", label: "Giao dịch", icon: <CollectionIcon className="h-5 w-5" /> },
      { view: "budgets", label: "Ngân sách", icon: <ClipboardListIcon className="h-5 w-5" /> },
      { view: "rules", label: "Nguyên tắc", icon: <ShieldCheckIcon className="h-5 w-5" /> },
      { view: "net-worth", label: "Tài sản ròng", icon: <ScaleIcon className="h-5 w-5" /> },
      { view: "income-ladder", label: "Cấp độ $", icon: <CurrencyDollarIcon className="h-5 w-5" /> },
      { view: "reports", label: "Báo cáo", icon: <DocumentReportIcon className="h-5 w-5" /> },
      { view: "category-settings", label: "Danh mục", icon: <PencilIcon className="h-5 w-5" /> },
      { view: "upgrade-plan", label: "Khám phá VIP", icon: <SparklesIcon className="h-5 w-5 text-luxury-gold" /> },
    ],
    []
  );

  const membershipLabel = isPremium ? "Elite Member" : "Standard Member";

  return (
    <div
      className={
        "flex flex-col w-full h-full px-6 py-10 bg-luxury-obsidian overflow-y-auto custom-scrollbar " +
        className
      }
    >
      {/* LOGO */}
      <div
        className="flex items-center mb-12 px-2 cursor-pointer select-none group"
        onClick={() => setCurrentView("dashboard")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setCurrentView("dashboard")}
      >
        <div className="bg-luxury-gold p-3 rounded-[1.4rem] shadow-luxury transition-all duration-700 group-hover:rotate-[360deg] border border-white/20 shrink-0">
          <CurrencyDollarIcon className="h-7 w-7 text-black" />
        </div>
        <div className="ml-5 min-w-0">
          <h2 className="text-xl font-black text-white tracking-[0.2em] italic truncate group-hover:text-luxury-gold transition-colors">
            TÀI CHÍNH
          </h2>
          <span className="block text-[10px] font-black text-luxury-gold tracking-[0.55em] opacity-80">
            PREMIUM
          </span>
        </div>
      </div>

      {/* MENU */}
      <nav className="flex-1 space-y-1 mb-10">
        <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] mb-6 ml-6">
          System Core
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
      <div className="mt-auto shrink-0 pt-8 border-t border-slate-800/50">
        {import.meta.env.DEV && (
          <button
            onClick={() => setIsPremium(!isPremium)}
            type="button"
            className="w-full flex items-center px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-500 text-slate-500 hover:text-white hover:bg-slate-800/50 mb-4"
          >
            <RefreshIcon className="h-5 w-5 mr-4 text-slate-600" />
            Dev: VIP ({isPremium ? "ON" : "OFF"})
          </button>
        )}

        <div className="p-5 rounded-[2rem] bg-slate-900/60 border border-slate-800 shadow-inner group transition-all hover:border-luxury-gold/50">
          <div className="flex items-center">
            <div className="relative shrink-0">
              <img
                className="w-14 h-14 rounded-2xl bg-luxury-gold object-cover shadow-luxury border-2 border-black group-hover:scale-105 transition-transform duration-700"
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  userName
                )}&background=C5A059&color=000&bold=true&font-size=0.4`}
                alt="User"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-slate-900 rounded-full shadow-glow" />
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
                  <p className="text-[17px] font-black text-white truncate flex items-center mb-1 tracking-tight">
                    {userName}
                    <PencilIcon className="h-3 w-3 ml-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                  <p className="text-[9px] font-black text-luxury-gold uppercase tracking-[0.3em] opacity-60">
                    {membershipLabel}
                  </p>
                </button>
              )}
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={logout}
              type="button"
              className="w-full rounded-2xl bg-white/5 text-slate-400 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] hover:bg-rose-500/10 hover:text-rose-400 transition-all border border-white/5 active:scale-95"
            >
              Sign Out
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

    // Subscribe to auth changes (login/logout)
    const unsubAuth = subscribeAuth(() => refreshPlan());

    // ✅ Real-time Profile Listener (NEW)
    // Automatically re-fetch plan when the profile row is updated in Supabase dashboard
    let profileSub: any = null;

    getUserSafe().then(user => {
      if (user) {
        profileSub = supabase
          .channel(`profile-sync-${user.id}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'profiles',
              filter: `id=eq.${user.id}`,
            },
            () => {
              // Row updated -> refresh app-level isPremium
              refreshPlan();
            }
          )
          .subscribe();
      }
    });

    return () => {
      unsubAuth();
      if (profileSub) supabase.removeChannel(profileSub);
    };
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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ================= NAVIGATE WRAPPER (NEW) =================
  const handleNavigate = (view: View) => {
    if (!planLoading && !isPremium && premiumMap.has(view)) {
      setLockKey(premiumMap.get(view) ?? "generic");
      setLockOpen(true);
      return;
    }
    setCurrentView(view);
    setIsSidebarOpen(false); // Đóng sidebar khi chọn view trên mobile
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
        return (
          <Dashboard
            transactions={transactions}
            categories={categories}
            onMenuClick={() => setIsSidebarOpen(true)}
          />
        );

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
        return (
          <Dashboard
            transactions={transactions}
            categories={categories}
            onMenuClick={() => setIsSidebarOpen(true)}
          />
        );
    }
  };

  return (
    <div className="flex w-screen h-screen bg-luxury-obsidian text-white overflow-hidden relative">
      {/* MOBILE HEADER - Hidden on Dashboard because Dashboard has its own header */}
      {currentView !== 'dashboard' && (
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-luxury-obsidian/60 backdrop-blur-xl border-b border-white/5 z-40 flex items-center justify-between px-6">
          <div className="flex items-center group" onClick={() => setCurrentView('dashboard')}>
            <div className="bg-luxury-gold p-2 rounded-lg mr-3 shadow-luxury active:scale-90 transition-transform">
              <CurrencyDollarIcon className="h-5 w-5 text-black" />
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-[0.15em] text-xs text-white leading-none">TÀI CHÍNH</span>
              <span className="text-[8px] font-black text-luxury-gold tracking-[0.3em] mt-1">PREMIUM</span>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2.5 text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all active:scale-95 border border-white/5"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* SIDEBAR OVERLAY (Mobile) */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed lg:relative top-0 left-0 h-full w-[310px] bg-luxury-obsidian z-50 shrink-0
        transition-transform duration-500 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        border-r border-white/5 lg:border-none shadow-2xl lg:shadow-none
      `}>
        <div className="lg:hidden absolute top-6 right-6 z-50">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <Sidebar
          currentView={currentView}
          setCurrentView={handleNavigate}
          isPremium={isPremium}
          setIsPremium={setIsPremium}
        />
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 lg:pt-8 w-full">
        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>

      {/* PREMIUM POPUP */}
      <PremiumLockModal
        open={lockOpen}
        lockKey={lockKey}
        onClose={() => setLockOpen(false)}
        onUpgrade={() => {
          setLockOpen(false);
          setCurrentView("upgrade-plan");
        }}
      />
      <SpeedInsights />
    </div>
  );
}

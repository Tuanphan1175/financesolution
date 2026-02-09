import React, { useMemo } from "react";
import type { Category, Transaction, SpendingClassification } from "../types";
import { ScaleIcon, TrendingUpIcon, HomeIcon, CashIcon, ShoppingCartIcon } from "./Icons";

type DashboardProps = {
  transactions: Transaction[];
  categories: Category[];
};

const formatMoney = (v: number) =>
  (Number.isFinite(v) ? Math.round(v) : 0).toLocaleString("vi-VN");

const formatCompact = (v: number) => {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`;
  return v.toString();
};

const StatCard: React.FC<{
  label: string;
  value: string;
  sub?: string;
  tone?: "neutral" | "good" | "bad";
}> = ({ label, value, sub, tone = "neutral" }) => {
  const toneClass =
    tone === "good"
      ? "text-emerald-500"
      : tone === "bad"
        ? "text-rose-500"
        : "text-slate-800";

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-teal-100 rounded-3xl p-5 shadow-lg">
      <div className="text-[10px] font-black uppercase tracking-[0.22em] text-teal-600">
        {label}
      </div>
      <div className={`mt-2 text-2xl md:text-3xl font-black tracking-tight ${toneClass}`}>
        {value}
      </div>
      {sub && (
        <div className="mt-1 text-[11px] font-bold text-slate-500 tracking-wide">
          {sub}
        </div>
      )}
    </div>
  );
};

const CategoryIconCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  color: string;
  bgColor: string;
}> = ({ icon, label, color, bgColor }) => {
  return (
    <div className="flex flex-col items-center gap-2 min-w-[70px]">
      <div className={`w-14 h-14 rounded-2xl ${bgColor} flex items-center justify-center shadow-md hover:scale-110 transition-transform active:scale-95`}>
        <div className={color}>
          {icon}
        </div>
      </div>
      <span className="text-[10px] font-bold text-slate-700">{label}</span>
    </div>
  );
};

const BudgetRuleCard: React.FC<{
  need: number;
  want: number;
  save: number;
  income: number;
}> = ({ need, want, save, income }) => {
  const hasIncome = income > 0;

  // Calculate percentages
  const calcPct = (value: number) => {
    if (!hasIncome) return 0;
    return Math.round((value / income) * 100);
  };

  const needPct = calcPct(need);
  const wantPct = calcPct(want);
  const savePct = calcPct(save);

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100 relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-200/50 rounded-full blur-3xl"></div>

      <div className="flex justify-between items-center mb-6 relative z-10">
        <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
            <ScaleIcon className="w-5 h-5" />
          </span>
          Quy tắc 50/30/20
        </h3>
        <span className="px-3 py-1 bg-teal-100 text-teal-700 text-[10px] font-black uppercase tracking-widest rounded-full">
          LIVE
        </span>
      </div>

      <div className="flex gap-3 mb-6">
        {/* Visual Bar */}
        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden flex">
          <div style={{ width: `${Math.min(needPct, 100)}%` }} className="bg-purple-500 h-full"></div>
          <div style={{ width: `${Math.min(wantPct, 100)}%` }} className="bg-pink-400 h-full"></div>
          <div style={{ width: `${Math.min(savePct, 100)}%` }} className="bg-teal-400 h-full"></div>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-2xl border border-purple-100">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Nhu cầu (50%)</span>
          </div>
          <span className="font-black text-slate-800">{formatCompact(need)}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-pink-50 rounded-2xl border border-pink-100">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-pink-400"></div>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Mong muốn (30%)</span>
          </div>
          <span className="font-black text-slate-800">{formatCompact(want)}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-teal-50 rounded-2xl border border-teal-100">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-teal-400"></div>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Tiết kiệm (20%)</span>
          </div>
          <span className="font-black text-slate-800">{formatCompact(save)}</span>
        </div>
      </div>
    </div>
  );
};

// Mock Chart Component representing the one in design
const SavingAnalysisChart = () => (
  <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-slate-100 relative overflow-hidden">
    <div className="flex justify-between items-start mb-6">
      <div>
        <h3 className="text-sm font-black text-slate-500 uppercase tracking-wider mb-1">Saving Goal</h3>
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 text-orange-600 px-3 py-1 rounded-lg text-sm font-black">$1 Tr. 850k</div>
          <span className="text-xs font-bold text-emerald-500">+12%</span>
        </div>
      </div>
      <button className="bg-slate-100 p-2 rounded-xl text-slate-400">···</button>
    </div>

    <div className="relative h-48 w-full">
      {/* Placeholder for chart - using CSS gradients to mimic the look */}
      <div className="absolute inset-0 flex items-end justify-between px-2 pb-6">
        {/* Chart Bars/Line simulation */}
        <div className="w-full h-full relative">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.2" /> {/* teal-400 */}
                <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,150 C50,120 100,160 150,80 C200,40 250,100 300,50 L300,200 L0,200 Z" fill="url(#chartGradient)" />
            <path d="M0,150 C50,120 100,160 150,80 C200,40 250,100 300,50" fill="none" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" /> {/* teal-600 */}

            {/* Points */}
            <circle cx="0" cy="150" r="4" fill="white" stroke="#0d9488" strokeWidth="2" />
            <circle cx="150" cy="80" r="4" fill="white" stroke="#0d9488" strokeWidth="2" />
            <circle cx="300" cy="50" r="4" fill="#0d9488" stroke="#ffffff" strokeWidth="2" />
          </svg>

          {/* Floating tags */}
          <div className="absolute top-[20%] right-0 bg-white shadow-md border border-slate-100 px-2 py-1 rounded-lg text-[10px] font-bold text-slate-700">
            $210.00
          </div>
        </div>
      </div>

      {/* Y Axis Labels roughly positioned */}
      <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between text-[9px] font-bold text-slate-300 py-6">
        <span>000.00$</span>
        <span>$50.00</span>
        <span>$100.00</span>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ transactions, categories }) => {
  const safeTransactions = useMemo(() => (Array.isArray(transactions) ? transactions : []), [transactions]);
  const safeCategories = useMemo(() => (Array.isArray(categories) ? categories : []), [categories]);

  const categoryMap = useMemo(() => {
    const m = new Map<string, Category>();
    for (const c of safeCategories) m.set(c.id, c);
    return m;
  }, [safeCategories]);

  const computed = useMemo(() => {
    let income = 0;
    let expenseTotal = 0;
    let need = 0, want = 0, other = 0;

    for (const t of safeTransactions) {
      if (t.type === "income") {
        income += t.amount;
        continue;
      }
      expenseTotal += t.amount;
      const cat = categoryMap.get(t.categoryId);
      const cls = (cat?.defaultClassification ?? null) as SpendingClassification | null;
      if (cls === "need") need += t.amount;
      else if (cls === "want") want += t.amount;
      else other += t.amount;
    }

    const save = Math.max(0, income - expenseTotal);
    const net = income - expenseTotal;

    const recent = [...safeTransactions]
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
      .slice(0, 5)
      .map((t) => ({ ...t, categoryName: categoryMap.get(t.categoryId)?.name ?? "Khác" }));

    return { income, expenseTotal, need, want, other, save, net, recent };
  }, [safeTransactions, categoryMap]);

  return (
    <div className="w-full min-h-screen bg-[#E0F7FA] font-sans pb-24 rounded-[3rem] overflow-hidden">
      {/* 1. Header Section */}
      <div className="pt-8 px-6 pb-6">
        <div className="flex justify-between items-start mb-6">
          <button className="p-2 rounded-full bg-white/50 hover:bg-white transition">
            {/* Back/Menu Icon mimic */}
            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="text-center">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Total Spendings</span>
          </div>
          <button className="p-2 rounded-full bg-white/50 hover:bg-white transition">
            {/* Profile/Settings Icon */}
            <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff" alt="User" />
            </div>
          </button>
        </div>

        {/* Big Number Display */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">
              {formatCompact(computed.expenseTotal)}
            </div>
            <div className="text-sm font-bold text-slate-400 mt-2 ml-1">VNĐ • Month Total</div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
              <TrendingUpIcon className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-center text-slate-500">Report</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button className="flex-1 bg-white py-4 rounded-2xl font-black text-slate-700 shadow-sm border border-slate-100 flex items-center justify-center gap-2 active:scale-95 transition-transform">
            <ScaleIcon className="w-4 h-4" />
            <span>Overview</span>
          </button>
          <button className="flex-1 bg-slate-900 py-4 rounded-2xl font-black text-white shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform">
            <span>Sort by date</span>
          </button>
        </div>
      </div>

      {/* 2. Categories Horizontal Scroll */}
      <div className="pl-6 mb-8 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between pr-6 mb-4">
          <h3 className="font-bold text-slate-800 text-lg">Categories</h3>
          <button className="text-slate-400 text-xs font-bold">See all</button>
        </div>
        <div className="flex gap-4 min-w-max pr-6">
          <CategoryIconCard icon={<HomeIcon className="w-6 h-6" />} label="Nhà Cửa" color="text-rose-500" bgColor="bg-rose-100" />
          <CategoryIconCard icon={<ShoppingCartIcon className="w-6 h-6" />} label="Mua Sắm" color="text-orange-500" bgColor="bg-orange-100" />
          <CategoryIconCard icon={<TrendingUpIcon className="w-6 h-6" />} label="Đầu Tư" color="text-teal-500" bgColor="bg-teal-100" />
          <CategoryIconCard icon={<CashIcon className="w-6 h-6" />} label="Tiết Kiệm" color="text-blue-500" bgColor="bg-blue-100" />
          <CategoryIconCard icon={<ScaleIcon className="w-6 h-6" />} label="Giáo Dục" color="text-purple-500" bgColor="bg-purple-100" />
        </div>
      </div>

      {/* 3. Main Content Area */}
      <div className="px-6 space-y-6">
        {/* Analysis Chart */}
        <SavingAnalysisChart />

        {/* 50/30/20 Rule Card */}
        <BudgetRuleCard income={computed.income} need={computed.need} want={computed.want} save={computed.save} />

        {/* Recent Transactions List (Budget Class style) */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-black text-slate-800 text-lg">Recent</h3>
              <p className="text-xs text-slate-400 font-bold">€3.50 Daily Avg</p>
            </div>
            <button className="bg-teal-50 text-teal-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider">
              Options
            </button>
          </div>

          <div className="space-y-4">
            {computed.recent.map((t) => (
              <div key={t.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                    {/* First letter of category */}
                    <span className="font-black text-lg">{t.categoryName.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{t.categoryName}</div>
                    <div className="text-xs text-slate-400 font-medium">{t.date}</div>
                  </div>
                </div>
                <div className={`font-black text-base ${t.type === 'income' ? 'text-emerald-500' : 'text-slate-800'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCompact(t.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;

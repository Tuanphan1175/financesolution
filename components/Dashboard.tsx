<<<<<<< Updated upstream
import React, { useMemo } from "react";
import type { Category, Transaction, SpendingClassification } from "../types";
import { ScaleIcon } from "./Icons";

type DashboardProps = {
  transactions: Transaction[];
  categories: Category[];
};

const formatMoney = (v: number) =>
  (Number.isFinite(v) ? Math.round(v) : 0).toLocaleString("vi-VN");

const StatCard: React.FC<{
  label: string;
  value: string;
  sub?: string;
  tone?: "neutral" | "good" | "bad";
}> = ({ label, value, sub, tone = "neutral" }) => {
  const toneClass =
    tone === "good"
      ? "text-emerald-300"
      : tone === "bad"
      ? "text-rose-300"
      : "text-white";

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 shadow-premium">
      <div className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">
        {label}
      </div>
      <div className={`mt-3 text-3xl font-black tracking-tight ${toneClass}`}>
        {value}
      </div>
      {sub && (
        <div className="mt-2 text-[12px] font-bold text-slate-500 tracking-wide">
          {sub}
        </div>
      )}
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

  const calcPct = (value: number) => {
    if (!hasIncome) return 0;
    return Math.round((value / income) * 100);
  };

  const clamp01_100 = (pct: number) => Math.max(0, Math.min(100, pct));
  const displayPct = (pct: number) => (hasIncome ? `${pct}%` : "—");

  const needPct = calcPct(need);
  const wantPct = calcPct(want);
  const savePct = calcPct(save);

  return (
    <div className="bg-slate-900/90 p-10 rounded-[2.5rem] shadow-premium h-full border border-slate-800">
      <h3 className="text-[14px] font-black uppercase tracking-[0.3em] mb-12 text-white flex items-center">
        <ScaleIcon className="w-6 h-6 mr-4 text-luxury-gold" />
        Quy tắc 50/30/20
        <span className="ml-auto text-[10px] font-black text-luxury-gold bg-luxury-gold/10 px-4 py-1.5 rounded-full tracking-[0.2em] border border-luxury-gold/20">
          LIVE
        </span>
      </h3>

      {!hasIncome && (
        <div className="mb-10 p-5 rounded-2xl bg-black/30 border border-slate-800">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
            Chưa có thu nhập trong bộ lọc hiện tại, nên % tạm thời không tính.
          </p>
        </div>
      )}

      <div className="space-y-10">
        {/* Needs */}
        <div className="group">
          <div className="flex justify-between items-end mb-4">
            <span className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">
              Cần thiết (Need)
            </span>
            <div className="text-right">
              <span className="font-black text-2xl text-white tracking-tighter">
                {displayPct(needPct)}
              </span>
              <span className="text-[12px] text-slate-500 font-bold ml-2">
                / 50%
              </span>
            </div>
          </div>
          <div className="w-full bg-black/40 rounded-full h-2.5 border border-slate-800 shadow-inner overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                hasIncome && needPct > 55
                  ? "bg-rose-500 shadow-glow"
                  : "bg-primary-500 shadow-glow"
              }`}
              style={{ width: `${clamp01_100(needPct)}%` }}
            />
          </div>
        </div>

        {/* Wants */}
        <div className="group">
          <div className="flex justify-between items-end mb-4">
            <span className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">
              Mong muốn (Want)
            </span>
            <div className="text-right">
              <span className="font-black text-2xl text-white tracking-tighter">
                {displayPct(wantPct)}
              </span>
              <span className="text-[12px] text-slate-500 font-bold ml-2">
                / 30%
              </span>
            </div>
          </div>
          <div className="w-full bg-black/40 rounded-full h-2.5 border border-slate-800 shadow-inner overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                hasIncome && wantPct > 35
                  ? "bg-rose-500"
                  : "bg-amber-500 shadow-glow"
              }`}
              style={{ width: `${clamp01_100(wantPct)}%` }}
            />
          </div>
        </div>

        {/* Savings */}
        <div className="group">
          <div className="flex justify-between items-end mb-4">
            <span className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">
              Tiết kiệm (Save)
            </span>
            <div className="text-right">
              <span className="font-black text-2xl text-emerald-400 tracking-tighter">
                {displayPct(savePct)}
              </span>
              <span className="text-[12px] text-slate-500 font-bold ml-2">
                / 20%
              </span>
            </div>
          </div>
          <div className="w-full bg-black/40 rounded-full h-2.5 border border-slate-800 shadow-inner overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                hasIncome && savePct < 15
                  ? "bg-rose-500"
                  : "bg-emerald-500 shadow-glow"
              }`}
              style={{ width: `${clamp01_100(savePct)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ transactions, categories }) => {
  // ✅ Guard tuyệt đối để tránh "is not iterable" ở production
  const safeTransactions = useMemo(
    () => (Array.isArray(transactions) ? transactions : []),
    [transactions]
  );
  const safeCategories = useMemo(
    () => (Array.isArray(categories) ? categories : []),
    [categories]
  );

  const categoryMap = useMemo(() => {
    const m = new Map<string, Category>();
    for (const c of safeCategories) m.set(c.id, c);
    return m;
  }, [safeCategories]);

  const computed = useMemo(() => {
    let income = 0;
    let expenseTotal = 0;

    let need = 0;
    let want = 0;
    let other = 0;

    for (const t of safeTransactions) {
      if (t.type === "income") {
        income += t.amount;
        continue;
      }

      expenseTotal += t.amount;

      const cat = categoryMap.get(t.categoryId);
      const cls = (cat?.defaultClassification ?? null) as
        | SpendingClassification
        | null;

      if (cls === "need") need += t.amount;
      else if (cls === "want") want += t.amount;
      else other += t.amount;
    }

    const save = Math.max(0, income - expenseTotal);
    const net = income - expenseTotal;

    const recent = [...safeTransactions]
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
      .slice(0, 8)
      .map((t) => {
        const cat = categoryMap.get(t.categoryId);
        return {
          ...t,
          categoryName: cat?.name ?? "Không rõ",
        };
      });

    return { income, expenseTotal, need, want, other, save, net, recent };
  }, [safeTransactions, categoryMap]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="text-[12px] font-black uppercase tracking-[0.28em] text-slate-400">
          Tổng quan
        </div>
        <div className="mt-2 text-3xl font-black tracking-tight text-white">
          Dashboard tài chính
        </div>
        <div className="mt-2 text-[13px] font-bold text-slate-500">
          Dữ liệu được tổng hợp theo bộ lọc hiện tại (nếu Bác Sĩ đang lọc theo
          thời gian/tài khoản ở App).
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <StatCard
          label="Thu nhập"
          value={`${formatMoney(computed.income)} ₫`}
          tone="good"
        />
        <StatCard
          label="Chi tiêu"
          value={`${formatMoney(computed.expenseTotal)} ₫`}
          tone="bad"
        />
        <StatCard
          label="Dòng tiền ròng"
          value={`${formatMoney(computed.net)} ₫`}
          sub={computed.net >= 0 ? "Dương: đang dư" : "Âm: đang thâm hụt"}
          tone={computed.net >= 0 ? "good" : "bad"}
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 50/30/20 */}
        <div className="xl:col-span-2">
          <BudgetRuleCard
            income={computed.income}
            need={computed.need}
            want={computed.want}
            save={computed.save}
          />

          {/* Breakdown */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            <StatCard
              label="Need (Cần thiết)"
              value={`${formatMoney(computed.need)} ₫`}
            />
            <StatCard
              label="Want (Mong muốn)"
              value={`${formatMoney(computed.want)} ₫`}
            />
            <StatCard
              label="Khác (Chưa phân loại)"
              value={`${formatMoney(computed.other)} ₫`}
            />
          </div>
        </div>

        {/* Recent transactions */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-[2rem] p-6 shadow-premium">
          <div className="text-[12px] font-black uppercase tracking-[0.28em] text-slate-400">
            Giao dịch gần đây
          </div>

          <div className="mt-4 space-y-3">
            {computed.recent.length === 0 ? (
              <div className="text-slate-500 text-[13px] font-bold">
                Chưa có giao dịch trong bộ lọc hiện tại.
              </div>
            ) : (
              computed.recent.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between bg-black/30 border border-slate-800 rounded-2xl p-4"
                >
                  <div className="min-w-0">
                    <div className="text-[12px] font-black text-white truncate">
                      {t.categoryName}
                      {t.description ? (
                        <span className="text-slate-500 font-bold">
                          {" "}
                          • {t.description}
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-1 text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                      {t.date}
                    </div>
                  </div>

                  <div
                    className={`ml-4 text-right text-[13px] font-black ${
                      t.type === "income"
                        ? "text-emerald-300"
                        : "text-rose-300"
                    }`}
                  >
                    {t.type === "income" ? "+" : "-"}
                    {formatMoney(t.amount)} ₫
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-5 text-[11px] font-bold text-slate-500">
            Gợi ý: để % 50/30/20 chạy đúng, hãy đặt{" "}
            <span className="text-slate-300">defaultClassification</span> cho
            Category (need/want).
          </div>
        </div>
=======
// components/Dashboard.tsx
import React, { useMemo, useEffect, useState } from 'react';
import { TrendLineChart } from './ChartComponents';
import type { Transaction, AccountType, GoldenRule, Category, Asset, Liability } from '../types';
import { ArrowUpIcon, ArrowDownIcon, CashIcon, ScaleIcon } from './Icons';
import { IconMap } from './Icons';
import { WealthPlaybookPanel } from './WealthPlaybookPanel';
import type { PyramidStatus } from '../lib/pyramidLogic';
import { BudgetSettings } from './BudgetSettings';

type IconEl = React.ReactElement<{ className?: string; style?: React.CSSProperties }>;

function renderIcon(el: React.ReactNode, props: { className?: string; style?: React.CSSProperties }) {
  if (React.isValidElement(el)) return React.cloneElement(el as IconEl, props);
  return null;
}

const StatCard: React.FC<{
  title: string;
  amount: string | number;
  icon: React.ReactNode;
  subText?: string;
  isGold?: boolean;
}> = ({ title, amount, icon, subText, isGold }) => (
  <div
    className={`
      relative p-10 rounded-[2.5rem] shadow-premium hover:shadow-glow transition-all duration-500 flex items-center justify-between border group overflow-hidden
      ${isGold ? 'bg-gradient-to-br from-slate-900 to-black border-luxury-gold/30' : 'bg-slate-900/80 border-slate-800'}
    `}
  >
    <div className="absolute -right-6 -top-6 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity rotate-12">
      {renderIcon(icon, { className: 'w-40 h-40' })}
    </div>

    <div className="flex-1 min-w-0 relative z-10">
      <p className={`text-[12px] font-black uppercase tracking-[0.3em] mb-4 truncate ${isGold ? 'text-luxury-gold' : 'text-slate-500'}`}>
        {title}
      </p>
      <p className="text-4xl md:text-5xl font-black truncate tracking-tighter leading-none text-white">
        {typeof amount === 'number' ? `${amount.toLocaleString('vi-VN')} ₫` : amount}
      </p>

      {subText && (
        <p className="text-[12px] font-bold text-slate-400 mt-5 flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full ${isGold ? 'bg-luxury-gold shadow-[0_0_10px_#C5A059]' : 'bg-primary-500'}`} />
          {subText}
        </p>
      )}
    </div>

    <div
      className={`p-6 rounded-3xl shrink-0 ml-8 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ${
        isGold ? 'bg-luxury-gold text-black shadow-luxury' : 'bg-slate-800 text-primary-400 border border-slate-700'
      }`}
    >
      {renderIcon(icon, { className: 'h-10 w-10' })}
    </div>
  </div>
);

const ScoreCard: React.FC<{ score: number }> = ({ score }) => {
  let colorClass = 'text-emerald-400';
  let label = 'TỐI ƯU';
  let shadowColor = 'shadow-emerald-500/20';

  if (score < 50) {
    colorClass = 'text-rose-400';
    label = 'CẢNH BÁO';
    shadowColor = 'shadow-rose-500/20';
  } else if (score < 80) {
    colorClass = 'text-luxury-gold';
    label = 'KHÁ ỔN';
    shadowColor = 'shadow-luxury-gold/20';
  }

  return (
    <div className="bg-slate-900/90 p-10 rounded-[2.5rem] shadow-premium flex flex-col justify-between h-full border border-slate-800 relative overflow-hidden group">
      <div className="flex justify-between items-center mb-8">
        <p className="text-[12px] font-black text-slate-500 uppercase tracking-[0.3em]">Health Score</p>
        <span className={`text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full border bg-black/40 ${colorClass} border-current`}>
          {label}
        </span>
      </div>

      <div className="flex items-baseline mt-4">
        <div className={`text-7xl font-black ${colorClass} tracking-tighter drop-shadow-lg`}>{score}</div>
        <span className="text-slate-700 text-3xl ml-3 font-black">/100</span>
      </div>

      <div className="mt-10">
        <div className="w-full bg-black/40 rounded-full h-4 p-1 border border-slate-800 shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-1500 ${
              score < 50 ? 'bg-rose-500' : score < 80 ? 'bg-luxury-gold' : 'bg-emerald-500'
            } ${shadowColor} shadow-glow`}
            style={{ width: `${Math.max(0, Math.min(score, 100))}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const BudgetRuleCard: React.FC<{ need: number; want: number; save: number; income: number }> = ({ need, want, save, income }) => {
  const safeIncome = income || 1;
  const needPct = Math.round((need / safeIncome) * 100);
  const wantPct = Math.round((want / safeIncome) * 100);
  const savePct = Math.round((save / safeIncome) * 100);

  return (
    <div className="bg-slate-900/90 p-10 rounded-[2.5rem] shadow-premium h-full border border-slate-800">
      <h3 className="text-[14px] font-black uppercase tracking-[0.3em] mb-12 text-white flex items-center">
        <ScaleIcon className="w-6 h-6 mr-4 text-luxury-gold" />
        Quy tắc 50/30/20
        <span className="ml-auto text-[10px] font-black text-luxury-gold bg-luxury-gold/10 px-4 py-1.5 rounded-full tracking-[0.2em] border border-luxury-gold/20">
          LIVE
        </span>
      </h3>

      <div className="space-y-10">
        {/* Needs */}
        <div>
          <div className="flex justify-between items-end mb-4">
            <span className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">Cần thiết (Need)</span>
            <div className="text-right">
              <span className="font-black text-2xl text-white tracking-tighter">{needPct}%</span>
              <span className="text-[12px] text-slate-500 font-bold ml-2">/ 50%</span>
            </div>
          </div>
          <div className="w-full bg-black/40 rounded-full h-2.5 border border-slate-800 shadow-inner overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${needPct > 55 ? 'bg-rose-500 shadow-glow' : 'bg-primary-500 shadow-glow'}`}
              style={{ width: `${Math.min(Math.max(needPct, 0), 100)}%` }}
            />
          </div>
        </div>

        {/* Wants */}
        <div>
          <div className="flex justify-between items-end mb-4">
            <span className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">Mong muốn (Want)</span>
            <div className="text-right">
              <span className="font-black text-2xl text-white tracking-tighter">{wantPct}%</span>
              <span className="text-[12px] text-slate-500 font-bold ml-2">/ 30%</span>
            </div>
          </div>
          <div className="w-full bg-black/40 rounded-full h-2.5 border border-slate-800 shadow-inner overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${wantPct > 35 ? 'bg-rose-500' : 'bg-amber-500 shadow-glow'}`}
              style={{ width: `${Math.min(Math.max(wantPct, 0), 100)}%` }}
            />
          </div>
        </div>

        {/* Savings */}
        <div>
          <div className="flex justify-between items-end mb-4">
            <span className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">Tiết kiệm (Save)</span>
            <div className="text-right">
              <span className="font-black text-2xl text-emerald-400 tracking-tighter">{savePct}%</span>
              <span className="text-[12px] text-slate-500 font-bold ml-2">/ 20%</span>
            </div>
          </div>
          <div className="w-full bg-black/40 rounded-full h-2.5 border border-slate-800 shadow-inner overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${savePct < 15 ? 'bg-rose-500' : 'bg-emerald-500 shadow-glow'}`}
              style={{ width: `${Math.min(Math.max(savePct, 0), 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const TransactionRow: React.FC<{ transaction: Transaction; categories: Category[] }> = ({ transaction, categories }) => {
  const category = categories.find((c) => c.id === transaction.categoryId);
  const isIncome = transaction.type === 'income';

  const IconComponent =
    category && (IconMap as Record<string, React.ComponentType<any>>)[category.icon]
      ? (IconMap as Record<string, React.ComponentType<any>>)[category.icon]
      : CashIcon;

  return (
    <div className="flex items-center justify-between py-8 px-4 group rounded-3xl transition-all hover:bg-slate-800/40 border border-transparent hover:border-slate-800">
      <div className="flex items-center">
        <div
          className="p-5 rounded-[1.5rem] transition-all group-hover:scale-110 shadow-lg border border-white/5"
          style={{ backgroundColor: `${category?.color || '#9ca3af'}25` }}
        >
          <IconComponent className="h-7 w-7" style={{ color: category?.color || '#9ca3af' }} />
        </div>

        <div className="ml-6">
          <p className="text-[16px] font-black text-white tracking-tight leading-none mb-2">{transaction.description}</p>
          <div className="flex items-center space-x-4">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">{category?.name || 'Khác'}</span>

            {transaction.type === 'expense' && (
              <span
                className={`text-[9px] font-black uppercase px-3 py-0.5 rounded-lg border ${
                  transaction.classification === 'want'
                    ? 'text-rose-400 border-rose-500/30 bg-rose-500/10'
                    : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                }`}
              >
                {transaction.classification === 'want' ? 'MONG MUỐN' : 'CẦN THIẾT'}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={`text-right ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
        <p className="text-xl font-black font-mono tracking-tighter leading-none mb-1">
          {isIncome ? '+' : '-'}
          {transaction.amount.toLocaleString('vi-VN')} ₫
        </p>
        <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.2em]">
          {new Date(transaction.date).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })}
        </p>
      </div>
    </div>
  );
};

interface DashboardProps {
  transactions: Transaction[];
  assets: Asset[];
  liabilities: Liability[];
  goldenRules: GoldenRule[];
  accountFilter: 'all' | AccountType;
  setAccountFilter: (val: 'all' | AccountType) => void;
  categories: Category[];
  pyramidStatus: PyramidStatus;
}

export const Dashboard: React.FC<DashboardProps> = ({
  transactions,
  assets,
  liabilities,
  accountFilter,
  setAccountFilter,
  categories,
  pyramidStatus,
}) => {
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString('vi-VN'));

  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString('vi-VN'));
  }, [transactions, assets, liabilities, accountFilter]);

  const filteredTransactions = useMemo(() => {
    return accountFilter === 'all' ? transactions : transactions.filter((t) => t.accountType === accountFilter);
  }, [transactions, accountFilter]);

  const totalIncome = useMemo(
    () => filteredTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  );

  const totalExpense = useMemo(
    () => filteredTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  );

  const balance = totalIncome - totalExpense;

  const recentTransactions = useMemo(() => {
    return [...filteredTransactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [filteredTransactions]);

  const needExpense = useMemo(
    () => filteredTransactions.filter((t) => t.type === 'expense' && t.classification === 'need').reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  );

  const wantExpense = useMemo(
    () => filteredTransactions.filter((t) => t.type === 'expense' && t.classification === 'want').reduce((sum, t) => sum + t.amount, 0),
    [filteredTransactions]
  );

  const savings = Math.max(0, totalIncome - totalExpense);

  const complianceScore = pyramidStatus?.metrics?.complianceScore ?? 0;

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900/50 backdrop-blur-md p-5 rounded-[2.5rem] shadow-premium border border-slate-800 gap-6">
        <div className="flex items-center gap-4 ml-4">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
          <div>
            <span className="text-[11px] font-black uppercase text-luxury-gold tracking-[0.4em]">Dữ liệu thời gian thực</span>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Cập nhật lúc: {lastUpdated}</p>
          </div>
        </div>

        <div className="flex bg-black/40 p-2 rounded-[1.5rem] w-full md:w-auto border border-slate-800 shadow-inner">
          {(['all', 'personal', 'business'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setAccountFilter(type)}
              className={`flex-1 md:flex-none px-10 py-3 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all duration-500 ${
                accountFilter === type ? 'bg-luxury-gold text-black shadow-glow' : 'text-slate-500 hover:text-white'
              }`}
            >
              {type === 'all' ? 'TẤT CẢ' : type === 'personal' ? 'CÁ NHÂN' : 'KINH DOANH'}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2">
          <StatCard title="Thặng dư thực tế" amount={balance} icon={<CashIcon />} isGold subText="Nguồn vốn thặng dư có thể đầu tư" />
        </div>
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-10">
          <StatCard title="Tổng Thu nhập" amount={totalIncome} icon={<ArrowUpIcon />} subText="Cashflow Inflow" />
          <StatCard title="Tổng Chi tiêu" amount={totalExpense} icon={<ArrowDownIcon />} subText="Cashflow Outflow" />
        </div>
      </div>

      {/* Score + Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
        <div className="lg:col-span-2 space-y-10">
          <ScoreCard score={complianceScore} />
          <BudgetRuleCard need={needExpense} want={wantExpense} save={savings} income={totalIncome} />
        </div>

        <div className="lg:col-span-3">
          <div className="bg-slate-900/90 p-12 rounded-[3rem] shadow-premium border border-slate-800 h-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-luxury-gold to-rose-500 opacity-30" />
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-[14px] font-black uppercase tracking-[0.4em] text-white">Dòng tiền Monthly</h3>

              <div className="flex items-center gap-8 bg-black/30 px-6 py-3 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thu nhập</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#ef4444]" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chi tiêu</span>
                </div>
              </div>
            </div>

            <div className="h-[400px]">
              <TrendLineChart data={filteredTransactions} />
            </div>
          </div>
        </div>
      </div>

      {/* Panels */}
      <div className="mt-6">
        <WealthPlaybookPanel />
      </div>

      <div className="mt-6">
        <BudgetSettings />
      </div>

      {/* Recent Transactions */}
      <div className="bg-slate-900/90 p-12 rounded-[3rem] shadow-premium border border-slate-800 relative overflow-hidden">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h3 className="text-[16px] font-black uppercase tracking-[0.4em] text-white">Nhật ký tài chính</h3>
            <p className="text-slate-500 text-xs mt-2 font-bold tracking-widest">GẦN ĐÂY NHẤT</p>
          </div>

          <button className="text-[11px] font-black uppercase tracking-[0.3em] text-luxury-gold border border-luxury-gold/30 hover:bg-luxury-gold hover:text-black transition-all bg-black/40 px-8 py-3 rounded-2xl shadow-luxury">
            Toàn bộ giao dịch
          </button>
        </div>

        <div className="divide-y divide-slate-800/50">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((t) => <TransactionRow key={t.id} transaction={t} categories={categories} />)
          ) : (
            <div className="text-center py-24 bg-black/20 rounded-[2.5rem] border-2 border-dashed border-slate-800">
              <CashIcon className="w-16 h-16 text-slate-700 mx-auto mb-6 opacity-30" />
              <p className="text-xl text-slate-500 font-black italic uppercase tracking-[0.2em]">Sẵn sàng cho giao dịch đầu tiên?</p>
            </div>
          )}
        </div>
>>>>>>> Stashed changes
      </div>
    </div>
  );
};
<<<<<<< Updated upstream

export default Dashboard;
=======
>>>>>>> Stashed changes

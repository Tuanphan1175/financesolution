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
  // Guard tuyệt đối để tránh crash nếu props null/undefined
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

      // expense
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
      </div>
    </div>
  );
};

export default Dashboard;


import React, { useMemo, useState, useEffect } from "react";
import { buildAllocation, Profile } from "../lib/financeEngine";
import { loadPlanProgress, savePlanProgress, PlanProgress, loadPlaybookState, savePlaybookState } from "../lib/planStore";
import { CheckCircleIcon, RefreshIcon, SaveDiskIcon, ExclamationIcon, SparklesIcon } from "./Icons";

type Props = {
  monthlyIncomeDefault?: number;
  monthlyEssentialDefault?: number;
  emergencyFundDefault?: number;
  debtMonthlyDefault?: number;
  hasHighInterestDebtDefault?: boolean;
};

export const WealthPlaybookPanel: React.FC<Props> = (props) => {
  const savedState = useMemo(() => loadPlaybookState(), []);

  const [monthlyIncome, setMonthlyIncome] = useState(savedState?.monthlyIncome ?? props.monthlyIncomeDefault ?? 0);
  const [essentialCost, setEssentialCost] = useState(savedState?.essentialCost ?? props.monthlyEssentialDefault ?? 0);
  const [emergencyFund, setEmergencyFund] = useState(savedState?.emergencyFund ?? props.emergencyFundDefault ?? 0);
  const [debtPay, setDebtPay] = useState(savedState?.debtPay ?? props.debtMonthlyDefault ?? 0);
  const [hasDebtHigh, setHasDebtHigh] = useState(savedState?.hasDebtHigh ?? props.hasHighInterestDebtDefault ?? false);

  const [planProgress, setPlanProgress] = useState<PlanProgress>(loadPlanProgress);
  const [customJars, setCustomJars] = useState<Record<string, number> | null>(savedState?.customJars ?? null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const profile: Profile = useMemo(() => ({
    monthlyIncome,
    monthlyEssentialCost: essentialCost,
    emergencyFundBalance: emergencyFund,
    debtPaymentMonthly: debtPay,
    hasHighInterestDebt: hasDebtHigh,
    businessMode: "PERSONAL",
  }), [monthlyIncome, essentialCost, emergencyFund, debtPay, hasDebtHigh]);

  const result = useMemo(() => buildAllocation(profile), [profile]);

  const finalJars = useMemo(() => {
    return result.jars.map(j => {
      const pct = (customJars && customJars[j.key] !== undefined) ? customJars[j.key] : j.pct;
      return {
        ...j,
        pct,
        amount: (monthlyIncome * pct) / 100
      };
    });
  }, [result.jars, customJars, monthlyIncome]);

  const totalPct = useMemo(() => {
    const sum = finalJars.reduce((acc, j) => acc + j.pct, 0);
    return Math.round(sum * 10) / 10;
  }, [finalJars]);

  const isCustom = customJars !== null;

  const handlePctChange = (key: string, val: number) => {
    setCustomJars(prev => {
        const current = prev || result.jars.reduce((acc, j) => ({ ...acc, [j.key]: j.pct }), {} as Record<string, number>);
        return { ...current, [key]: val };
    });
    setSaveStatus('idle');
  };

  const handleToggleAction = (actionItem: string) => {
    const newChecked = { ...planProgress.checked, [actionItem]: !planProgress.checked[actionItem] };
    const newProgress = { ...planProgress, checked: newChecked, updatedAt: new Date().toISOString() };
    setPlanProgress(newProgress);
    savePlanProgress(newProgress);
  };

  const handleSaveScenario = () => {
      if (totalPct !== 100) return;
      
      setSaveStatus('saving');
      setTimeout(() => {
          savePlaybookState({
              monthlyIncome,
              essentialCost,
              emergencyFund,
              debtPay,
              hasDebtHigh,
              customJars,
              updatedAt: new Date().toISOString()
          });
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 3000);
      }, 400);
  };

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="flex items-start justify-between gap-6 flex-wrap mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <div className="p-2 bg-primary-500/20 rounded-lg">
                <SparklesIcon className="w-5 h-5 text-primary-400" />
             </div>
             <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Chiến lược Tài chính 6 Hũ</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Trạng thái:</span>
            <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isCustom ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-primary-500/20 text-primary-400 border border-primary-500/30'}`}>
                {isCustom ? 'Cấu hình cá nhân' : 'Gợi ý từ Chuyên gia'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
             {isCustom && (
                 <button 
                    onClick={() => { setCustomJars(null); setSaveStatus('idle'); }}
                    className="flex items-center px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-all border border-slate-700"
                >
                    <RefreshIcon className="w-4 h-4 mr-2" /> Đặt lại chuẩn
                </button>
             )}
             <button 
                disabled={totalPct !== 100 || saveStatus !== 'idle'}
                onClick={handleSaveScenario}
                className={`flex items-center px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
                    saveStatus === 'saved' 
                    ? 'bg-emerald-600 text-white cursor-default'
                    : totalPct !== 100 
                        ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
                        : 'bg-luxury-gold hover:bg-white text-black shadow-[0_0_20px_rgba(197,160,89,0.4)] animate-pulse'
                }`}
             >
                {saveStatus === 'saving' ? (
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2"></div>
                ) : saveStatus === 'saved' ? (
                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                ) : (
                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                )}
                {saveStatus === 'saved' ? 'Đã cập nhật' : 'Hoàn tất & Lưu số liệu'}
             </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <InputMoney label="Thu nhập hàng tháng" value={monthlyIncome} onChange={(v) => { setMonthlyIncome(v); setSaveStatus('idle'); }} />
        <InputMoney label="Chi thiết yếu thực tế" value={essentialCost} onChange={(v) => { setEssentialCost(v); setSaveStatus('idle'); }} />
        <InputMoney label="Số dư quỹ dự phòng" value={emergencyFund} onChange={(v) => { setEmergencyFund(v); setSaveStatus('idle'); }} />
        <InputMoney label="Tiền trả nợ/tháng" value={debtPay} onChange={(v) => { setDebtPay(v); setSaveStatus('idle'); }} />
        <div className="rounded-2xl border border-slate-800 p-4 bg-slate-900/80 flex flex-col justify-center transition-all hover:border-slate-700">
          <label className="flex items-center gap-3 text-sm text-slate-200 cursor-pointer group">
            <input
              type="checkbox"
              className="w-5 h-5 rounded-lg text-primary-500 focus:ring-primary-500 bg-slate-800 border-slate-700 cursor-pointer"
              checked={hasDebtHigh}
              onChange={(e) => { setHasDebtHigh(e.target.checked); setSaveStatus('idle'); }}
            />
            <span className="font-black text-[10px] uppercase tracking-widest group-hover:text-primary-400 transition-colors">Đang có nợ lãi cao?</span>
          </label>
        </div>
      </div>

      <div className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
             <div className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center">
                 <div className={`w-2 h-2 rounded-full mr-3 animate-pulse ${totalPct === 100 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                 Tỷ lệ phân bổ ngân sách
             </div>
             
             <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                 <div className="flex flex-col items-end px-2">
                    <div className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">Tổng tỷ lệ</div>
                    <div className={`text-2xl font-black font-mono transition-colors ${totalPct === 100 ? 'text-emerald-400' : 'text-rose-500'}`}>
                        {totalPct}%
                    </div>
                 </div>
                 {totalPct !== 100 && (
                     <div className="flex items-center gap-2 px-3 text-[10px] font-black text-rose-400 bg-rose-500/10 py-1.5 rounded-xl border border-rose-500/20">
                        <ExclamationIcon className="w-4 h-4" />
                        Cần đạt 100%
                     </div>
                 )}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {finalJars.map(j => (
            <div key={j.key} className={`group relative rounded-3xl border p-6 transition-all duration-500 ${
                totalPct !== 100 && isCustom ? 'border-red-900/20 bg-slate-900/40' : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:border-slate-700'
            }`}>
              <div className="flex items-center justify-between mb-5">
                <div>
                    <div className="text-xs font-black text-white uppercase tracking-widest">{j.label}</div>
                    <div className="text-[10px] text-slate-500 mt-1 font-medium">{j.note}</div>
                </div>
                <div className="text-2xl font-black font-mono text-primary-400 transition-transform group-hover:scale-110">
                    {j.pct}%
                </div>
              </div>

              <div className="mt-4 mb-8">
                <input 
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={j.pct}
                    onChange={(e) => handlePctChange(j.key, parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-primary-500"
                />
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-800/50">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Ngân sách dự kiến</span>
                <span className="text-sm text-emerald-400 font-black font-mono">
                    {formatVND(j.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ActionCard 
            title="Kế hoạch tác chiến 7 ngày" 
            items={result.actions7d} 
            color="blue" 
            checkedMap={planProgress.checked}
            onToggle={handleToggleAction}
        />
        <ActionCard 
            title="Chiến lược dài hạn 30 ngày" 
            items={result.actions30d} 
            color="purple" 
            checkedMap={planProgress.checked}
            onToggle={handleToggleAction}
        />
      </div>
    </div>
  );
}

function ActionCard({ title, items, color, checkedMap, onToggle }: { 
    title: string; 
    items: string[]; 
    color: 'blue' | 'purple';
    checkedMap: Record<string, boolean>;
    onToggle: (item: string) => void;
}) {
    const borderColor = color === 'blue' ? 'border-blue-900/30' : 'border-purple-900/30';
    const titleColor = color === 'blue' ? 'text-blue-400' : 'text-purple-400';
    
  return (
    <div className={`rounded-3xl border ${borderColor} bg-slate-950/40 p-6`}>
      <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-6 ${titleColor}`}>{title}</h3>
      <ul className="space-y-4">
        {items.map((x, i) => {
            const isChecked = !!checkedMap[x];
            return (
                <li 
                    key={i} 
                    className={`flex items-start cursor-pointer group select-none transition-all ${isChecked ? 'opacity-30' : 'hover:translate-x-1'}`}
                    onClick={() => onToggle(x)}
                >
                    <div className={`
                        mr-4 mt-0.5 w-6 h-6 rounded-xl border flex items-center justify-center shrink-0 transition-all
                        ${isChecked 
                            ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/20' 
                            : 'border-slate-700 group-hover:border-primary-500'
                        }
                    `}>
                        {isChecked && <CheckCircleIcon className="w-4 h-4 text-white" />}
                    </div>
                    <span className={`text-xs font-bold leading-relaxed ${isChecked ? "line-through text-slate-500" : "text-slate-300"}`}>
                        {x}
                    </span>
                </li>
            );
        })}
      </ul>
    </div>
  );
}

function InputMoney({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div className="rounded-2xl border border-slate-800 p-4 bg-slate-900/60 transition-all hover:border-slate-700 group">
      <div className="text-[9px] font-black text-slate-500 uppercase mb-2 tracking-widest group-hover:text-slate-400">{label}</div>
      <div className="relative">
        <input
            className="w-full rounded-xl bg-slate-950 border border-slate-800 px-4 py-2.5 text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm font-black font-mono transition-all"
            type="number"
            value={value || ''}
            placeholder="0"
            onChange={(e) => onChange(Number(e.target.value || 0))}
        />
      </div>
      <div className="text-[10px] text-emerald-500/70 mt-2 font-black text-right truncate font-mono tracking-tighter">
        {formatVND(value)}
      </div>
    </div>
  );
}

function formatVND(n: number) {
  return Math.round(n || 0).toLocaleString("vi-VN") + " ₫";
}

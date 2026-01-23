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

  const needPct = calcPct(need);
  const wantPct = calcPct(want);
  const savePct = calcPct(save);

  const displayPct = (pct: number) => (hasIncome ? `${pct}%` : '—');

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
              <span className="text-[12px] text-slate-500 font-bold ml-2">/ 50%</span>
            </div>
          </div>
          <div className="w-full bg-black/40 rounded-full h-2.5 border border-slate-800 shadow-inner overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                hasIncome && needPct > 55 ? 'bg-rose-500 shadow-glow' : 'bg-primary-500 shadow-glow'
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
              <span className="text-[12px] text-slate-500 font-bold ml-2">/ 30%</span>
            </div>
          </div>
          <div className="w-full bg-black/40 rounded-full h-2.5 border border-slate-800 shadow-inner overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                hasIncome && wantPct > 35 ? 'bg-rose-500' : 'bg-amber-500 shadow-glow'
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
              <span className="text-[12px] text-slate-500 font-bold ml-2">/ 20%</span>
            </div>
          </div>
          <div className="w-full bg-black/40 rounded-full h-2.5 border border-slate-800 shadow-inner overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                hasIncome && savePct < 15 ? 'bg-rose-500' : 'bg-emerald-500 shadow-glow'
              }`}
              style={{ width: `${clamp01_100(savePct)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

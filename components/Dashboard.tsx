
import React, { useMemo, useEffect, useState } from 'react';
import { CategoryPieChart, TrendLineChart } from './ChartComponents';
import { Transaction, AccountType, GoldenRule, Category } from '../types';
import { ArrowUpIcon, ArrowDownIcon, CashIcon, ScaleIcon, RefreshIcon } from './Icons';
import { IconMap } from './Icons';
import { WealthPlaybookPanel } from './WealthPlaybookPanel';
import { PyramidStatus } from '../lib/pyramidLogic';

const StatCard: React.FC<{ title: string; amount: string | number; icon: React.ReactNode; color?: string; subText?: string; isGold?: boolean }> = ({ title, amount, icon, color = 'primary', subText, isGold }) => (
    <div className={`
      relative p-10 rounded-[2.5rem] shadow-premium hover:shadow-glow transition-all duration-500 flex items-center justify-between border group overflow-hidden
      ${isGold ? 'bg-gradient-to-br from-slate-900 to-black border-luxury-gold/30' : 'bg-slate-900/80 border-slate-800'}
    `}>
        <div className="absolute -right-6 -top-6 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity rotate-12">
          {React.cloneElement(icon as React.ReactElement, { className: "w-40 h-40" })}
        </div>
        <div className="flex-1 min-w-0 relative z-10">
            <p className={`text-[12px] font-black uppercase tracking-[0.3em] mb-4 truncate ${isGold ? 'text-luxury-gold' : 'text-slate-500'}`}>{title}</p>
            <p className={`text-4xl md:text-5xl font-black truncate tracking-tighter leading-none ${isGold ? 'text-white' : 'text-white'}`}>
                {typeof amount === 'number' ? `${amount.toLocaleString('vi-VN')} ₫` : amount}
            </p>
            {subText && <p className="text-[12px] font-bold text-slate-400 mt-5 flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full ${isGold ? 'bg-luxury-gold shadow-[0_0_10px_#C5A059]' : 'bg-primary-500'}`}></span>
              {subText}
            </p>}
        </div>
        <div className={`p-6 rounded-3xl shrink-0 ml-8 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ${isGold ? 'bg-luxury-gold text-black shadow-luxury' : 'bg-slate-800 text-primary-400 border border-slate-700'}`}>
            {React.cloneElement(icon as React.ReactElement, { className: `h-10 w-10` })}
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
                <span className={`text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full border bg-black/40 ${colorClass} border-current`}>{label}</span>
            </div>
            <div className="flex items-baseline mt-4">
                <div className={`text-7xl font-black ${colorClass} tracking-tighter drop-shadow-lg`}>{score}</div>
                <span className="text-slate-700 text-3xl ml-3 font-black">/100</span>
            </div>
             <div className="mt-10">
                <div className="w-full bg-black/40 rounded-full h-4 p-1 border border-slate-800 shadow-inner">
                    <div className={`h-full rounded-full transition-all duration-1500 ${score < 50 ? 'bg-rose-500' : score < 80 ? 'bg-luxury-gold' : 'bg-emerald-500'} ${shadowColor} shadow-glow`} style={{ width: `${score}%` }}></div>
                </div>
            </div>
        </div>
    );
};

const BudgetRuleCard: React.FC<{ need: number, want: number, save: number, income: number }> = ({ need, want, save, income }) => {
    const safeIncome = income || 1;
    const needPct = Math.round((need / safeIncome) * 100);
    const wantPct = Math.round((want / safeIncome) * 100);
    const savePct = Math.round((save / safeIncome) * 100);

    return (
        <div className="bg-slate-900/90 p-10 rounded-[2.5rem] shadow-premium h-full border border-slate-800">
            <h3 className="text-[14px] font-black uppercase tracking-[0.3em] mb-12 text-white flex items-center">
                <ScaleIcon className="w-6 h-6 mr-4 text-luxury-gold" />
                Quy tắc 50/30/20
                <span className="ml-auto text-[10px] font-black text-luxury-gold bg-luxury-gold/10 px-4 py-1.5 rounded-full tracking-[0.2em] border border-luxury-gold/20">LIVE</span>
            </h3>
            <div className="space-y-10">
                {/* Needs */}
                <div className="group">
                    <div className="flex justify-between items-end mb-4">
                        <span className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">Cần thiết (Need)</span>
                        <div className="text-right">
                            <span className="font-black text-2xl text-white tracking-tighter">{needPct}%</span>
                            <span className="text-[12px] text-slate-500 font-bold ml-2">/ 50%</span>
                        </div>
                    </div>
                    <div className="w-full bg-black/40 rounded-full h-2.5 border border-slate-800 shadow-inner overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${needPct > 55 ? 'bg-rose-500 shadow-glow' : 'bg-primary-500 shadow-glow'}`} style={{ width: `${Math.min(needPct, 100)}%` }}></div>
                    </div>
                </div>

                {/* Wants */}
                <div className="group">
                    <div className="flex justify-between items-end mb-4">
                        <span className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">Mong muốn (Want)</span>
                        <div className="text-right">
                            <span className="font-black text-2xl text-white tracking-tighter">{wantPct}%</span>
                            <span className="text-[12px] text-slate-500 font-bold ml-2">/ 30%</span>
                        </div>
                    </div>
                    <div className="w-full bg-black/40 rounded-full h-2.5 border border-slate-800 shadow-inner overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${wantPct > 35 ? 'bg-rose-500' : 'bg-amber-500 shadow-glow'}`} style={{ width: `${Math.min(wantPct, 100)}%` }}></div>
                    </div>
                </div>

                {/* Savings */}
                <div className="group">
                    <div className="flex justify-between items-end mb-4">
                        <span className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">Tiết kiệm (Save)</span>
                        <div className="text-right">
                            <span className="font-black text-2xl text-emerald-400 tracking-tighter">{savePct}%</span>
                            <span className="text-[12px] text-slate-500 font-bold ml-2">/ 20%</span>
                        </div>
                    </div>
                    <div className="w-full bg-black/40 rounded-full h-2.5 border border-slate-800 shadow-inner overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${savePct < 15 ? 'bg-rose-500' : 'bg-emerald-500 shadow-glow'}`} style={{ width: `${Math.min(Math.max(savePct, 0), 100)}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TransactionRow: React.FC<{ transaction: Transaction; categories: Category[] }> = ({ transaction, categories }) => {
    const category = categories.find(c => c.id === transaction.categoryId);
    const isIncome = transaction.type === 'income';
    const IconComponent = (category && IconMap[category.icon]) ? IconMap[category.icon] : CashIcon;

    return (
        <div className="flex items-center justify-between py-8 px-4 group rounded-3xl transition-all hover:bg-slate-800/40 border border-transparent hover:border-slate-800">
            <div className="flex items-center">
                <div className="p-5 rounded-[1.5rem] transition-all group-hover:scale-110 shadow-lg border border-white/5" style={{ backgroundColor: `${category?.color || '#9ca3af'}25` }}>
                    <IconComponent className="h-7 w-7" style={{ color: category?.color || '#9ca3af' }} />
                </div>
                <div className="ml-6">
                    <p className="text-[16px] font-black text-white tracking-tight leading-none mb-2">{transaction.description}</p>
                    <div className="flex items-center space-x-4">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
                            {category?.name || 'Khác'}
                        </span>
                        {transaction.type === 'expense' && (
                            <span className={`text-[9px] font-black uppercase px-3 py-0.5 rounded-lg border ${
                                transaction.classification === 'want' 
                                ? 'text-rose-400 border-rose-500/30 bg-rose-500/10' 
                                : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                            }`}>
                                {transaction.classification === 'want' ? 'MONG MUỐN' : 'CẦN THIẾT'}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className={`text-right ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
                <p className="text-xl font-black font-mono tracking-tighter leading-none mb-1">{isIncome ? '+' : '-'}{transaction.amount.toLocaleString('vi-VN')} ₫</p>
                <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.2em]">{new Date(transaction.date).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })}</p>
            </div>
        </div>
    );
}

interface DashboardProps {
    transactions: Transaction[];
    assets: any[];
    liabilities: any[];
    goldenRules: GoldenRule[];
    accountFilter: 'all' | AccountType;
    setAccountFilter: (val: 'all' | AccountType) => void;
    categories: Category[];
    pyramidStatus: PyramidStatus;
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions, assets, liabilities, goldenRules, accountFilter, setAccountFilter, categories, pyramidStatus }) => {
    const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString('vi-VN'));

    useEffect(() => {
        setLastUpdated(new Date().toLocaleTimeString('vi-VN'));
    }, [transactions, assets, liabilities, accountFilter]);

    const filteredTransactions = useMemo(() => {
        return accountFilter === 'all' 
            ? transactions 
            : transactions.filter(t => t.accountType === accountFilter);
    }, [transactions, accountFilter]);

    const totalIncome = useMemo(() => filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0), [filteredTransactions]);
    const totalExpense = useMemo(() => filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0), [filteredTransactions]);
    const balance = totalIncome - totalExpense;
    
    const recentTransactions = useMemo(() => [...filteredTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5), [filteredTransactions]);

    const needExpense = useMemo(() => filteredTransactions.filter(t => t.type === 'expense' && t.classification === 'need').reduce((sum, t) => sum + t.amount, 0), [filteredTransactions]);
    const wantExpense = useMemo(() => filteredTransactions.filter(t => t.type === 'expense' && t.classification === 'want').reduce((sum, t) => sum + t.amount, 0), [filteredTransactions]);
    const savings = Math.max(0, totalIncome - totalExpense);

    return (
        <div className="space-y-12 animate-in fade-in duration-1000">
            <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900/50 backdrop-blur-md p-5 rounded-[2.5rem] shadow-premium border border-slate-800 gap-6">
                <div className="flex items-center gap-4 ml-4">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
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
                            className={`flex-1 md:flex-none px-10 py-3 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all duration-500 ${accountFilter === type ? 'bg-luxury-gold text-black shadow-glow' : 'text-slate-500 hover:text-white'}`}
                        >
                            {type === 'all' ? 'TẤT CẢ' : type === 'personal' ? 'CÁ NHÂN' : 'KINH DOANH'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                <div className="lg:col-span-2">
                  <StatCard title="Thặng dư thực tế" amount={balance} icon={<CashIcon />} isGold={true} subText="Nguồn vốn thặng dư có thể đầu tư" />
                </div>
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-10">
                   <StatCard title="Tổng Thu nhập" amount={totalIncome} icon={<ArrowUpIcon />} subText="Cashflow Inflow" />
                   <StatCard title="Tổng Chi tiêu" amount={totalExpense} icon={<ArrowDownIcon />} subText="Cashflow Outflow" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
               <div className="lg:col-span-2 space-y-10">
                  <ScoreCard score={pyramidStatus.metrics.complianceScore} />
                  <BudgetRuleCard need={needExpense} want={wantExpense} save={savings} income={totalIncome} />
               </div>
               
               <div className="lg:col-span-3">
                  <div className="bg-slate-900/90 p-12 rounded-[3rem] shadow-premium border border-slate-800 h-full relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-luxury-gold to-rose-500 opacity-30"></div>
                    <div className="flex items-center justify-between mb-12">
                      <h3 className="text-[14px] font-black uppercase tracking-[0.4em] text-white">Dòng tiền Monthly</h3>
                      <div className="flex items-center gap-8 bg-black/30 px-6 py-3 rounded-2xl border border-slate-800">
                        <div className="flex items-center gap-3">
                           <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thu nhập</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#ef4444]"></div>
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

            <div className="mt-6">
                <WealthPlaybookPanel />
            </div>

            <div className="bg-slate-900/90 p-12 rounded-[3rem] shadow-premium border border-slate-800 relative overflow-hidden">
                <div className="flex justify-between items-center mb-12">
                    <div>
                      <h3 className="text-[16px] font-black uppercase tracking-[0.4em] text-white">Nhật ký tài chính</h3>
                      <p className="text-slate-500 text-xs mt-2 font-bold tracking-widest">GẦN ĐÂY NHẤT</p>
                    </div>
                    <button className="text-[11px] font-black uppercase tracking-[0.3em] text-luxury-gold border border-luxury-gold/30 hover:bg-luxury-gold hover:text-black transition-all bg-black/40 px-8 py-3 rounded-2xl shadow-luxury">Toàn bộ giao dịch</button>
                </div>
                <div className="divide-y divide-slate-800/50">
                    {recentTransactions.length > 0 ? (
                        recentTransactions.map(t => <TransactionRow key={t.id} transaction={t} categories={categories} />)
                    ) : (
                         <div className="text-center py-24 bg-black/20 rounded-[2.5rem] border-2 border-dashed border-slate-800">
                            <CashIcon className="w-16 h-16 text-slate-700 mx-auto mb-6 opacity-30" />
                            <p className="text-xl text-slate-500 font-black italic uppercase tracking-[0.2em]">Sẵn sàng cho giao dịch đầu tiên?</p>
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
};

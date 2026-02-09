
import React, { useState, useMemo } from 'react';
import { Transaction, Category, AccountType } from '../types';
import { CategoryPieChart, TrendLineChart, ClassificationPieChart, CategoryBarChart } from './ChartComponents';
import { DownloadIcon, IconMap, CashIcon, ArrowUpIcon, ArrowDownIcon, ScaleIcon, FilterIcon } from './Icons';

interface ReportsProps {
    transactions: Transaction[];
    categories: Category[];
}

const SummaryCard: React.FC<{ label: string; value: number; color: string; icon: React.ReactNode }> = ({ label, value, color, icon }) => (
    <div className="bg-slate-900/80 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-premium border border-slate-800 group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between mb-4 md:mb-6">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">{label}</span>
            <div className={`p-3 md:p-4 rounded-2xl bg-slate-800 text-primary-400 border border-slate-700 group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
        </div>
        <div className={`text-2xl md:text-3xl font-black text-white font-mono tracking-tighter`}>
            {value.toLocaleString('vi-VN')} ₫
        </div>
    </div>
);

export const Reports: React.FC<ReportsProps> = (props) => {
    const transactions = props.transactions ?? [];
    const categories = props.categories ?? [];
    const [month, setMonth] = useState<string>(new Date().toISOString().substring(0, 7));
    const [accountType, setAccountType] = useState<'all' | AccountType>('all');

    const filteredTransactions = useMemo(() => {
        return transactions
            .filter(t => t.date.startsWith(month))
            .filter(t => accountType === 'all' || t.accountType === accountType);
    }, [transactions, month, accountType]);

    const stats = useMemo(() => {
        const income = filteredTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const expense = filteredTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        const savings = income - expense;
        const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;

        return { income, expense, savings, savingsRate };
    }, [filteredTransactions]);

    const handleExportCSV = () => {
        const headers = ["ID", "Mô tả", "Danh mục", "Số tiền", "Loại", "Ngày", "Ví", "Phân loại"];
        const rows = filteredTransactions.map(t => {
            const category = categories.find(c => c.id === t.categoryId);
            return [t.id, t.description, category?.name || '?', t.amount, t.type, t.date, t.accountType, t.classification].join(',');
        });
        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `bao-cao-${accountType}-${month}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-12 pb-24">
            {/* Header Controls with Two Wallets toggle */}
            <div className="bg-slate-900/50 backdrop-blur-md p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-premium flex flex-col lg:flex-row justify-between items-center gap-6 md:gap-8 border border-slate-800">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 w-full lg:w-auto">
                    <div className="flex flex-col w-full md:w-auto">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-3 ml-2 italic">Kỳ báo cáo</span>
                        <input
                            type="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="bg-black/40 border border-slate-800 text-white rounded-2xl p-4 text-sm font-black focus:border-luxury-gold outline-none transition-all appearance-none cursor-pointer px-8"
                        />
                    </div>
                    <div className="flex flex-col w-full md:w-auto">
                        <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-3 ml-2 italic">Chọn ví dữ liệu</span>
                        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
                            {(['all', 'personal', 'business'] as const).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setAccountType(type)}
                                    className={`whitespace-nowrap px-4 md:px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-500 ${accountType === type ? 'bg-luxury-gold text-black shadow-glow' : 'text-slate-500 hover:text-white'}`}
                                >
                                    {type === 'all' ? 'Tất cả' : type === 'personal' ? 'Cá nhân' : 'Kinh doanh'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 w-full lg:w-auto">
                    <button
                        onClick={handleExportCSV}
                        className="flex-1 lg:flex-none flex items-center justify-center bg-white text-black font-black py-4 px-10 rounded-2xl hover:bg-luxury-gold transition-all shadow-luxury uppercase tracking-widest text-xs"
                    >
                        <DownloadIcon className="h-5 w-5 mr-3" />
                        Xuất báo cáo
                    </button>
                </div>
            </div>

            {filteredTransactions.length > 0 ? (
                <>
                    {/* Summary Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        <SummaryCard label="Tổng thu" value={stats.income} color="emerald" icon={<ArrowUpIcon className="w-5 h-5" />} />
                        <SummaryCard label="Tổng chi" value={stats.expense} color="rose" icon={<ArrowDownIcon className="w-5 h-5" />} />
                        <SummaryCard label="Thặng dư" value={stats.savings} color="primary" icon={<CashIcon className="w-5 h-5" />} />
                        <div className="bg-gradient-to-br from-slate-900 to-black p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-premium border border-luxury-gold/30 flex flex-col justify-between">
                            <p className="text-[10px] font-black uppercase text-luxury-gold tracking-[0.2em] mb-4">Tỷ lệ tiết kiệm</p>
                            <div className="text-4xl md:text-5xl font-black text-white font-mono tracking-tighter">{stats.savingsRate}%</div>
                            <div className="w-full bg-slate-800 rounded-full h-2 mt-6 overflow-hidden">
                                <div className="bg-luxury-gold h-full rounded-full shadow-glow" style={{ width: `${Math.min(Math.max(stats.savingsRate, 0), 100)}%` }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Trend Chart */}
                    <div className="bg-slate-900/90 p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-premium border border-slate-800">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 md:mb-12">
                            <h3 className="text-[14px] font-black uppercase tracking-[0.4em] text-white text-center md:text-left leading-relaxed">XU HƯỚNG DÒNG TIỀN {accountType.toUpperCase()}</h3>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="text-[10px] font-black text-slate-500">THU</span></div>
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500"></div><span className="text-[10px] font-black text-slate-500">CHI</span></div>
                            </div>
                        </div>
                        <div className="h-[300px] md:h-[450px]">
                            <TrendLineChart data={filteredTransactions} />
                        </div>
                    </div>

                    {/* Detailed Breakdowns */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
                        <div className="space-y-8 md:space-y-10">
                            <div className="bg-slate-900/90 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-premium border border-slate-800">
                                <h3 className="text-[14px] font-black uppercase tracking-[0.3em] mb-8 md:mb-12 text-rose-500 flex items-center">
                                    <ArrowDownIcon className="w-5 h-5 mr-4" />
                                    Cơ cấu Chi tiêu
                                </h3>
                                <div className="h-[300px] md:h-[350px]">
                                    <CategoryPieChart data={filteredTransactions} categories={categories} type="expense" />
                                </div>
                            </div>

                            <div className="bg-slate-900/90 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-premium border border-slate-800">
                                <h3 className="text-[14px] font-black uppercase tracking-[0.3em] mb-8 md:mb-12 text-luxury-gold flex items-center">
                                    <ScaleIcon className="w-5 h-5 mr-4" />
                                    Chiến lược Cần & Muốn
                                </h3>
                                <div className="h-[300px] md:h-[350px]">
                                    <ClassificationPieChart data={filteredTransactions} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8 md:space-y-10">
                            <div className="bg-slate-900/90 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-premium border border-slate-800">
                                <h3 className="text-[14px] font-black uppercase tracking-[0.3em] mb-8 md:mb-12 text-emerald-500 flex items-center">
                                    <ArrowUpIcon className="w-5 h-5 mr-4" />
                                    Cơ cấu Thu nhập
                                </h3>
                                <div className="h-[300px] md:h-[350px]">
                                    <CategoryPieChart data={filteredTransactions} categories={categories} type="income" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-slate-900 to-black p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-luxury border border-luxury-gold/20 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
                                    <FilterIcon className="w-32 md:w-48 h-32 md:h-48" />
                                </div>
                                <h4 className="text-luxury-gold font-black uppercase text-xs tracking-[0.4em] mb-6">AI Strategy Insight</h4>
                                <div className="space-y-6 relative z-10">
                                    <p className="text-base md:text-lg leading-relaxed text-slate-300 font-medium">
                                        Dữ liệu ví <span className="text-white font-black italic">{accountType === 'all' ? 'Tổng hợp' : accountType === 'personal' ? 'Cá nhân' : 'Kinh doanh'}</span> cho thấy thặng dư của bạn đang ở mức {stats.savings.toLocaleString('vi-VN')} ₫.
                                        {stats.savingsRate < 25 ? " Bạn cần rà soát lại các khoản chi Mong muốn để tối ưu hóa dòng tiền." : " Đây là con số lý tưởng để bắt đầu lộ trình tái đầu tư thặng dư."}
                                    </p>
                                    <div className="h-px bg-slate-800 w-full"></div>
                                    <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                                        "Kinh doanh cần sự tách bạch, cá nhân cần sự kỷ luật. Hai ví là chìa khóa của sự tự do."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center bg-slate-900/50 p-32 rounded-[3rem] border-2 border-dashed border-slate-800">
                    <CashIcon className="w-24 h-24 text-slate-700 mx-auto mb-10 opacity-20" />
                    <h3 className="text-2xl font-black text-slate-600 uppercase tracking-[0.4em]">Trống dữ liệu</h3>
                    <p className="text-slate-500 text-sm mt-6 font-bold italic tracking-widest">Hãy bắt đầu ghi chép các giao dịch để xem báo cáo thông minh.</p>
                </div>
            )}
        </div>
    );
};

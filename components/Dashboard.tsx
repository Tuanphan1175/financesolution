
import React, { useMemo } from 'react';
import { TRANSACTIONS, CATEGORIES, ASSETS, LIABILITIES, GOLDEN_RULES_SEED } from '../constants';
import { ExpensePieChart, TrendLineChart } from './ChartComponents';
import { Transaction, AccountType, GoldenRule } from '../types';
import { ArrowUpIcon, ArrowDownIcon, CashIcon, CreditCardIcon, BanknotesIcon, ExclamationIcon, CheckCircleIcon } from './Icons';
import { IconMap } from './Icons';

const getCategory = (id: string) => CATEGORIES.find(c => c.id === id);

const StatCard: React.FC<{ title: string; amount: number; icon: React.ReactNode; color?: string }> = ({ title, amount, icon, color = 'primary' }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">{title}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{amount.toLocaleString('vi-VN')} ₫</p>
        </div>
        <div className={`bg-${color}-100 dark:bg-${color}-900/50 p-3 rounded-full`}>
            {icon}
        </div>
    </div>
);

const ScoreCard: React.FC<{ score: number }> = ({ score }) => {
    let colorClass = 'text-green-500';
    let bgColorClass = 'bg-green-100 dark:bg-green-900/50';
    let label = 'Tuyệt vời';

    if (score < 50) {
        colorClass = 'text-red-500';
        bgColorClass = 'bg-red-100 dark:bg-red-900/50';
        label = 'Cần cải thiện';
    } else if (score < 80) {
        colorClass = 'text-yellow-500';
        bgColorClass = 'bg-yellow-100 dark:bg-yellow-900/50';
        label = 'Khá ổn';
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col justify-between h-full">
            <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Điểm Tài Chính</p>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${bgColorClass} ${colorClass}`}>{label}</span>
            </div>
            <div className="flex items-center mt-2">
                <div className={`text-5xl font-bold ${colorClass}`}>{score}</div>
                <span className="text-gray-400 text-xl ml-1">/100</span>
            </div>
             <div className="mt-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full ${score < 50 ? 'bg-red-500' : score < 80 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${score}%` }}></div>
                </div>
            </div>
        </div>
    );
};

const NudgeCard: React.FC<{ message: string; type?: 'warning' | 'info' }> = ({ message, type = 'warning' }) => (
    <div className={`p-4 rounded-lg flex items-start space-x-3 ${type === 'warning' ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'}`}>
        <ExclamationIcon className="h-5 w-5 mt-0.5 shrink-0" />
        <p className="text-sm font-medium">{message}</p>
    </div>
);

const TransactionRow: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    const category = getCategory(transaction.categoryId);
    const isIncome = transaction.type === 'income';
    const IconComponent = (category && IconMap[category.icon]) ? IconMap[category.icon] : CashIcon;

    return (
        <div className="flex items-center justify-between py-3">
            <div className="flex items-center">
                <div className="p-2 rounded-full" style={{ backgroundColor: `${category?.color || '#9ca3af'}20` }}>
                    <IconComponent className="h-6 w-6" style={{ color: category?.color || '#9ca3af' }} />
                </div>
                <div className="ml-4">
                    <p className="font-medium text-gray-800 dark:text-white">{transaction.description}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        <span>{category?.name || 'Chưa phân loại'}</span>
                        {transaction.type === 'expense' && (
                            <>
                                <span>•</span>
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                    transaction.classification === 'want' 
                                    ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300' 
                                    : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300'
                                }`}>
                                    {transaction.classification === 'want' ? 'Mong muốn' : 'Cần thiết'}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className={`text-right ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
                <p className="font-semibold">{isIncome ? '+' : '-'}{transaction.amount.toLocaleString('vi-VN')} ₫</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(transaction.date).toLocaleDateString()}</p>
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
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions, assets, liabilities, goldenRules, accountFilter, setAccountFilter }) => {
    // Filter transactions based on selected account type
    const filteredTransactions = useMemo(() => {
        return accountFilter === 'all' 
            ? transactions 
            : transactions.filter(t => t.accountType === accountFilter);
    }, [transactions, accountFilter]);

    const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;
    const recentTransactions = [...filteredTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

    // Calc Score
    const calculateScore = () => {
        let score = 0;
        // 1. Cashflow (20pts)
        if (totalIncome > totalExpense) score += 20;
        // 2. Savings Rate (20pts)
        const savingsRate = totalIncome > 0 ? (totalIncome - totalExpense) / totalIncome : 0;
        score += Math.min(savingsRate * 100, 20); 
        // 3. Emergency Fund (20pts)
        const monthlyExpenseAvg = totalExpense; // Simplified for demo
        const cashAssets = assets.filter(a => a.type === 'cash' || a.type === 'investment').reduce((sum, a) => sum + a.value, 0);
        const monthsCovered = monthlyExpenseAvg > 0 ? cashAssets / monthlyExpenseAvg : 0;
        score += Math.min(monthsCovered * 5, 20); // 4 months = 20 pts
        // 4. Debt (20pts)
        const totalDebt = liabilities.reduce((sum, l) => sum + l.amount, 0);
        const debtRatio = totalIncome > 0 ? totalDebt / (totalIncome * 12) : 1;
        score += Math.max(0, 20 - (debtRatio * 20));
        // 5. Discipline (20pts)
        const compliantRules = goldenRules.filter(r => r.isCompliant).length;
        score += (compliantRules / goldenRules.length) * 20;

        return Math.round(score);
    };

    const financialScore = calculateScore();

    // Nudges
    const nudges = [];
    const wantExpense = filteredTransactions.filter(t => t.type === 'expense' && t.classification === 'want').reduce((sum, t) => sum + t.amount, 0);
    const wantRatio = totalExpense > 0 ? wantExpense / totalExpense : 0;

    if (wantRatio > 0.3) nudges.push({ msg: `Chi tiêu cho mong muốn chiếm ${(wantRatio*100).toFixed(0)}% (Khuyến nghị < 30%)`, type: 'warning' });
    if (totalExpense > totalIncome) nudges.push({ msg: "Cảnh báo: Chi tiêu đang vượt quá thu nhập tháng này!", type: 'warning' });
    if (accountFilter === 'business' && filteredTransactions.some(t => t.accountType === 'personal')) nudges.push({msg: "Phát hiện giao dịch cá nhân trong tài khoản kinh doanh.", type: 'warning'});

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                <span className="font-medium text-gray-700 dark:text-gray-300">Chế độ xem:</span>
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button 
                        onClick={() => setAccountFilter('all')}
                        className={`px-4 py-1.5 text-sm rounded-md transition-colors ${accountFilter === 'all' ? 'bg-white dark:bg-gray-600 shadow-sm font-semibold' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                        Tất cả
                    </button>
                    <button 
                        onClick={() => setAccountFilter('personal')}
                        className={`px-4 py-1.5 text-sm rounded-md transition-colors ${accountFilter === 'personal' ? 'bg-white dark:bg-gray-600 shadow-sm font-semibold' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                        Cá nhân
                    </button>
                    <button 
                        onClick={() => setAccountFilter('business')}
                        className={`px-4 py-1.5 text-sm rounded-md transition-colors ${accountFilter === 'business' ? 'bg-white dark:bg-gray-600 shadow-sm font-semibold' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                        Kinh doanh
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Tổng thu nhập" amount={totalIncome} icon={<ArrowUpIcon className="h-6 w-6 text-green-500" />} color="green" />
                <StatCard title="Tổng chi tiêu" amount={totalExpense} icon={<ArrowDownIcon className="h-6 w-6 text-red-500" />} color="red" />
                <StatCard title="Số dư" amount={balance} icon={<CashIcon className="h-6 w-6 text-primary-500" />} color="primary" />
                <ScoreCard score={financialScore} />
            </div>

            {nudges.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {nudges.map((n, idx) => <NudgeCard key={idx} message={n.msg} type={n.type as any} />)}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Xu hướng Thu nhập và Chi tiêu</h3>
                    <div className="h-72">
                         <TrendLineChart data={filteredTransactions} />
                    </div>
                </div>
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Chi tiêu theo Danh mục</h3>
                     <div className="h-72">
                        <ExpensePieChart data={filteredTransactions} categories={CATEGORIES} />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Giao dịch gần đây</h3>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {recentTransactions.length > 0 ? (
                        recentTransactions.map(t => <TransactionRow key={t.id} transaction={t} />)
                    ) : (
                         <p className="text-center text-gray-500 dark:text-gray-400 py-4">Không có giao dịch nào gần đây.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

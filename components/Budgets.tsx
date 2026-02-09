
import React, { useState, useMemo } from 'react';
import { Budget, Category, Transaction } from '../types';
import { IconMap, PlusIcon, XIcon, PencilIcon, ExclamationIcon } from './Icons';
import { Modal } from './Modal';
import { AddBudgetForm } from './AddBudgetForm';

interface BudgetsProps {
    categories?: Category[];
    transactions?: Transaction[];
    budgets?: Budget[];
    setBudgets?: React.Dispatch<React.SetStateAction<Budget[]>>;
}

const BudgetCard: React.FC<{
    budget: Budget;
    categories: Category[];
    spent: number;
    onDelete: (id: string) => void;
    onEdit: (budget: Budget) => void;
}> = ({ budget, categories, spent, onDelete, onEdit }) => {
    const category = categories.find(c => c.id === budget.categoryId);
    const progressRaw = (spent / budget.amount) * 100;
    const progress = Math.min(progressRaw, 100);
    const remaining = budget.amount - spent;
    const isOverBudget = spent > budget.amount;
    const isWarningThreshold = progressRaw >= 80;

    let progressBarColor = 'bg-primary-500 shadow-glow';
    if (progressRaw > 75) progressBarColor = 'bg-amber-500 shadow-glow';
    if (isWarningThreshold) progressBarColor = 'bg-rose-500 shadow-glow';

    const IconComponent = category ? IconMap[category.icon] : null;

    return (
        <div className={`
            bg-slate-900/80 backdrop-blur-md p-6 rounded-[2rem] border transition-all hover:border-luxury-gold/30 group relative shadow-premium
            ${isWarningThreshold
                ? 'border-rose-500/50 ring-4 ring-rose-500/10'
                : 'border-slate-800'}
        `}>
            <div className="absolute top-6 right-6 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                    onClick={() => onEdit(budget)}
                    className="p-2 bg-slate-800 rounded-xl text-slate-400 hover:text-luxury-gold transition-colors border border-slate-700"
                    title="Sửa ngân sách"
                >
                    <PencilIcon className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onDelete(budget.id)}
                    className="p-2 bg-slate-800 rounded-xl text-slate-400 hover:text-rose-500 transition-colors border border-slate-700"
                    title="Xóa ngân sách"
                >
                    <XIcon className="w-4 h-4" />
                </button>
            </div>

            {isWarningThreshold && (
                <div className="absolute -top-3 left-8 bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-glow flex items-center gap-1.5 animate-pulse border border-rose-400/50">
                    <ExclamationIcon className="w-3 h-3" />
                    {isOverBudget ? 'ĐÃ VƯỢT HẠN MỨC!' : 'SẮP CHẠM HẠN MỨC!'}
                </div>
            )}

            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                    <div className="p-4 rounded-2xl border border-white/5" style={{ backgroundColor: `${category?.color || '#14b8a6'}20` }}>
                        {IconComponent && <IconComponent className="h-6 w-6" style={{ color: category?.color }} />}
                    </div>
                    <span className="ml-5 font-black text-lg text-white group-hover:text-luxury-gold transition-colors tracking-tight">{category?.name}</span>
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Hạn mức</div>
                    <div className="font-black text-xl text-white font-mono tracking-tighter">
                        {Math.round(budget.amount).toLocaleString('vi-VN')}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <div className="flex justify-between items-baseline mb-4">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            Tiến độ thực hiện
                        </span>
                        <span className={`text-sm font-black font-mono tracking-tighter ${isWarningThreshold ? 'text-rose-400' : 'text-white'}`}>
                            {progressRaw.toFixed(1)}%
                        </span>
                    </div>
                    <div className="w-full bg-black/40 rounded-full h-2.5 border border-slate-800 shadow-inner overflow-hidden">
                        <div className={`${progressBarColor} h-full rounded-full transition-all duration-1000 ease-out`} style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                <div className="flex justify-between pt-6 border-t border-slate-800/50">
                    <div className="text-left">
                        <div className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Đã dùng</div>
                        <div className={`text-base font-black font-mono tracking-tighter ${isWarningThreshold ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {spent.toLocaleString('vi-VN')}
                        </div>
                    </div>
                    <div className="text-right">
                        {isOverBudget ? (
                            <>
                                <div className="text-[10px] font-black text-rose-500/70 uppercase mb-2 tracking-widest">Vượt quá</div>
                                <div className="text-base font-black text-rose-500 font-mono tracking-tighter">-{Math.abs(remaining).toLocaleString('vi-VN')}</div>
                            </>
                        ) : (
                            <>
                                <div className="text-[10px] font-black text-emerald-500/70 uppercase mb-2 tracking-widest">Còn lại</div>
                                <div className="text-base font-black text-emerald-500 font-mono tracking-tighter">+{remaining.toLocaleString('vi-VN')}</div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Budgets: React.FC<BudgetsProps> = (props) => {
    // Internal state management if props not provided
    const [internalBudgets, setInternalBudgets] = useState<Budget[]>(() => {
        const saved = localStorage.getItem('smartfinance_budgets');
        return saved ? JSON.parse(saved) : [];
    });

    // Sync internal state to localStorage
    React.useEffect(() => {
        if (!props.budgets) {
            localStorage.setItem('smartfinance_budgets', JSON.stringify(internalBudgets));
        }
    }, [internalBudgets, props.budgets]);

    const categories = props.categories ?? [];
    const transactions = props.transactions ?? [];
    const budgets = props.budgets ?? internalBudgets;
    const setBudgets = props.setBudgets ?? setInternalBudgets;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

    const currentMonth = new Date().toISOString().substring(0, 7);

    // Calculate dynamic spent amount for each budget
    const budgetStats = useMemo(() => {
        return budgets.map(budget => {
            const spent = transactions
                .filter(t => t.categoryId === budget.categoryId && t.date.startsWith(currentMonth) && t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);
            return { budget, spent };
        });
    }, [budgets, transactions, currentMonth]);

    const handleAddOrUpdateBudget = (data: Omit<Budget, 'id' | 'spent'>) => {
        if (editingBudget) {
            setBudgets(prev => prev.map(b => b.id === editingBudget.id ? { ...b, ...data } : b));
        } else {
            const newBudget: Budget = {
                id: `budget-${Date.now()}`,
                spent: 0, // Logic above will calculate real-time spent
                ...data
            };
            setBudgets(prev => [...prev, newBudget]);
        }
        setIsModalOpen(false);
        setEditingBudget(null);
    };

    const handleDeleteBudget = (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa ngân sách này?')) {
            setBudgets(prev => prev.filter(b => b.id !== id));
        }
    };

    const handleEditBudget = (budget: Budget) => {
        setEditingBudget(budget);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <Modal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingBudget(null); }}
                title={editingBudget ? "Sửa Ngân sách" : "Thiết lập Ngân sách"}
            >
                <AddBudgetForm
                    categories={categories}
                    existingBudgets={budgets}
                    editingBudget={editingBudget}
                    onSubmit={handleAddOrUpdateBudget}
                    onClose={() => { setIsModalOpen(false); setEditingBudget(null); }}
                />
            </Modal>

            <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900/50 backdrop-blur-md p-6 rounded-[2rem] border border-slate-800 shadow-premium gap-6">
                <div className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] ml-2 text-center md:text-left flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-pulse"></div>
                    Kế hoạch chi tiêu tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full md:w-auto flex items-center justify-center bg-white text-black font-black py-4 px-8 rounded-2xl hover:bg-luxury-gold transition-all duration-500 shadow-luxury uppercase tracking-[0.2em] text-xs shrink-0"
                >
                    <PlusIcon className="h-5 w-5 mr-3" />
                    Thiết lập Ngân sách
                </button>
            </div>

            {budgetStats.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                    {budgetStats.map(({ budget, spent }) => (
                        <BudgetCard
                            key={budget.id}
                            budget={budget}
                            categories={categories}
                            spent={spent}
                            onDelete={handleDeleteBudget}
                            onEdit={handleEditBudget}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center bg-white dark:bg-gray-800 p-20 rounded-2xl shadow-md border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <PlusIcon className="w-8 h-8 text-primary-500" />
                    </div>
                    <h3 className="text-xl font-black mb-2">Chưa có mục tiêu ngân sách</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto text-sm leading-relaxed">
                        Thiết lập ngân sách giúp bạn kiểm soát dòng tiền và đạt được các cột mốc tài chính nhanh hơn.
                        Hệ thống sẽ tự động tính toán chi tiêu của bạn dựa trên giao dịch thực tế.
                    </p>
                </div>
            )}
        </div>
    );
};

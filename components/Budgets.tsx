
import React, { useState, useMemo } from 'react';
import { Budget, Category, Transaction } from '../types';
import { IconMap, PlusIcon, XIcon, PencilIcon, ExclamationIcon } from './Icons';
import { Modal } from './Modal';
import { AddBudgetForm } from './AddBudgetForm';

interface BudgetsProps {
    categories: Category[];
    transactions: Transaction[];
    budgets: Budget[];
    setBudgets: React.Dispatch<React.SetStateAction<Budget[]>>;
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
    
    let progressBarColor = 'bg-primary-500';
    if (progressRaw > 75) progressBarColor = 'bg-yellow-500';
    if (isWarningThreshold) progressBarColor = 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]';

    const IconComponent = category ? IconMap[category.icon] : null;

    return (
        <div className={`
            bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border transition-all hover:shadow-xl group relative
            ${isWarningThreshold 
                ? 'border-red-500 ring-2 ring-red-500/10 dark:ring-red-900/20' 
                : 'border-gray-100 dark:border-gray-700'}
        `}>
            <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button 
                    onClick={() => onEdit(budget)}
                    className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-500 hover:text-primary-500 transition-colors"
                    title="Sửa ngân sách"
                >
                    <PencilIcon className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => onDelete(budget.id)}
                    className="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-500 hover:text-red-500 transition-colors"
                    title="Xóa ngân sách"
                >
                    <XIcon className="w-4 h-4" />
                </button>
            </div>

            {isWarningThreshold && (
                <div className="absolute -top-3 left-6 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 animate-pulse">
                    <ExclamationIcon className="w-3 h-3" />
                    {isOverBudget ? 'Đã vượt hạn mức!' : 'Sắp chạm hạn mức!'}
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <div className="p-3 rounded-2xl" style={{ backgroundColor: `${category?.color || '#14b8a6'}20` }}>
                        {IconComponent && <IconComponent className="h-6 w-6" style={{ color: category?.color }} />}
                    </div>
                    <span className="ml-4 font-black text-lg text-gray-800 dark:text-white group-hover:text-primary-600 transition-colors">{category?.name}</span>
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Hạn mức</div>
                    <div className="font-black text-gray-800 dark:text-white font-mono">{budget.amount.toLocaleString('vi-VN')} ₫</div>
                </div>
            </div>
            <div>
                <div className="flex justify-between items-baseline mb-3">
                    <span className="text-[10px] font-black text-gray-500 uppercase">
                      Tiến độ chi tiêu (Tháng này)
                    </span>
                     <span className={`text-sm font-black font-mono ${isWarningThreshold ? 'text-red-500' : 'text-gray-800 dark:text-white'}`}>
                        {progressRaw.toFixed(0)}%
                     </span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div className={`${progressBarColor} h-2 rounded-full transition-all duration-1000 ease-out`} style={{ width: `${progress}%` }}></div>
                </div>
                <div className="flex justify-between mt-4 pt-4 border-t border-gray-50 dark:border-gray-700">
                    <div className="text-left">
                        <div className="text-[10px] font-black text-gray-400 uppercase mb-1">Đã dùng</div>
                        <div className={`text-sm font-bold ${isWarningThreshold ? 'text-red-500' : 'text-gray-800 dark:text-white'}`}>
                            {spent.toLocaleString('vi-VN')} ₫
                        </div>
                    </div>
                    <div className="text-right">
                        {isOverBudget ? (
                            <>
                                <div className="text-[10px] font-black text-red-400 uppercase mb-1">Vượt quá</div>
                                <div className="text-sm font-black text-red-500">-{Math.abs(remaining).toLocaleString('vi-VN')} ₫</div>
                            </>
                        ) : (
                            <>
                                <div className="text-[10px] font-black text-emerald-400 uppercase mb-1">Còn lại</div>
                                <div className="text-sm font-black text-emerald-500">+{remaining.toLocaleString('vi-VN')} ₫</div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Budgets: React.FC<BudgetsProps> = ({ categories, transactions, budgets, setBudgets }) => {
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

             <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="text-sm font-black text-gray-400 uppercase tracking-widest ml-2">
                    Kế hoạch chi tiêu tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center bg-primary-600 text-white font-bold py-2 px-6 rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-900/10 active:scale-95"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
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

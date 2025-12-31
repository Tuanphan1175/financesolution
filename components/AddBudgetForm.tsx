
import React, { useState, useEffect } from 'react';
import { Budget, Category } from '../types';

interface AddBudgetFormProps {
    categories: Category[];
    existingBudgets: Budget[];
    editingBudget: Budget | null;
    onSubmit: (data: Omit<Budget, 'id' | 'spent'>) => void;
    onClose: () => void;
}

export const AddBudgetForm: React.FC<AddBudgetFormProps> = ({ 
    categories, 
    existingBudgets, 
    editingBudget, 
    onSubmit, 
    onClose 
}) => {
    const [categoryId, setCategoryId] = useState(editingBudget?.categoryId || '');
    const [amount, setAmount] = useState(editingBudget?.amount.toString() || '');
    
    // Dates for current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    // Only allow categories that don't already have a budget (except the one being edited)
    const availableCategories = categories.filter(cat => 
        cat.type === 'expense' && 
        (!existingBudgets.some(b => b.categoryId === cat.id) || cat.id === editingBudget?.categoryId)
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryId || !amount) return;

        onSubmit({
            categoryId,
            amount: parseFloat(amount),
            startDate: startOfMonth,
            endDate: endOfMonth
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-xs font-black text-gray-500 uppercase mb-2 tracking-widest">Danh mục chi tiêu</label>
                <select 
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 outline-none font-bold text-sm"
                >
                    <option value="" disabled>-- Chọn danh mục --</option>
                    {availableCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
                {availableCategories.length === 0 && !editingBudget && (
                    <p className="text-[10px] text-red-500 mt-2 font-bold italic">
                        Tất cả danh mục chi tiêu hiện tại đều đã được thiết lập ngân sách.
                    </p>
                )}
            </div>

            <div>
                <label className="block text-xs font-black text-gray-500 uppercase mb-2 tracking-widest">Hạn mức chi tiêu (₫)</label>
                <div className="relative">
                    <input 
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="VD: 5.000.000"
                        required
                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 outline-none font-black font-mono text-lg"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">VND</div>
                </div>
            </div>

            <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800">
                <p className="text-[11px] text-primary-700 dark:text-primary-300 leading-relaxed italic">
                    <span className="font-black uppercase mr-1">Lưu ý:</span> 
                    Ngân sách này sẽ được áp dụng cho chu kỳ tháng hiện tại ({new Date().getMonth() + 1}/{new Date().getFullYear()}). 
                    Hệ thống sẽ tự động tổng hợp chi phí từ các giao dịch của bạn.
                </p>
            </div>

            <div className="flex gap-3 pt-4 border-t dark:border-gray-700">
                <button 
                    type="button" 
                    onClick={onClose}
                    className="flex-1 py-3 text-sm font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 transition-all"
                >
                    Hủy
                </button>
                <button 
                    type="submit"
                    className="flex-[2] py-3 bg-primary-600 text-white text-sm font-black rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-900/10 transition-all uppercase tracking-widest active:scale-95"
                >
                    {editingBudget ? 'Cập nhật ngân sách' : 'Lưu ngân sách'}
                </button>
            </div>
        </form>
    );
};

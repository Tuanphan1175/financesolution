import React from 'react';
import { BUDGETS, CATEGORIES } from '../constants';
import { Budget, Category } from '../types';
import { IconMap, PlusIcon } from './Icons';

const getCategory = (id: string): Category | undefined => CATEGORIES.find(c => c.id === id);

const BudgetCard: React.FC<{ budget: Budget }> = ({ budget }) => {
    const category = getCategory(budget.categoryId);
    const progress = Math.min((budget.spent / budget.amount) * 100, 100);
    const remaining = budget.amount - budget.spent;
    const isOverBudget = progress >= 100;
    
    let progressBarColor = 'bg-primary-500';
    if (progress > 75) progressBarColor = 'bg-yellow-500';
    if (isOverBudget) progressBarColor = 'bg-red-500';

    const IconComponent = category ? IconMap[category.icon] : null;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    {IconComponent && <IconComponent className="h-8 w-8" style={{ color: category?.color }} />}
                    <span className="ml-3 font-semibold text-lg text-gray-800 dark:text-white">{category?.name}</span>
                </div>
                <div className="font-bold text-gray-800 dark:text-white">{budget.amount.toLocaleString('vi-VN')} ₫</div>
            </div>
            <div>
                <div className="flex justify-between items-baseline mb-1">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Đã chi: <span className="font-bold">{budget.spent.toLocaleString('vi-VN')} ₫</span>
                    </span>
                     <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{progress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className={`${progressBarColor} h-2.5 rounded-full`} style={{ width: `${progress}%` }}></div>
                </div>
                <div className="text-right mt-2 text-sm">
                    {isOverBudget ? (
                        <span className="font-medium text-red-500">{Math.abs(remaining).toLocaleString('vi-VN')} ₫ vượt ngân sách</span>
                    ) : (
                        <span className="font-medium text-gray-500 dark:text-gray-400">{remaining.toLocaleString('vi-VN')} ₫ còn lại</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export const Budgets: React.FC = () => {
    return (
        <div className="space-y-6">
             <div className="flex justify-end">
                <button className="flex items-center bg-primary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600 transition duration-300">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Tạo Ngân sách
                </button>
            </div>
            {BUDGETS.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {BUDGETS.map(budget => <BudgetCard key={budget.id} budget={budget} />)}
                </div>
            ) : (
                 <div className="text-center bg-white dark:bg-gray-800 p-10 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Chưa có Ngân sách</h3>
                    <p className="text-gray-500 dark:text-gray-400">Tạo một ngân sách để bắt đầu theo dõi mục tiêu chi tiêu của bạn.</p>
                </div>
            )}
        </div>
    );
};

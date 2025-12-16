
import React, { useState, useMemo } from 'react';
import { TRANSACTIONS, CATEGORIES } from '../constants';
import { Transaction, Category, TransactionType, SpendingClassification } from '../types';
import { IconMap, PlusIcon, FilterIcon, CashIcon } from './Icons';
import { Modal } from './Modal';
import { AddTransactionForm } from './AddTransactionForm';

const getCategory = (id: string): Category | undefined => CATEGORIES.find(c => c.id === id);

const TransactionRow: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    const category = getCategory(transaction.categoryId);
    const isIncome = transaction.type === 'income';
    // Ensure we have a valid icon component, fallback to CashIcon if category or icon is missing
    const IconComponent = (category && IconMap[category.icon]) ? IconMap[category.icon] : CashIcon;

    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="p-2 rounded-full" style={{ backgroundColor: `${category?.color || '#9ca3af'}20` }}>
                         <IconComponent className="h-6 w-6" style={{ color: category?.color || '#9ca3af' }} />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{transaction.description}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{category?.name || 'Chưa phân loại'}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-center">
                {transaction.type === 'expense' && (
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.classification === 'need' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                        {transaction.classification === 'need' ? 'Cần thiết' : 'Mong muốn'}
                    </span>
                )}
                 {transaction.type === 'income' && (
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        Thu nhập
                    </span>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {new Date(transaction.date).toLocaleDateString('vi-VN')}
            </td>
            <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
                {isIncome ? '+' : '-'}{transaction.amount.toLocaleString('vi-VN')} ₫
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                {transaction.paymentMethod === 'cash' ? 'Tiền mặt' : transaction.paymentMethod === 'credit_card' ? 'Thẻ tín dụng' : 'Chuyển khoản'}
            </td>
        </tr>
    );
}

export const Transactions: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>(TRANSACTIONS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [filterClassification, setFilterClassification] = useState<'all' | SpendingClassification>('all');

    const handleAddTransaction = (newTransactionData: Omit<Transaction, 'id'>) => {
        const newTransaction: Transaction = {
            id: `trans-${Date.now()}`,
            ...newTransactionData,
        };
        setTransactions(prev => [newTransaction, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setIsModalOpen(false);
    };

    const filteredTransactions = useMemo(() => {
        return transactions
            .filter(t => filterType === 'all' || t.type === filterType)
            .filter(t => filterCategory === 'all' || t.categoryId === filterCategory)
            .filter(t => filterClassification === 'all' || t.classification === filterClassification);
    }, [transactions, filterType, filterCategory, filterClassification]);
    
    const availableFilterCategories = useMemo(() => {
        if (filterType === 'all') return CATEGORIES;
        return CATEGORIES.filter(c => c.type === filterType);
    }, [filterType]);

    return (
        <div className="space-y-6">
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Thêm Giao dịch mới">
                <AddTransactionForm 
                    onAddTransaction={handleAddTransaction}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-wrap items-center gap-4">
                     <div className="flex items-center text-gray-500">
                        <FilterIcon className="h-6 w-6 mr-2" />
                        <span className="hidden md:inline font-medium">Bộ lọc:</span>
                     </div>
                     <select 
                        value={filterType} 
                        onChange={e => { setFilterType(e.target.value as any); setFilterCategory('all'); }}
                        className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="all">Tất cả Loại</option>
                        <option value="income">Thu nhập</option>
                        <option value="expense">Chi tiêu</option>
                    </select>
                    <select 
                        value={filterCategory} 
                        onChange={e => setFilterCategory(e.target.value)}
                        className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="all">Tất cả Danh mục</option>
                        {availableFilterCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <select 
                        value={filterClassification} 
                        onChange={e => setFilterClassification(e.target.value as any)}
                        className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 text-sm focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="all">Tất cả Phân loại</option>
                        <option value="need">Cần thiết (Need)</option>
                        <option value="want">Mong muốn (Want)</option>
                    </select>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center bg-primary-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-600 transition duration-300 w-full md:w-auto"
                >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Thêm Giao dịch
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mô tả</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phân loại</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ngày</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Số tiền</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phương thức</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map(t => <TransactionRow key={t.id} transaction={t} />)
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center text-gray-500 dark:text-gray-400 py-10">Không có giao dịch nào phù hợp.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

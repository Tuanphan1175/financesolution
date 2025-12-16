
import React, { useState } from 'react';
import { Transaction, TransactionType, PaymentMethod, AccountType, SpendingClassification } from '../types';
import { CATEGORIES } from '../constants';

interface AddTransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onClose: () => void;
}

export const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ onAddTransaction, onClose }) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [accountType, setAccountType] = useState<AccountType>('personal');
  const [classification, setClassification] = useState<SpendingClassification>('need');

  const availableCategories = CATEGORIES.filter(c => c.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !categoryId || !date) {
      alert("Vui lòng điền đầy đủ các trường.");
      return;
    }

    const newTransaction: Omit<Transaction, 'id'> = {
      amount: parseFloat(amount),
      description,
      categoryId,
      date,
      paymentMethod,
      type,
      accountType,
      classification
    };
    onAddTransaction(newTransaction);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Transaction Type Toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Loại giao dịch</label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <button type="button" onClick={() => { setType('expense'); setCategoryId(''); }} className={`px-4 py-2 rounded-l-md w-full border ${type === 'expense' ? 'bg-red-500 text-white border-red-500' : 'bg-white dark:bg-gray-700 dark:border-gray-600'}`}>Chi tiêu</button>
          <button type="button" onClick={() => { setType('income'); setCategoryId(''); }} className={`px-4 py-2 rounded-r-md w-full border ${type === 'income' ? 'bg-green-500 text-white border-green-500' : 'bg-white dark:bg-gray-700 dark:border-gray-600'}`}>Thu nhập</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ví tài khoản</label>
            <select value={accountType} onChange={e => setAccountType(e.target.value as AccountType)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 p-2 border">
                <option value="personal">Cá nhân</option>
                <option value="business">Kinh doanh</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phân loại (Need/Want)</label>
            <select value={classification} onChange={e => setClassification(e.target.value as SpendingClassification)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 p-2 border">
                <option value="need">Cần thiết (Need)</option>
                <option value="want">Mong muốn (Want)</option>
            </select>
          </div>
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Số tiền</label>
        <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 p-2 border" required />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mô tả</label>
        <input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 p-2 border" required />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Danh mục</label>
        <select id="category" value={categoryId} onChange={e => setCategoryId(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 p-2 border" required>
          <option value="" disabled>Chọn một danh mục</option>
          {availableCategories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ngày</label>
        <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 p-2 border" required />
      </div>
      <div>
        <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phương thức thanh toán</label>
        <select id="paymentMethod" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as PaymentMethod)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 p-2 border" required>
          <option value="credit_card">Thẻ tín dụng</option>
          <option value="cash">Tiền mặt</option>
          <option value="bank_transfer">Chuyển khoản</option>
        </select>
      </div>
      <div className="flex justify-end pt-4 space-x-2">
        <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">Hủy</button>
        <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">Thêm giao dịch</button>
      </div>
    </form>
  );
};

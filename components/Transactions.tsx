import React, { useState, useMemo } from 'react';
import { Transaction, Category, TransactionType, SpendingClassification } from '../types';
import { IconMap, PlusIcon, FilterIcon, CashIcon, SparklesIcon, CogIcon, SaveDiskIcon } from './Icons';
import { Modal } from './Modal';
import { AddTransactionForm } from './AddTransactionForm';

interface TransactionsProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  categories: Category[];
  onAddCategory: (cat: Category) => void;
  onUpdateCategory: (cat: Category) => void;
}

const TransactionRow: React.FC<{
  transaction: Transaction;
  categories: Category[];
  onEdit: (t: Transaction) => void;
}> = ({ transaction, categories, onEdit }) => {
  const category = categories.find((c) => c.id === transaction.categoryId);
  const isIncome = transaction.type === 'income';
  const IconComponent = category && IconMap[category.icon] ? IconMap[category.icon] : CashIcon;

  return (
    <tr className="hover:bg-slate-800/40 transition-all group border-b border-slate-800/50">
      <td className="px-8 py-6 whitespace-nowrap">
        <div className="flex items-center">
          <div
            className="p-4 rounded-2xl shadow-lg border border-white/5 group-hover:scale-110 transition-transform"
            style={{ backgroundColor: `${category?.color || '#9ca3af'}20` }}
          >
            <IconComponent className="h-6 w-6" style={{ color: category?.color || '#9ca3af' }} />
          </div>
          <div className="ml-5">
            <div className="text-[15px] font-black text-white tracking-tight leading-none mb-2">
              {transaction.description}
            </div>
            <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
              {category?.name || 'Khác'}
            </div>
          </div>
        </div>
      </td>

      <td className="px-8 py-6 whitespace-nowrap text-center">
        {transaction.type === 'expense' ? (
          <span
            className={`px-3 py-1 text-[9px] font-black uppercase rounded-lg border ${
              transaction.classification === 'need'
                ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10'
                : 'text-rose-400 border-rose-500/20 bg-rose-500/10'
            }`}
          >
            {transaction.classification === 'need' ? 'CẦN THIẾT' : 'MONG MUỐN'}
          </span>
        ) : (
          <span className="px-3 py-1 text-[9px] font-black uppercase rounded-lg border text-primary-400 border-primary-500/20 bg-primary-500/10">
            THU NHẬP
          </span>
        )}
      </td>

      <td className="px-8 py-6 whitespace-nowrap text-[12px] font-bold text-slate-500 uppercase tracking-widest">
        {new Date(transaction.date).toLocaleDateString('vi-VN')}
      </td>

      <td className={`px-8 py-6 whitespace-nowrap text-right ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
        <div className="text-xl font-black font-mono tracking-tighter">
          {isIncome ? '+' : '-'}
          {transaction.amount.toLocaleString('vi-VN')} ₫
        </div>
        <div className="text-[10px] text-slate-500 font-black mt-1 uppercase tracking-widest">
          {transaction.paymentMethod === 'cash'
            ? 'TIỀN MẶT'
            : transaction.paymentMethod === 'credit_card'
            ? 'THẺ TÍN DỤNG'
            : 'CHUYỂN KHOẢN'}
        </div>
      </td>

      <td className="px-8 py-6 whitespace-nowrap text-right">
        <button
          onClick={() => onEdit(transaction)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-2xl border border-slate-700 bg-black/30 text-slate-200 hover:text-black hover:bg-luxury-gold transition-all font-black uppercase tracking-[0.2em] text-[10px] active:scale-95"
          title="Chỉnh sửa giao dịch"
        >
          <CogIcon className="w-4 h-4" />
          Sửa
        </button>
      </td>
    </tr>
  );
};

export const Transactions: React.FC<TransactionsProps> = ({
  transactions,
  setTransactions,
  categories,
  onAddCategory,
  onUpdateCategory,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterClassification, setFilterClassification] = useState<'all' | SpendingClassification>('all');

  const openCreate = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const openEdit = (t: Transaction) => {
    setEditingTransaction(t);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleAddTransaction = (newTransactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      id: `trans-${Date.now()}`,
      ...newTransactionData,
    };
    setTransactions((prev) =>
      [newTransaction, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
    closeModal();
  };

  const handleUpdateTransaction = (id: string, updatedData: Omit<Transaction, 'id'>) => {
    setTransactions((prev) =>
      prev
        .map((t) => (t.id === id ? { id, ...updatedData } : t))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
    closeModal();
  };

  const handleDeleteTransaction = (id: string) => {
    const ok = window.confirm('Xoá giao dịch này? Hành động này không thể hoàn tác.');
    if (!ok) return;
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    closeModal();
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      alert('Không có dữ liệu để xuất!');
      return;
    }
    const headers = ['ID', 'Mô tả', 'Danh mục', 'Số tiền', 'Loại', 'Ngày', 'Ví', 'Phân loại', 'Phương thức'];
    const rows = transactions.map((t) => {
      const category = categories.find((c) => c.id === t.categoryId);
      return [
        t.id,
        `"${t.description.replace(/"/g, '""')}"`,
        category?.name || '?',
        t.amount,
        t.type,
        t.date,
        t.accountType,
        t.classification,
        t.paymentMethod,
      ].join(',');
    });
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n'); // BOM for Excel
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `lich-su-giao-dich-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => filterType === 'all' || t.type === filterType)
      .filter((t) => filterCategory === 'all' || t.categoryId === filterCategory)
      .filter((t) => filterClassification === 'all' || t.classification === filterClassification);
  }, [transactions, filterType, filterCategory, filterClassification]);

  const availableFilterCategories = useMemo(() => {
    if (filterType === 'all') return categories;
    return categories.filter((c) => c.type === filterType);
  }, [filterType, categories]);

  return (
    <div className="space-y-10">
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingTransaction ? 'CHỈNH SỬA GIAO DỊCH' : 'THÊM GIAO DỊCH'}
        contentClassName="fixed inset-0 z-40 h-[100dvh] overflow-y-auto bg-gray-900 pt-24 pb-48 px-4"
      >
        <AddTransactionForm
          initialTransaction={editingTransaction}
          onAddTransaction={handleAddTransaction}
          onUpdateTransaction={handleUpdateTransaction}
          onDeleteTransaction={handleDeleteTransaction}
          onClose={closeModal}
          categories={categories}
          onAddCategory={onAddCategory}
          onUpdateCategory={onUpdateCategory}
        />
      </Modal>

      {/* Quick Actions & Filters */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 w-full space-y-6">
          <div className="bg-slate-900/80 backdrop-blur-md p-6 rounded-[2rem] border border-slate-800 shadow-premium flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-wrap items-center gap-4 w-full">
              <div className="flex items-center text-slate-500 mr-2">
                <FilterIcon className="h-5 w-5 mr-3 text-luxury-gold" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">BỘ LỌC CHIẾN LƯỢC</span>
              </div>

              <div className="grid grid-cols-2 md:flex gap-3 w-full md:w-auto">
                <select
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value as any);
                    setFilterCategory('all');
                  }}
                  className="bg-black/40 border border-slate-800 text-white rounded-xl p-3 text-[11px] font-black uppercase tracking-widest outline-none focus:border-luxury-gold appearance-none px-6"
                >
                  <option value="all">TẤT CẢ LOẠI</option>
                  <option value="income">THU NHẬP</option>
                  <option value="expense">CHI TIÊU</option>
                </select>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-black/40 border border-slate-800 text-white rounded-xl p-3 text-[11px] font-black uppercase tracking-widest outline-none focus:border-luxury-gold appearance-none px-6"
                >
                  <option value="all">DANH MỤC</option>
                  {availableFilterCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={handleExportCSV}
                className="flex-1 lg:flex-none flex items-center justify-center bg-slate-800 text-luxury-gold font-black py-4 px-6 rounded-2xl hover:bg-slate-700 transition-all duration-500 border border-slate-700 shadow-luxury uppercase tracking-[0.2em] text-[10px] active:scale-95"
                title="Xuất toàn bộ lịch sử ra CSV"
              >
                <SaveDiskIcon className="h-5 w-5 mr-3" />
                Lưu & Xuất
              </button>

              <button
                onClick={openCreate}
                className="flex-[2] lg:flex-none flex items-center justify-center bg-white text-black font-black py-4 px-8 rounded-2xl hover:bg-luxury-gold transition-all duration-500 shadow-luxury uppercase tracking-[0.2em] text-xs active:scale-95 shrink-0"
              >
                <PlusIcon className="h-5 w-5 mr-3" />
                Ghi chép mới
              </button>
            </div>
          </div>

          <div className="bg-slate-900/90 rounded-[2.5rem] shadow-premium border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-black/20 border-b border-slate-800">
                  <tr>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                      Nội dung
                    </th>
                    <th className="px-8 py-5 text-center text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                      Phân loại
                    </th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                      Ngày tháng
                    </th>
                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                      Dòng tiền (VND)
                    </th>
                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                      Hành động
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800/50">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((t) => (
                      <TransactionRow key={t.id} transaction={t} categories={categories} onEdit={openEdit} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center text-slate-600 font-bold py-32 italic uppercase tracking-widest">
                        <div className="flex flex-col items-center gap-4">
                          <SparklesIcon className="w-12 h-12 opacity-20" />
                          <span>Không tìm thấy dữ liệu phù hợp.</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Categories Management Panel (giữ nguyên như Bác đang có) */}
        <div className="w-full lg:w-96 space-y-6 shrink-0">
          <div className="bg-gradient-to-br from-slate-900 to-black p-8 rounded-[2.5rem] border border-luxury-gold/20 shadow-luxury">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-luxury-gold/10 rounded-lg">
                  <CogIcon className="w-5 h-5 text-luxury-gold" />
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Quản lý Hũ</h3>
              </div>
              <button
                onClick={openCreate}
                className="p-2 rounded-full border border-slate-800 text-luxury-gold hover:bg-luxury-gold hover:text-black transition-all"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1 mb-4">Danh mục hiện tại</p>
              {categories.map((cat) => {
                const Icon = IconMap[cat.icon] || CashIcon;
                return (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-black/30 border border-slate-800 hover:border-slate-700 group transition-all"
                  >
                    <div className="flex items-center">
                      <div className="p-2.5 rounded-xl mr-4" style={{ backgroundColor: `${cat.color}15` }}>
                        <Icon className="w-5 h-5" style={{ color: cat.color }} />
                      </div>
                      <div>
                        <p className="text-[13px] font-black text-white tracking-tight">{cat.name}</p>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                          {cat.type === 'income' ? 'Thu nhập' : 'Chi tiêu'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-slate-600 hover:text-luxury-gold p-1">
                        <CogIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-800/50">
              <p className="text-[11px] text-slate-500 leading-relaxed italic text-center px-4 font-medium">
                "Bạn có thể tự do định nghĩa các danh mục để phù hợp nhất với cấu trúc tài chính cá nhân."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

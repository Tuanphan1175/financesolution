import React, { useEffect, useMemo, useState } from 'react';
import {
  Transaction,
  TransactionType,
  PaymentMethod,
  AccountType,
  SpendingClassification,
  Category,
} from '../types';
import { IconMap, PlusIcon, XIcon, CogIcon, SparklesIcon, ArrowUpIcon } from './Icons';

interface AddTransactionFormProps {
  // ADD
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;

  // EDIT (optional)
  initialTransaction?: Transaction | null;
  onUpdateTransaction?: (transaction: Transaction) => void;
  onDeleteTransaction?: (id: string) => void;

  onClose: () => void;

  // Categories
  categories: Category[];
  onAddCategory: (cat: Category) => void;
  onUpdateCategory: (cat: Category) => void;
}

const PRESET_COLORS = [
  '#C5A059',
  '#10b981',
  '#ef4444',
  '#3b82f6',
  '#8b5cf6',
  '#f59e0b',
  '#ec4899',
  '#14b8a6',
  '#6366f1',
  '#94a3b8',
];

type FormMode = 'transaction' | 'add_category' | 'edit_category';

export const AddTransactionForm: React.FC<AddTransactionFormProps> = ({
  onAddTransaction,
  initialTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
  onClose,
  categories,
  onAddCategory,
  onUpdateCategory,
}) => {
  const isEdit = !!initialTransaction?.id;

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [accountType, setAccountType] = useState<AccountType>('personal');
  const [classification, setClassification] = useState<SpendingClassification>('need');

  // Mode management
  const [formMode, setFormMode] = useState<FormMode>('transaction');

  // State for new/edit category
  const [catName, setCatName] = useState('');
  const [catColor, setCatColor] = useState(PRESET_COLORS[0]);
  const [catIcon, setCatIcon] = useState('ChartPie');
  const [catDefaultClass, setCatDefaultClass] = useState<SpendingClassification>('need');

  const availableCategories = useMemo(
    () => categories.filter(c => c.type === type),
    [categories, type]
  );

  // Prefill when edit
  useEffect(() => {
    if (!initialTransaction) return;

    setType(initialTransaction.type);
    setAmount(String(initialTransaction.amount ?? ''));
    setDescription(initialTransaction.description ?? '');
    setCategoryId(initialTransaction.categoryId ?? '');
    setDate((initialTransaction.date ?? new Date().toISOString().split('T')[0]).split('T')[0]);

    setPaymentMethod(initialTransaction.paymentMethod ?? 'credit_card');
    setAccountType(initialTransaction.accountType ?? 'personal');

    setClassification(
      initialTransaction.type === 'income'
        ? 'need'
        : (initialTransaction.classification ?? 'need')
    );

    setFormMode('transaction');
  }, [initialTransaction]);

  // Handle smart classification flipping (when user changes category)
  useEffect(() => {
    if (!categoryId || categoryId === 'NEW_CAT') return;

    const selectedCat = categories.find(c => c.id === categoryId);
    if (selectedCat?.defaultClassification) {
      // Chỉ áp dụng defaultClassification cho CHI TIÊU
      if (type === 'expense') setClassification(selectedCat.defaultClassification);
    }
  }, [categoryId, categories, type]);

  const handleStartAddCategory = () => {
    setCatName('');
    setCatColor(PRESET_COLORS[0]);
    setCatIcon('ChartPie');
    setCatDefaultClass('need');
    setFormMode('add_category');
  };

  const handleStartEditCategory = () => {
    if (!categoryId || categoryId === 'NEW_CAT') return;

    const selectedCat = categories.find(c => c.id === categoryId);
    if (!selectedCat) return;

    setCatName(selectedCat.name);
    setCatColor(selectedCat.color);
    setCatIcon(selectedCat.icon);
    setCatDefaultClass(selectedCat.defaultClassification || 'need');
    setFormMode('edit_category');
  };

  const handleSaveCategory = () => {
    const name = catName.trim();
    if (!name) return;

    if (formMode === 'add_category') {
      const newId = `cat-custom-${Date.now()}`;
      const newCat: Category = {
        id: newId,
        name,
        type,
        icon: catIcon,
        color: catColor,
        defaultClassification: catDefaultClass,
      };
      onAddCategory(newCat);
      setCategoryId(newId);
    }

    if (formMode === 'edit_category' && categoryId && categoryId !== 'NEW_CAT') {
      const updatedCat: Category = {
        id: categoryId,
        name,
        type,
        icon: catIcon,
        color: catColor,
        defaultClassification: catDefaultClass,
      };
      onUpdateCategory(updatedCat);
    }

    setFormMode('transaction');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formMode !== 'transaction') return;

    if (!amount || !description || !categoryId || categoryId === 'NEW_CAT' || !date) {
      alert('Vui lòng điền đầy đủ các trường.');
      return;
    }

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      alert('Số tiền không hợp lệ.');
      return;
    }

    const payload: Omit<Transaction, 'id'> = {
      amount: parsedAmount,
      description: description.trim(),
      categoryId,
      date,
      paymentMethod,
      type,
      accountType,
      classification: type === 'income' ? 'need' : classification,
    };

    // EDIT
    if (isEdit && initialTransaction && onUpdateTransaction) {
      onUpdateTransaction({ ...initialTransaction, ...payload });
      onClose();
      return;
    }

    // ADD
    onAddTransaction(payload);
  };

  // CATEGORY MODE UI
  if (formMode !== 'transaction') {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex justify-between items-center border-b border-slate-700 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-luxury-gold/20 rounded-lg">
              <SparklesIcon className="w-5 h-5 text-luxury-gold" />
            </div>
            <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">
              {formMode === 'add_category' ? 'Tạo Danh Mục Tùy Chỉnh' : 'Cập Nhật Danh Mục'}
            </h4>
          </div>
          <button
            type="button"
            onClick={() => setFormMode('transaction')}
            className="text-slate-500 hover:text-rose-500 transition-colors p-1"
            title="Đóng"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">
              Tên danh mục
            </label>
            <input
              type="text"
              value={catName}
              onChange={e => setCatName(e.target.value)}
              className="w-full p-4 rounded-2xl bg-black/40 border border-slate-800 text-white text-base font-bold focus:border-luxury-gold outline-none transition-all"
              placeholder="Nhập tên danh mục..."
              autoFocus
            />
          </div>

          {type === 'expense' && (
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">
                Thiết lập mặc định
              </label>
              <div className="flex bg-black/40 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setCatDefaultClass('need')}
                  className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${
                    catDefaultClass === 'need'
                      ? 'bg-luxury-gold text-black shadow-glow'
                      : 'text-slate-500'
                  }`}
                >
                  Cần thiết
                </button>
                <button
                  type="button"
                  onClick={() => setCatDefaultClass('want')}
                  className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${
                    catDefaultClass === 'want'
                      ? 'bg-luxury-gold text-black shadow-glow'
                      : 'text-slate-500'
                  }`}
                >
                  Mong muốn
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <span className="text-[10px] font-black text-slate-500 uppercase block mb-4 tracking-widest">
                Bảng màu sắc
              </span>
              <div className="flex flex-wrap gap-3">
                {PRESET_COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCatColor(c)}
                    className={`w-7 h-7 rounded-full transition-all duration-300 transform ${
                      catColor === c
                        ? 'scale-125 border-2 border-white ring-2 ring-luxury-gold shadow-glow'
                        : 'opacity-40 hover:opacity-100 hover:scale-110'
                    }`}
                    style={{ backgroundColor: c }}
                    aria-label={`Màu ${c}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-black text-slate-500 uppercase block mb-4 tracking-widest">
                Biểu tượng
              </span>
              <div className="flex flex-wrap gap-2.5">
                {Object.keys(IconMap).map(iconName => {
                  const Icon = IconMap[iconName];
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setCatIcon(iconName)}
                      className={`p-2.5 rounded-xl border transition-all ${
                        catIcon === iconName
                          ? 'bg-luxury-gold text-black border-luxury-gold shadow-glow'
                          : 'bg-black/40 text-slate-500 border-slate-800 hover:border-luxury-gold/50'
                      }`}
                      title={iconName}
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={() => setFormMode('transaction')}
            className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSaveCategory}
            className="flex-[2] py-4 bg-white text-black text-xs font-black rounded-2xl hover:bg-luxury-gold shadow-premium transition-all uppercase tracking-[0.2em]"
          >
            {formMode === 'add_category' ? 'Kích hoạt danh mục' : 'Cập nhật ngay'}
          </button>
        </div>
      </div>
    );
  }

  // TRANSACTION MODE UI
  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-center">
        <div className="flex p-1.5 bg-black/40 rounded-2xl border border-slate-800 w-full max-sm shadow-inner">
          <button
            type="button"
            onClick={() => {
              setType('expense');
              setCategoryId('');
              setClassification('need');
            }}
            className={`flex-1 py-3 rounded-xl transition-all text-xs font-black uppercase tracking-widest ${
              type === 'expense'
                ? 'bg-rose-500 text-white shadow-lg'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Chi tiêu
          </button>
          <button
            type="button"
            onClick={() => {
              setType('income');
              setCategoryId('');
              setClassification('need');
            }}
            className={`flex-1 py-3 rounded-xl transition-all text-xs font-black uppercase tracking-widest ${
              type === 'income'
                ? 'bg-emerald-500 text-white shadow-lg'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Thu nhập
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">
            Tài khoản nguồn
          </label>
          <select
            value={accountType}
            onChange={e => setAccountType(e.target.value as AccountType)}
            className="w-full bg-black/40 border border-slate-800 text-white rounded-2xl p-4 text-sm font-bold focus:border-luxury-gold outline-none appearance-none cursor-pointer shadow-inner"
          >
            <option value="personal">Ví Cá Nhân</option>
            <option value="business">Ví Kinh Doanh</option>
          </select>
        </div>

        {type === 'expense' && (
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">
              Mức độ cần thiết
            </label>
            <div className="flex bg-black/40 p-1 rounded-2xl border border-slate-800 h-[52px]">
              <button
                type="button"
                onClick={() => setClassification('need')}
                className={`flex-1 rounded-xl text-[10px] font-black uppercase transition-all ${
                  classification === 'need'
                    ? 'bg-emerald-500 text-white shadow-glow'
                    : 'text-slate-500'
                }`}
              >
                Thiết yếu (Need)
              </button>
              <button
                type="button"
                onClick={() => setClassification('want')}
                className={`flex-1 rounded-xl text-[10px] font-black uppercase transition-all ${
                  classification === 'want'
                    ? 'bg-rose-500 text-white shadow-glow'
                    : 'text-slate-500'
                }`}
              >
                Mong muốn (Want)
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">
            Số tiền giao dịch (₫)
          </label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-full bg-black/40 border border-slate-800 text-white rounded-2xl p-4 text-2xl font-black font-mono focus:border-luxury-gold outline-none shadow-inner placeholder-slate-800"
            placeholder="0"
            required
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">
            Thời gian
          </label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full bg-black/40 border border-slate-800 text-white rounded-2xl p-4 text-sm font-bold focus:border-luxury-gold outline-none appearance-none cursor-pointer"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">
          Nội dung chi tiết
        </label>
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full bg-black/40 border border-slate-800 text-white rounded-2xl p-4 text-base font-bold focus:border-luxury-gold outline-none shadow-inner"
          placeholder="VD: Mua quà tặng, Thanh toán hóa đơn..."
          required
        />
      </div>

      <div>
        <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">
          Phân loại danh mục
        </label>

        <div className="flex gap-3">
          <div className="relative flex-1 group">
            <select
              value={categoryId}
              onChange={e => {
                if (e.target.value === 'NEW_CAT') {
                  handleStartAddCategory();
                  return;
                }
                setCategoryId(e.target.value);
              }}
              className="w-full bg-black/40 border border-slate-800 text-white rounded-2xl p-4 text-base font-black focus:border-luxury-gold outline-none appearance-none cursor-pointer group-hover:border-slate-700 transition-all"
              required
            >
              <option value="" disabled>
                -- Chọn một danh mục --
              </option>

              {availableCategories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}

              <option value="NEW_CAT" className="text-luxury-gold font-black italic">
                ⊕ Nhập danh mục tùy chỉnh...
              </option>
            </select>

            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
              <ArrowUpIcon className="w-4 h-4 rotate-180" />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={!categoryId || categoryId === 'NEW_CAT'}
              onClick={handleStartEditCategory}
              className={`p-4 rounded-2xl border transition-all ${
                categoryId && categoryId !== 'NEW_CAT'
                  ? 'bg-slate-900 border-slate-800 text-luxury-gold hover:border-luxury-gold'
                  : 'opacity-20 cursor-not-allowed border-slate-800 text-slate-600'
              }`}
              title="Chỉnh sửa danh mục"
            >
              <CogIcon className="h-6 w-6" />
            </button>

            <button
              type="button"
              onClick={handleStartAddCategory}
              className="p-4 rounded-2xl border bg-black/40 border-slate-800 text-slate-500 hover:text-luxury-gold hover:border-luxury-gold/50 transition-all"
              title="Tạo danh mục mới"
            >
              <PlusIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-black text-slate-500 uppercase mb-3 tracking-widest">
          Phương thức thanh toán
        </label>

        <div className="grid grid-cols-3 gap-3">
          {(['credit_card', 'cash', 'bank_transfer'] as const).map(method => (
            <button
              key={method}
              type="button"
              onClick={() => setPaymentMethod(method)}
              className={`py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                paymentMethod === method
                  ? 'bg-white text-black border-white shadow-glow'
                  : 'bg-black/40 text-slate-500 border-slate-800 hover:border-slate-700'
              }`}
            >
              {method === 'credit_card' ? 'Thẻ/Credit' : method === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 pt-8">
        {isEdit && initialTransaction?.id && onDeleteTransaction ? (
          <button
            type="button"
            onClick={() => {
              const ok = confirm('Xóa giao dịch này? Hành động không thể hoàn tác.');
              if (!ok) return;
              onDeleteTransaction(initialTransaction.id);
              onClose();
            }}
            className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-rose-400 border border-rose-500/30 bg-rose-500/10 rounded-2xl hover:bg-rose-500 hover:text-white transition-all"
          >
            Xóa giao dịch
          </button>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
          >
            Hủy giao dịch
          </button>
        )}

        <button
          type="submit"
          className="flex-[2] py-5 bg-gradient-to-r from-luxury-gold to-amber-600 text-black text-sm font-black uppercase tracking-[0.3em] rounded-2xl shadow-luxury hover:scale-[1.02] active:scale-95 transition-all"
        >
          {isEdit ? 'Lưu chỉnh sửa' : 'Ghi nhận ngay'}
        </button>
      </div>
    </form>
  );
};

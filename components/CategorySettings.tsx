import React, { useState } from 'react';
import { Category } from '../types';
import { PlusIcon, TrashIcon, PencilIcon, CheckIcon } from './Icons';
import { IconMap } from './Icons'; // Để hiển thị các icon có sẵn

interface CategorySettingsProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

export const CategorySettings: React.FC<CategorySettingsProps> = ({ categories, setCategories }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState<'income' | 'expense'>('expense');
  const [newCategoryIcon, setNewCategoryIcon] = useState('ShoppingCart'); // Icon mặc định
  const [newCategoryColor, setNewCategoryColor] = useState('#ef4444'); // Màu mặc định
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') return;

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: newCategoryName.trim(),
      type: newCategoryType,
      icon: newCategoryIcon,
      color: newCategoryColor,
      defaultClassification: newCategoryType === 'expense' ? 'need' : undefined, // Mặc định cho chi tiêu
    };

    setCategories(prev => [...prev, newCategory]);
    setNewCategoryName('');
    setNewCategoryType('expense');
    setNewCategoryIcon('ShoppingCart');
    setNewCategoryColor('#ef4444');
  };

  const handleUpdateCategory = (id: string) => {
    if (newCategoryName.trim() === '') return;

    setCategories(prev => prev.map(cat => 
      cat.id === id 
        ? { 
            ...cat, 
            name: newCategoryName.trim(), 
            type: newCategoryType, 
            icon: newCategoryIcon, 
            color: newCategoryColor,
            defaultClassification: newCategoryType === 'expense' ? 'need' : undefined,
          } 
        : cat
    ));
    setEditingCategoryId(null);
    setNewCategoryName('');
    setNewCategoryType('expense');
    setNewCategoryIcon('ShoppingCart');
    setNewCategoryColor('#ef4444');
  };

  const handleDeleteCategory = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      setCategories(prev => prev.filter(cat => cat.id !== id));
    }
  };

  const startEditing = (category: Category) => {
    setEditingCategoryId(category.id);
    setNewCategoryName(category.name);
    setNewCategoryType(category.type);
    setNewCategoryIcon(category.icon);
    setNewCategoryColor(category.color);
  };

  const cancelEditing = () => {
    setEditingCategoryId(null);
    setNewCategoryName('');
    setNewCategoryType('expense');
    setNewCategoryIcon('ShoppingCart');
    setNewCategoryColor('#ef4444');
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quản lý Danh mục Chi tiêu/Thu nhập</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Thêm, sửa hoặc xóa các danh mục để phù hợp với nhu cầu quản lý tài chính của bạn.
      </p>

      {/* Form thêm/sửa danh mục */}
      <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
          {editingCategoryId ? 'Sửa Danh mục' : 'Thêm Danh mục mới'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="category-name" className="block text-xs font-black text-gray-500 uppercase mb-1 tracking-widest">Tên danh mục</label>
            <input
              type="text"
              id="category-name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Ví dụ: Mua nhà, Tiền điện, Lương phụ"
              className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label htmlFor="category-type" className="block text-xs font-black text-gray-500 uppercase mb-1 tracking-widest">Loại</label>
            <select
              id="category-type"
              value={newCategoryType}
              onChange={(e) => setNewCategoryType(e.target.value as 'income' | 'expense')}
              className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="expense">Chi tiêu</option>
              <option value="income">Thu nhập</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="category-icon" className="block text-xs font-black text-gray-500 uppercase mb-1 tracking-widest">Biểu tượng</label>
            <select
              id="category-icon"
              value={newCategoryIcon}
              onChange={(e) => setNewCategoryIcon(e.target.value)}
              className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            >
              {Object.keys(IconMap).map(iconName => (
                <option key={iconName} value={iconName}>{iconName}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="category-color" className="block text-xs font-black text-gray-500 uppercase mb-1 tracking-widest">Màu sắc</label>
            <input
              type="color"
              id="category-color"
              value={newCategoryColor}
              onChange={(e) => setNewCategoryColor(e.target.value)}
              className="w-full h-10 rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800"
            />
          </div>
        </div>
        <div className="flex space-x-2">
          {editingCategoryId ? (
            <>
              <button
                onClick={() => handleUpdateCategory(editingCategoryId)}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 transition-colors"
              >
                <CheckIcon className="w-5 h-5 mr-2" /> Cập nhật
              </button>
              <button
                onClick={cancelEditing}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors dark:bg-gray-600 dark:text-white"
              >
                Hủy
              </button>
            </>
          ) : (
            <button
              onClick={handleAddCategory}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" /> Thêm danh mục
            </button>
          )}
        </div>
      </div>

      {/* Danh sách các danh mục hiện có */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Danh sách Danh mục</h3>
        <ul className="space-y-3">
          {categories.map(cat => {
            const IconComponent = IconMap[cat.icon] || IconMap['Cash'];
            return (
              <li key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600">
                <div className="flex items-center">
                  <div className="p-2 rounded-md mr-3" style={{ backgroundColor: `${cat.color}20` }}>
                    <IconComponent className="h-5 w-5" style={{ color: cat.color }} />
                  </div>
                  <div>
                    <span className="font-medium text-gray-800 dark:text-white">{cat.name}</span>
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">({cat.type === 'income' ? 'Thu nhập' : 'Chi tiêu'})</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEditing(cat)}
                    className="p-1.5 text-gray-500 hover:text-primary-500 transition-colors"
                    title="Sửa"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1.5 text-gray-500 hover:text-red-500 transition-colors"
                    title="Xóa"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
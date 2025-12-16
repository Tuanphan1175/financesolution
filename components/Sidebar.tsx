
import React from 'react';
import { View } from '../types';
import { ChartPieIcon, CollectionIcon, ClipboardListIcon, DocumentReportIcon, CurrencyDollarIcon, ShieldCheckIcon, TrendingUpIcon, ScaleIcon, CalendarIcon, SparklesIcon } from './Icons';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const NavItem: React.FC<{
  view: View;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-primary-500 text-white'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </button>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const navItems: { view: View; label: string; icon: React.ReactNode }[] = [
    { view: 'dashboard', label: 'Bảng điều khiển', icon: <ChartPieIcon className="h-6 w-6" /> },
    { view: 'ai-coach', label: 'AI Financial Coach', icon: <SparklesIcon className="h-6 w-6" /> },
    { view: '30-day-journey', label: 'Hành trình 30 ngày', icon: <CalendarIcon className="h-6 w-6" /> },
    { view: 'journey', label: 'Tháp Tài Chính', icon: <TrendingUpIcon className="h-6 w-6" /> }, 
    { view: 'transactions', label: 'Giao dịch', icon: <CollectionIcon className="h-6 w-6" /> },
    { view: 'budgets', label: 'Ngân sách', icon: <ClipboardListIcon className="h-6 w-6" /> },
    { view: 'rules', label: 'Nguyên tắc vàng', icon: <ShieldCheckIcon className="h-6 w-6" /> },
    { view: 'net-worth', label: 'Tài sản ròng', icon: <ScaleIcon className="h-6 w-6" /> },
    { view: 'income-ladder', label: 'Cấp độ kiếm tiền', icon: <CurrencyDollarIcon className="h-6 w-6" /> },
    { view: 'reports', label: 'Báo cáo', icon: <DocumentReportIcon className="h-6 w-6" /> },
  ];

  return (
    <div className="flex flex-col w-64 h-full px-4 py-8 bg-white dark:bg-gray-800 border-r dark:border-gray-700 overflow-y-auto">
      <div className="flex items-center mb-10 px-2 shrink-0">
        <CurrencyDollarIcon className="h-8 w-8 text-primary-500" />
        <h2 className="ml-2 text-2xl font-bold text-gray-800 dark:text-white">
          Tài Chính <span className="text-primary-500">Thông Minh</span>
        </h2>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.view}
            view={item.view}
            label={item.label}
            icon={item.icon}
            isActive={currentView === item.view}
            onClick={() => setCurrentView(item.view)}
          />
        ))}
      </nav>
      
      <div className="mt-auto shrink-0">
        <div className="flex items-center p-2">
          <img className="w-10 h-10 rounded-full" src="https://picsum.photos/100" alt="User" />
          <div className="ml-3">
            <p className="text-sm font-semibold text-gray-800 dark:text-white">Người dùng Demo</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">demo@smart.finance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

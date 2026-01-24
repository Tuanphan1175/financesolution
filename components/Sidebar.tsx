```tsx
import React, { useState, useEffect } from 'react';
import { View } from '../types';
import {
  ChartPieIcon,
  CollectionIcon,
  ClipboardListIcon,
  DocumentReportIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  ScaleIcon,
  CalendarIcon,
  SparklesIcon,
  BookOpenIcon,
  PencilIcon,
  RefreshIcon,
} from './Icons';
import { logout } from '../lib/logout';

/* =========================
   TYPES
========================= */
interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isPremium: boolean;
  setIsPremium: (isPremium: boolean) => void;
}

/* =========================
   NAV ITEM
========================= */
const NavItem: React.FC<{
  view: View;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-500 group relative mb-1 ${
      isActive
        ? 'bg-gradient-to-r from-luxury-gold to-amber-600 text-black shadow-luxury'
        : 'text-slate-500 hover:text-white hover:bg-slate-800/50'
    }`}
  >
    <div
      className={`transition-all duration-500 group-hover:scale-110 ${
        isActive
          ? 'text-black'
          : 'text-slate-600 group-hover:text-luxury-gold'
      }`}
    >
      {React.cloneElement(icon as React.ReactElement, {
        className: 'h-6 w-6',
      })}
    </div>

    <span className="ml-5 truncate">{label}</span>

    {isActive && (
      <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-black/40" />
    )}
  </button>
);

/* =========================
   SIDEBAR
========================= */
export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  isPremium,
  setIsPremium,
}) => {
  const [userName, setUserName] = useState('Người dùng');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('smartfinance_username');
    if (stored) setUserName(stored);
  }, []);

  const handleSaveName = () => {
    const name = userName.trim() || 'Người dùng';
    setUserName(name);
    localStorage.setItem('smartfinance_username', name);
    setIsEditing(false);
  };

  const navItems: { view: View; label: string; icon: React.ReactNode }[] = [
    { view: 'dashboard', label: 'Bảng điều khiển', icon: <ChartPieIcon /> },
    { view: 'ai-coach', label: 'AI Coach', icon: <SparklesIcon /> },
    { view: 'playbook', label: 'Chiến lược', icon: <BookOpenIcon /> },
    { view: '30-day-journey', label: 'Hành trình 30 ngày', icon: <CalendarIcon /> },
    { view: 'journey', label: 'Tháp Tài Chính', icon: <TrendingUpIcon /> },
    { view: 'transactions', label: 'Giao dịch', icon: <CollectionIcon /> },
    { view: 'budgets', label: 'Ngân sách', icon: <ClipboardListIcon /> },
    { view: 'rules', label: 'Nguyên tắc vàng', icon: <ShieldCheckIcon /> },
    { view: 'net-worth', label: 'Tài sản ròng', icon: <ScaleIcon /> },
    { view: 'income-ladder', label: 'Cấp độ kiếm tiền', icon: <CurrencyDollarIcon /> },
    { view: 'reports', label: 'Báo cáo', icon: <DocumentReportIcon /> },
    { view: 'category-settings', label: 'Quản lý danh mục', icon: <PencilIcon /> },
    { view: 'upgrade-plan', label: 'Nâng cấp Gói', icon: <SparklesIcon /> },
  ];

  return (
    <div className="flex flex-col w-full h-screen px-6 py-12 bg-luxury-obsidian overflow-y-auto">
      {/* LOGO */}
      <div
        className="flex items-center mb-16 px-4 cursor-pointer"
        onClick={() => setCurrentView('dashboard')}
      >
        <div className="bg-luxury-gold p-3 rounded-[1.4rem] shadow-luxury">
          <CurrencyDollarIcon className="h-8 w-8 text-black" />
        </div>
        <div className="ml-5">
          <h2 className="text-xl font-black text-white tracking-[0.2em] italic">
            TÀI CHÍNH
          </h2>
          <span className="text-[10px] font-black text-luxury-gold tracking-[0.55em]">
            PREMIUM
          </span>
        </div>
      </div>

      {/* MENU */}
      <nav className="flex-1 space-y-1 mb-12">
        {navItems.map((item) => (
          <NavItem
            key={item.view}
            {...item}
            isActive={currentView === item.view}
            onClick={() => setCurrentView(item.view)}
          />
        ))}
      </nav>

      {/* FOOTER */}
      <div className="mt-auto pt-10 border-t border-slate-800">
        {/* DEV TOGGLE */}
        {import.meta.env.DEV && (
          <button
            onClick={() => setIsPremium(!isPremium)}
            className="w-full px-8 py-3 text-[10px] font-black text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-2xl mb-4"
          >
            <RefreshIcon className="h-4 w-4 inline mr-2" />
            Dev Toggle VIP
          </button>
        )}

        {/* USER PROFILE */}
        <div className="p-4 rounded-[1.8rem] bg-slate-900 border border-slate-800">
          {isEditing ? (
            <input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
              className="w-full bg-transparent border-b border-luxury-gold text-white font-black"
              autoFocus
            />
          ) : (
            <div onClick={() => setIsEditing(true)} className="cursor-pointer">
              <p className="text-lg font-black text-white">{userName}</p>
              <p className="text-[9px] font-black text-luxury-gold tracking-[0.3em]">
                Elite Member
              </p>
            </div>
          )}
        </div>

        {/* LOGOUT BUTTON */}
        <div className="mt-4 px-3">
          <button
            onClick={logout}
            className="
              w-full rounded-xl
              bg-red-500/10 text-red-300
              px-4 py-2 text-sm
              hover:bg-red-500/20
              transition
            "
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
};

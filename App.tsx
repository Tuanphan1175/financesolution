// App.tsx
import React, { useEffect, useMemo, useState } from 'react';
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
}> = ({ label, icon, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`w-full flex items-center px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-500 group relative mb-1 ${
        isActive
          ? 'bg-gradient-to-r from-luxury-gold to-amber-600 text-black shadow-luxury'
          : 'text-slate-500 hover:text-white hover:bg-slate-800/50'
      }`}
    >
      <div
        className={`transition-all duration-500 group-hover:scale-110 ${
          isActive ? 'text-black' : 'text-slate-600 group-hover:text-luxury-gold'
        }`}
      >
        {React.cloneElement(icon as React.ReactElement, { className: 'h-6 w-6' })}
      </div>

      <span className="ml-5 truncate">{label}</span>

      {isActive && (
        <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-black/40" />
      )}
    </button>
  );
};

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
    const nameToSave = userName.trim() || 'Người dùng';
    setUserName(nameToSave);
    localStorage.setItem('smartfinance_username', nameToSave);
    setIsEditing(false);
  };

  const navItems: { view: View; label: string; icon: React.ReactNode }[] =
    useMemo(
      () => [
        { view: 'dashboard', label: 'Bảng điều khiển', icon: <ChartPieIcon /> },
        { view: 'ai-coach', label: 'AI Coach', icon: <SparklesIcon /> },
        { view: 'playbook', label: 'Chiến lược', icon: <BookOpenIcon /> },
        { view: '30-day-journey', label: 'Hành trình 30 ngày', icon: <CalendarIcon /> },
        { view: 'journey', label: 'Tháp tài chính', icon: <TrendingUpIcon /> },
        { view: 'transactions', label: 'Giao dịch', icon: <CollectionIcon /> },
        { view: 'budgets', label: 'Ngân sách', icon: <ClipboardListIcon /> },
        { view: 'rules', label: 'Nguyên tắc vàng', icon: <ShieldCheckIcon /> },
        { view: 'net-worth', label: 'Tài sản ròng', icon: <ScaleIcon /> },
        { view: 'income-ladder', label: 'Cấp độ kiếm tiền', icon: <CurrencyDollarIcon /> },
        { view: 'reports', label: 'Báo cáo', icon: <DocumentReportIcon /> },
        { view: 'category-settings', label: 'Quản lý danh mục', icon: <PencilIcon /> },
        { view: 'upgrade-plan', label: 'Nâng cấp gói', icon: <SparklesIcon /> },
      ],
      []
    );

  const membershipLabel = isPremium ? 'Elite Member' : 'Member';

  return (
    <div className="flex flex-col w-full h-screen px-6 py-12 bg-luxury-obsidian overflow-y-auto">
      {/* LOGO */}
      <div
        className="flex items-center mb-16 px-4 shrink-0 group cursor-pointer"
        onClick={() => setCurrentView('dashboard')}
      >
        <div className="bg-luxury-gold p-3 rounded-[1.4rem] shadow-luxury transition-all duration-700 group-hover:rotate-[360deg] border border-white/20 shrink-0">
          <CurrencyDollarIcon className="h-8 w-8 text-black" />
        </div>
        <div className="ml-5 flex flex-col justify-center min-w-0">
          <h2 className="text-xl font-black text-white leading-none tracking-[0.2em] italic truncate">
            TÀI CHÍNH
          </h2>
          <span className="text-[10px] font-black text-luxury-gold uppercase tracking-[0.55em] mt-2 opacity-80 whitespace-nowrap">
            PREMIUM
          </span>
        </div>
      </div>

      {/* MENU */}
      <nav className="flex-1 space-y-1 mb-12">
        <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] mb-6 ml-4">
          Architecture
        </p>
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

      {/* FOOTER */}
      <div className="mt-auto shrink-0 pt-10 border-t border-slate-800">
        {/* DEV ONLY */}
        {import.meta.env.DEV && (
          <button
            onClick={() => setIsPremium(!isPremium)}
            type="button"
            className="w-full flex items-center px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-500 text-slate-500 hover:text-white hover:bg-slate-800/50 mb-4"
          >
            <RefreshIcon className="h-5 w-5 mr-4 text-slate-600" />
            Dev: Toggle VIP ({isPremium ? 'ON' : 'OFF'})
          </button>
        )}

        {/* USER PROFILE */}
        <div className="p-4 rounded-[1.8rem] bg-slate-900 border border-slate-800 shadow-inner">
          <div className="flex items-center">
            <div className="relative shrink-0">
              <img
                className="w-14 h-14 rounded-2xl bg-luxury-gold object-cover shadow-luxury border-2 border-black"
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  userName
                )}&background=C5A059&color=000&bold=true&font-size=0.4`}
                alt="User"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-slate-900 rounded-full" />
            </div>

            <div className="ml-5 flex-1 min-w-0">
              {isEditing ? (
                <input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  onBlur={handleSaveName}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  className="w-full text-sm font-black text-white bg-transparent border-b-2 border-luxury-gold focus:outline-none py-1"
                  autoFocus
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="w-full text-left"
                  aria-label="Chỉnh sửa tên hiển thị"
                >
                  <p className="text-[16px] font-black text-white truncate flex items-center mb-2">
                    {userName}
                    <PencilIcon className="h-3 w-3 ml-3 text-slate-500" />
                  </p>
                  <p className="text-[9px] font-black text-luxury-gold uppercase tracking-[0.3em] opacity-60">
                    {membershipLabel}
                  </p>
                </button>
              )}
            </div>
          </div>

          {/* LOGOUT BUTTON (NGAY DƯỚI PROFILE) */}
          <div className="mt-4 px-1">
            <button
              onClick={logout}
              type="button"
              className="w-full rounded-xl bg-red-500/10 text-red-300 px-4 py-2 text-sm hover:bg-red-500/20 transition"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

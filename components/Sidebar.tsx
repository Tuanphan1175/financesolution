import React, { useState, useEffect } from 'react';
import { View } from '../types';
import { ChartPieIcon, CollectionIcon, ClipboardListIcon, DocumentReportIcon, CurrencyDollarIcon, ShieldCheckIcon, TrendingUpIcon, ScaleIcon, CalendarIcon, SparklesIcon, BookOpenIcon, PencilIcon } from './Icons';

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
      className={`w-full flex items-center px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-500 group relative mb-1 ${
        isActive
          ? 'bg-gradient-to-r from-luxury-gold to-amber-600 text-black shadow-luxury'
          : 'text-slate-500 hover:text-white hover:bg-slate-800/50'
      }`}
    >
      <div className={`transition-all duration-500 group-hover:scale-110 ${isActive ? 'text-black' : 'text-slate-600 group-hover:text-luxury-gold'}`}>
        {React.cloneElement(icon as React.ReactElement, { className: "h-6 w-6" })}
      </div>
      <span className="ml-5 truncate">{label}</span>
      {isActive && (
        <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-black/40"></div>
      )}
    </button>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const [userName, setUserName] = useState("Người dùng");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("smartfinance_username");
    if (stored) setUserName(stored);
  }, []);

  const handleSaveName = () => {
    const nameToSave = userName.trim() || "Người dùng";
    setUserName(nameToSave);
    localStorage.setItem("smartfinance_username", nameToSave);
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
  ];

  return (
    <div className="flex flex-col w-full h-full px-6 py-12 bg-luxury-obsidian overflow-y-auto">
      <div className="flex items-center mb-16 px-4 shrink-0 group cursor-pointer" onClick={() => setCurrentView('dashboard')}>
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

      <nav className="flex-1 space-y-1 mb-12">
        <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.4em] mb-6 ml-4">Architecture</p>
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
      
      <div className="mt-auto shrink-0 pt-10 border-t border-slate-800">
        <div className="flex items-center p-4 rounded-[1.8rem] bg-slate-900 border border-slate-800 transition-all hover:border-luxury-gold/50 group shadow-inner">
          <div className="relative shrink-0">
            <img 
              className="w-14 h-14 rounded-2xl bg-luxury-gold object-cover shadow-luxury group-hover:scale-105 transition-transform duration-700 border-2 border-black" 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=C5A059&color=000&bold=true&font-size=0.4`} 
              alt="User" 
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-slate-900 rounded-full shadow-glow"></div>
          </div>
          <div className="ml-5 flex-1 min-w-0">
            {isEditing ? (
                <input 
                    type="text" 
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    onBlur={handleSaveName}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                    className="w-full text-sm font-black text-white bg-transparent border-b-2 border-luxury-gold focus:outline-none tracking-tight py-1"
                    autoFocus
                />
            ) : (
                <div onClick={() => setIsEditing(true)} className="cursor-pointer">
                    <p className="text-[16px] font-black text-white truncate flex items-center tracking-tighter leading-none mb-2">
                        {userName}
                        <PencilIcon className="h-3 w-3 ml-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                    <p className="text-[9px] font-black text-luxury-gold truncate uppercase tracking-[0.3em] opacity-60">Elite Member</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
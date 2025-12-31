import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { Budgets } from './components/Budgets';
import { Reports } from './components/Reports';
import { Journey } from './components/Journey';
import { GoldenRules } from './components/GoldenRules';
import { IncomeLadder } from './components/IncomeLadder';
import { NetWorth } from './components/NetWorth';
import { ThirtyDayJourney } from './components/ThirtyDayJourney';
import { AICoach } from './components/AICoach';
import { WealthPlaybookPanel } from './components/WealthPlaybookPanel';
import { MenuIcon, XIcon, SparklesIcon, ArrowUpIcon } from './components/Icons';
import { View, AccountType, GoldenRule, Transaction, JourneyProgress, Category, Budget, Asset, Liability } from './types';
import { ASSETS as INITIAL_ASSETS, LIABILITIES as INITIAL_LIABILITIES, GOLDEN_RULES_SEED, TRANSACTIONS as INITIAL_TRANSACTIONS, BUDGETS as INITIAL_BUDGETS } from './constants';
import { calculatePyramidStatus } from './lib/pyramidLogic';
import { BudgetSettings } from './components/BudgetSettings';
import { CategorySettings } from './components/CategorySettings';

// Định nghĩa các danh mục mặc định ngay tại đây
const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Lương', type: 'income', icon: 'Briefcase', color: '#10b981', defaultClassification: 'need' },
  { id: 'cat-2', name: 'Tạp hóa', type: 'expense', icon: 'ShoppingCart', color: '#ef4444', defaultClassification: 'need' },
  { id: 'cat-3', name: 'Tiền thuê nhà', type: 'expense', icon: 'Home', color: '#f97316', defaultClassification: 'need' },
  { id: 'cat-4', name: 'Đi lại', type: 'expense', icon: 'Bus', color: '#3b82f6', defaultClassification: 'need' },
  { id: 'cat-5', name: 'Giải trí', type: 'expense', icon: 'Ticket', color: '#8b5cf6', defaultClassification: 'want' },
  { id: 'cat-6', name: 'Làm tự do', type: 'income', icon: 'Pencil', color: '#14b8a6', defaultClassification: 'need' },
  { id: 'cat-7', name: 'Tiện ích', type: 'expense', icon: 'LightningBolt', color: '#f59e0b', defaultClassification: 'need' },
  { id: 'cat-8', name: 'Sức khỏe', type: 'expense', icon: 'Heart', color: '#ec4899', defaultClassification: 'need' },
  { id: 'cat-9', name: 'Kinh doanh', type: 'income', icon: 'ChartPie', color: '#6366f1', defaultClassification: 'need' },
];

const viewTitles: Record<View, string> = {
  dashboard: 'Bảng Điều Khiển',
  transactions: 'Nhật Ký Giao Dịch',
  budgets: 'Quản Lý Ngân Sách',
  reports: 'Báo Cáo Tài Chính',
  journey: 'Tháp Tài Chính Lead Up',
  rules: '11 Nguyên Tắc Vàng',
  'income-ladder': '7 Cấp Độ Kiếm Tiền',
  'net-worth': 'Bảng Cân Đối Tài Sản',
  '30-day-journey': 'Hành Trình Tỉnh Thức 30 Ngày',
  'ai-coach': 'AI Financial Coach',
  'playbook': 'Chiến Lược Tài Chính Premium',
  'category-settings': 'Quản Lý Danh Mục'
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [accountFilter, setAccountFilter] = useState<'all' | AccountType>('all');
  
  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem('smartfinance_assets');
    return saved ? JSON.parse(saved) : INITIAL_ASSETS;
  });

  const [liabilities, setLiabilities] = useState<Liability[]>(() => {
    const saved = localStorage.getItem('smartfinance_liabilities');
    return saved ? JSON.parse(saved) : INITIAL_LIABILITIES;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('smartfinance_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('smartfinance_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('smartfinance_budgets');
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  const [goldenRules, setGoldenRules] = useState<GoldenRule[]>(() => {
    const saved = localStorage.getItem('smartfinance_rules');
    return saved ? JSON.parse(saved) : GOLDEN_RULES_SEED;
  });

  const [journeyProgress, setJourneyProgress] = useState<JourneyProgress>(() => {
    const saved = localStorage.getItem('smartfinance_journey');
    return saved ? JSON.parse(saved) : {};
  });

  const [targetLevelId, setTargetLevelId] = useState<number>(() => {
    const saved = localStorage.getItem('smartfinance_target_level');
    return saved ? parseInt(saved) : 2;
  });

  useEffect(() => {
    localStorage.setItem('smartfinance_assets', JSON.stringify(assets));
    localStorage.setItem('smartfinance_liabilities', JSON.stringify(liabilities));
    localStorage.setItem('smartfinance_transactions', JSON.stringify(transactions));
    localStorage.setItem('smartfinance_categories', JSON.stringify(categories));
    localStorage.setItem('smartfinance_budgets', JSON.stringify(budgets));
    localStorage.setItem('smartfinance_rules', JSON.stringify(goldenRules));
    localStorage.setItem('smartfinance_journey', JSON.stringify(journeyProgress));
    localStorage.setItem('smartfinance_target_level', targetLevelId.toString());
  }, [assets, liabilities, transactions, categories, budgets, goldenRules, journeyProgress, targetLevelId]);

  // Reactive Pyramid Status based on Two Wallets selection
  const pyramidStatus = useMemo(() => {
    const filteredTransactions = accountFilter === 'all' ? transactions : transactions.filter(t => t.accountType === accountFilter);
    const filteredAssets = accountFilter === 'all' ? assets : assets.filter(a => a.accountType === accountFilter);
    const filteredLiabilities = accountFilter === 'all' ? liabilities : liabilities.filter(l => l.accountType === accountFilter);
    
    return calculatePyramidStatus(filteredTransactions, filteredAssets, filteredLiabilities, goldenRules);
  }, [transactions, assets, liabilities, goldenRules, accountFilter, categories]);

  const handleCompleteDay = (day: number, note?: string) => {
      setJourneyProgress(prev => ({
          ...prev,
          [day]: {
              completed: true,
              completedAt: new Date().toISOString(),
              note
          }
      }));
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard 
            transactions={transactions} 
            assets={assets} 
            liabilities={liabilities} 
            goldenRules={goldenRules}
            accountFilter={accountFilter}
            setAccountFilter={setAccountFilter}
            categories={categories}
            pyramidStatus={pyramidStatus}
        />;
      case 'transactions':
        return <Transactions 
            transactions={transactions} 
            setTransactions={setTransactions} 
            categories={categories}
            onAddCategory={(cat) => setCategories(p => [...p, cat])}
            onUpdateCategory={(cat) => setCategories(p => p.map(c => c.id === cat.id ? cat : c))}
        />;
      case 'budgets':
        return <Budgets 
            categories={categories} 
            transactions={transactions} 
            budgets={budgets} 
            setBudgets={setBudgets} 
        />;
      case 'reports':
        return <Reports transactions={transactions} categories={categories} />;
      case 'journey':
        return <Journey 
            pyramidStatus={pyramidStatus}
        />;
      case 'rules':
        return <GoldenRules rules={goldenRules} onToggleRule={(id) => setGoldenRules(p => p.map(r => r.id === id ? { ...r, isCompliant: !r.isCompliant } : r))} />;
      case 'income-ladder':
        return <IncomeLadder />;
      case 'net-worth':
        return <NetWorth 
            assets={assets} 
            setAssets={setAssets}
            liabilities={liabilities} 
            setLiabilities={setLiabilities}
            monthlyExpenseAvg={pyramidStatus.metrics.avgExpense}
            accountFilter={accountFilter}
            setAccountFilter={setAccountFilter}
        />;
      case '30-day-journey':
        return <ThirtyDayJourney 
            progress={journeyProgress} 
            onCompleteDay={handleCompleteDay} 
            currentLevel={pyramidStatus.currentLevel}
            targetLevelId={targetLevelId}
            onSetTarget={setTargetLevelId}
        />;
      case 'ai-coach':
        return <AICoach transactions={transactions} assets={assets} liabilities={liabilities} journeyProgress={journeyProgress} goldenRules={goldenRules} />;
      case 'playbook':
        return <WealthPlaybookPanel />;
      case 'category-settings':
        return <CategorySettings categories={categories} setCategories={setCategories} />;
      default:
        return <Dashboard transactions={transactions} assets={assets} liabilities={liabilities} goldenRules={goldenRules} accountFilter={accountFilter} setAccountFilter={setAccountFilter} categories={categories} pyramidStatus={pyramidStatus} />;
    }
  };
  
  return (
    <div className="flex h-screen bg-luxury-obsidian text-slate-100 font-sans selection:bg-luxury-gold selection:text-black">
      <div className={`fixed inset-y-0 left-0 z-40 w-96 bg-luxury-obsidian shadow-premium transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-500 md:relative md:translate-x-0 md:flex md:flex-shrink-0 border-r border-slate-800`}>
        <Sidebar currentView={currentView} setCurrentView={(view) => {
            setCurrentView(view)
            setSidebarOpen(false);
        }} />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-6 bg-luxury-obsidian/80 backdrop-blur-md border-b border-slate-800 md:hidden sticky top-0 z-30">
          <h1 className="text-3xl font-extrabold text-luxury-gold tracking-tight uppercase">TÀI CHÍNH THÔNG MINH</h1>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-300 hover:text-luxury-gold transition-all">
            {isSidebarOpen ? <XIcon className="h-8 w-8" /> : <MenuIcon className="h-8 w-8" />}
          </button>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto luxury-gradient scroll-smooth">
          <div className="container mx-auto px-6 md:px-12 py-12 max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {currentView !== 'dashboard' && (
                        <button 
                            onClick={() => setCurrentView('dashboard')}
                            className="flex items-center gap-2 group mr-4 bg-white/5 hover:bg-luxury-gold px-5 py-2.5 rounded-xl transition-all border border-white/10 hover:border-luxury-gold shadow-luxury"
                        >
                            <ArrowUpIcon className="h-5 w-5 -rotate-90 text-luxury-gold group-hover:text-black" />
                            <span className="text-xs font-black text-white group-hover:text-black uppercase tracking-widest">QUAY LẠI</span>
                        </button>
                    )}
                    <div className="h-px w-10 bg-luxury-gold opacity-60"></div>
                    <div className="text-sm font-black uppercase text-luxury-gold tracking-[0.4em] opacity-90">PREMIUM EXPERIENCE</div>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-none italic">{viewTitles[currentView]}</h2>
                </div>
                <div className="flex items-center gap-4 bg-slate-900/50 backdrop-blur-md px-8 py-4 rounded-2xl border border-slate-800 shadow-luxury shrink-0">
                   <div className="w-3 h-3 rounded-full bg-luxury-gold animate-pulse shadow-[0_0_12px_#C5A059]"></div>
                   <span className="text-sm font-black uppercase text-slate-300 tracking-[0.2em] whitespace-nowrap">Lead Up Global • Coach Tuấn Dr</span>
                </div>
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
              {renderView()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
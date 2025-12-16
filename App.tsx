
import React, { useState, useMemo } from 'react';
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
import { MenuIcon, XIcon } from './components/Icons';
import { View, AccountType, GoldenRule, Transaction, JourneyProgress } from './types';
import { ASSETS as INITIAL_ASSETS, LIABILITIES as INITIAL_LIABILITIES, GOLDEN_RULES_SEED, TRANSACTIONS as INITIAL_TRANSACTIONS } from './constants';

const viewTitles: Record<View, string> = {
  dashboard: 'Bảng điều khiển',
  transactions: 'Giao dịch',
  budgets: 'Ngân sách',
  reports: 'Báo cáo',
  journey: 'Tháp Tài Chính',
  rules: '11 Nguyên Tắc Vàng',
  'income-ladder': '7 Cấp độ Kiếm tiền',
  'net-worth': 'Tài sản Ròng',
  '30-day-journey': 'Hành trình Tỉnh thức 30 Ngày',
  'ai-coach': 'AI Financial Coach'
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // State for new features
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [liabilities, setLiabilities] = useState(INITIAL_LIABILITIES);
  const [goldenRules, setGoldenRules] = useState<GoldenRule[]>(GOLDEN_RULES_SEED);
  const [accountFilter, setAccountFilter] = useState<'all' | AccountType>('all');
  
  // Need to pass transactions from a central state if we want Dashboard to update when Transactions change
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  // State for 30 Day Journey
  // Initialize with some days completed for demo purposes
  const [journeyProgress, setJourneyProgress] = useState<JourneyProgress>({
      1: { completed: true, completedAt: new Date().toISOString(), note: 'Tôi đã bị sốc khi thấy mình chi 50k trà đá mỗi ngày.' },
      2: { completed: true, completedAt: new Date().toISOString() },
  });

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

  // Calculate monthly expenses average for logic
  const monthlyExpenseAvg = useMemo(() => {
     const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
     return expenses; // Simplified: assumes total is for current month context
  }, [transactions]);

  const toggleRule = (id: string) => {
      setGoldenRules(prev => prev.map(r => r.id === id ? { ...r, isCompliant: !r.isCompliant } : r));
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
        />;
      case 'transactions':
        return <Transactions />;
      case 'budgets':
        return <Budgets />;
      case 'reports':
        return <Reports />;
      case 'journey':
        return <Journey 
            assets={assets.reduce((s, a) => s + a.value, 0)} 
            liabilities={liabilities.reduce((s, l) => s + l.amount, 0)} 
            emergencyFund={assets.filter(a => a.type === 'cash' || a.type === 'investment').reduce((s, a) => s + a.value, 0)}
            monthlyExpenses={monthlyExpenseAvg}
            transactions={transactions}
        />;
      case 'rules':
        return <GoldenRules rules={goldenRules} onToggleRule={toggleRule} />;
      case 'income-ladder':
        return <IncomeLadder />;
      case 'net-worth':
        return <NetWorth assets={assets} liabilities={liabilities} monthlyExpenseAvg={monthlyExpenseAvg} />;
      case '30-day-journey':
        return <ThirtyDayJourney progress={journeyProgress} onCompleteDay={handleCompleteDay} />;
      case 'ai-coach':
        return <AICoach transactions={transactions} assets={assets} liabilities={liabilities} journeyProgress={journeyProgress} />;
      default:
        return <Dashboard 
            transactions={transactions} 
            assets={assets} 
            liabilities={liabilities} 
            goldenRules={goldenRules}
            accountFilter={accountFilter}
            setAccountFilter={setAccountFilter}
        />;
    }
  };
  
  const viewTitle = useMemo(() => {
    return viewTitles[currentView];
  }, [currentView]);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-shrink-0`}>
        <Sidebar currentView={currentView} setCurrentView={(view) => {
            setCurrentView(view)
            setSidebarOpen(false);
        }} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 md:hidden">
          <h1 className="text-xl font-semibold text-primary-600 dark:text-primary-400">Tài Chính Thông Minh</h1>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-500 focus:outline-none">
            {isSidebarOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">{viewTitle}</h2>
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;

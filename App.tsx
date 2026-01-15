
import React, { useState, useEffect, useCallback } from 'react';
import { Expense, User, ViewType } from './types';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import AIInsights from './components/AIInsights';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [view, setView] = useState<ViewType>('Monthly');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard');

  // Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Load expenses when user changes
  useEffect(() => {
    if (user) {
      const savedExpenses = localStorage.getItem(`expenses_${user.id}`);
      if (savedExpenses) {
        setExpenses(JSON.parse(savedExpenses));
      } else {
        setExpenses([]);
      }
    }
  }, [user]);

  // Persistence
  useEffect(() => {
    if (user) {
      localStorage.setItem(`expenses_${user.id}`, JSON.stringify(expenses));
    }
  }, [expenses, user]);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('current_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('current_user');
  };

  const addExpense = (expenseData: Omit<Expense, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    const newExpense: Expense = {
      ...expenseData,
      id: crypto.randomUUID(),
      userId: user.id,
      createdAt: Date.now()
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  if (!user) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">Money Tracker</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="hidden md:inline text-sm text-gray-500 font-medium">Hello, {user.name}</span>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AIInsights expenses={expenses} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center bg-white p-1 rounded-xl shadow-sm border border-gray-100">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-2 rounded-lg font-semibold text-sm transition ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-2 rounded-lg font-semibold text-sm transition ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Expense History
            </button>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'dashboard' && (
              <select
                value={view}
                onChange={(e) => setView(e.target.value as ViewType)}
                className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Daily">Daily</option>
                <option value="Monthly">Monthly</option>
                <option value="Yearly">Yearly</option>
              </select>
            )}
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Expense
            </button>
          </div>
        </div>

        {activeTab === 'dashboard' ? (
          <Dashboard expenses={expenses} view={view} />
        ) : (
          <ExpenseList expenses={expenses} onDelete={deleteExpense} />
        )}
      </main>

      {/* Floating Action Button for Mobile */}
      <button
        onClick={() => setIsFormOpen(true)}
        className="md:hidden fixed bottom-6 right-6 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 animate-bounce transition-transform active:scale-90"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {isFormOpen && (
        <ExpenseForm 
          onAdd={addExpense} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;


import React, { useMemo } from 'react';
import { Expense, ViewType } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { CATEGORY_COLORS } from '../constants';

interface DashboardProps {
  expenses: Expense[];
  view: ViewType;
}

const Dashboard: React.FC<DashboardProps> = ({ expenses, view }) => {
  const stats = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const thisMonth = now.toISOString().substring(0, 7);
    const thisYear = now.getFullYear().toString();

    const filtered = expenses.filter(e => {
      if (view === 'Daily') return e.date === today;
      if (view === 'Monthly') return e.date.startsWith(thisMonth);
      if (view === 'Yearly') return e.date.startsWith(thisYear);
      return true;
    });

    const total = filtered.reduce((acc, curr) => acc + curr.amount, 0);
    
    const categoryData = Object.entries(
      filtered.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
      }, {} as Record<string, number>)
    ).map(([name, value]) => ({ name, value }));

    const trendData = Object.entries(
      filtered.reduce((acc, curr) => {
        const key = view === 'Yearly' ? curr.date.substring(0, 7) : curr.date;
        acc[key] = (acc[key] || 0) + curr.amount;
        return acc;
      }, {} as Record<string, number>)
    )
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, amount]) => ({ date, amount }));

    return { total, categoryData, trendData, count: filtered.length };
  }, [expenses, view]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Total Spent ({view})</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-1">${stats.total.toFixed(2)}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Transactions</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.count}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Average / Expense</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-1">
            ${stats.count ? (stats.total / stats.count).toFixed(2) : '0.00'}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-800 mb-6">Category Breakdown</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-800 mb-6">Spending Trend</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.trendData}>
                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

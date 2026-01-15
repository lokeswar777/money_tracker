
import React, { useState } from 'react';
import { Expense } from '../types';
import { getFinancialInsights } from '../services/geminiService';

interface AIInsightsProps {
  expenses: Expense[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ expenses }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await getFinancialInsights(expenses);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI Financial Advisor
          </h2>
          <p className="mt-2 text-indigo-100 opacity-90">
            Get personalized spending analysis and saving strategies powered by Google Gemini.
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading || expenses.length === 0}
          className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? 'Analyzing...' : 'Generate Insights'}
        </button>
      </div>

      {insight && (
        <div className="mt-8 p-6 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 animate-in slide-in-from-top duration-500">
          <div className="whitespace-pre-wrap leading-relaxed text-indigo-50">
            {insight}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;

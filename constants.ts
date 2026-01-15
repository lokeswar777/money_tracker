
import { Category } from './types';

export const CATEGORIES: Category[] = [
  'Food',
  'Travel',
  'Rent',
  'Shopping',
  'Utilities',
  'Entertainment',
  'Other'
];

export const CATEGORY_COLORS: Record<Category, string> = {
  Food: '#f87171', // red-400
  Travel: '#60a5fa', // blue-400
  Rent: '#34d399', // emerald-400
  Shopping: '#fbbf24', // amber-400
  Utilities: '#818cf8', // indigo-400
  Entertainment: '#f472b6', // pink-400
  Other: '#94a3b8' // slate-400
};

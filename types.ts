
export type Category = 'Food' | 'Travel' | 'Rent' | 'Shopping' | 'Utilities' | 'Entertainment' | 'Other';

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: Category;
  date: string;
  description: string;
  createdAt: number;
}

export interface NotificationSettings {
  daily: boolean;
  weekly: boolean;
  monthly: boolean;
  email: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  preferences?: NotificationSettings;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export type ViewType = 'Daily' | 'Monthly' | 'Yearly';
export type AppTab = 'dashboard' | 'history' | 'settings';

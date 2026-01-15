
import { Expense, User, NotificationSettings } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  auth: {
    register: async (data: any) => {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(await res.text());
      const result = await res.json();
      localStorage.setItem('auth_token', result.token);
      return result.user;
    },
    login: async (data: any) => {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(await res.text());
      const result = await res.json();
      localStorage.setItem('auth_token', result.token);
      return result.user;
    },
    logout: () => {
      localStorage.removeItem('auth_token');
    }
  },
  expenses: {
    getAll: async (): Promise<Expense[]> => {
      const res = await fetch(`${API_BASE_URL}/expenses`, {
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to fetch expenses');
      const data = await res.json();
      return data.map((e: any) => ({ ...e, id: e._id }));
    },
    create: async (expense: Omit<Expense, 'id' | 'userId' | 'createdAt'>): Promise<Expense> => {
      const res = await fetch(`${API_BASE_URL}/expenses`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(expense)
      });
      if (!res.ok) throw new Error('Failed to create expense');
      const data = await res.json();
      return { ...data, id: data._id };
    },
    delete: async (id: string): Promise<void> => {
      const res = await fetch(`${API_BASE_URL}/expenses/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!res.ok) throw new Error('Failed to delete expense');
    }
  },
  user: {
    updatePreferences: async (preferences: NotificationSettings): Promise<User> => {
      const res = await fetch(`${API_BASE_URL}/user/preferences`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(preferences)
      });
      if (!res.ok) throw new Error('Failed to update preferences');
      const data = await res.json();
      return { ...data, id: data._id };
    }
  }
};

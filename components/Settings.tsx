
import React from 'react';
import { User, NotificationSettings } from '../types';

interface SettingsProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser }) => {
  const settings = user.preferences || {
    daily: false,
    weekly: false,
    monthly: false,
    email: user.email
  };

  const handleToggle = (key: keyof NotificationSettings) => {
    const newSettings = { ...settings, [key]: !settings[key as keyof NotificationSettings] };
    onUpdateUser({ ...user, preferences: newSettings as NotificationSettings });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Report Preferences
        </h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h4 className="font-semibold text-gray-900">Daily Summary</h4>
              <p className="text-sm text-gray-500">Scheduled for 10:00 PM daily</p>
            </div>
            <Toggle enabled={settings.daily} onToggle={() => handleToggle('daily')} />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h4 className="font-semibold text-gray-900">Weekly Digest</h4>
              <p className="text-sm text-gray-500">Scheduled for Monday mornings</p>
            </div>
            <Toggle enabled={settings.weekly} onToggle={() => handleToggle('weekly')} />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h4 className="font-semibold text-gray-900">Monthly Report</h4>
              <p className="text-sm text-gray-500">Scheduled for the 1st of every month</p>
            </div>
            <Toggle enabled={settings.monthly} onToggle={() => handleToggle('monthly')} />
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
        <h3 className="text-indigo-900 font-bold mb-2">Email Notifications</h3>
        <p className="text-indigo-700 text-sm leading-relaxed">
          Configure your report frequency above. Summaries will be prepared and sent directly to <strong>{user.email}</strong>.
        </p>
      </div>
    </div>
  );
};

const Toggle = ({ enabled, onToggle }: { enabled: boolean, onToggle: () => void }) => (
  <button
    onClick={onToggle}
    className={`${
      enabled ? 'bg-indigo-600' : 'bg-gray-200'
    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
  >
    <span
      className={`${
        enabled ? 'translate-x-6' : 'translate-x-1'
      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
    />
  </button>
);

export default Settings;

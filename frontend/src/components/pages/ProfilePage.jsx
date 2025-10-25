import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api, { authAPI } from '../../services/api';
import { Save, Camera, User } from 'lucide-react';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    avatar: '', 
    currency: 'USD',
    theme: 'light',
    notifications: {
      email: true,
      budgetAlerts: true,
      goalReminders: true,
    }
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'AUD', 'CAD', 'CHF', 'CNY'];

  const avatarOptions = [
    '👤', '👨', '👩', '🧑', '👦', '👧', '🧒',
    '😀', '😃', '😄', '😁', '😊', '😇', '🥰',
    '🤓', '😎', '🤩', '🥳', '😺', '🐶', '🐱',
    '🦁', '🐯', '🦊', '🐻', '🐼', '🐨', '🐸'
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await authAPI.getProfile();
        setForm({ 
          name: data.name || '', 
          email: data.email || '', 
          avatar: data.avatar || '',
          currency: data.currency || 'USD',
          theme: data.theme || 'light',
          notifications: data.notifications || {
            email: true,
            budgetAlerts: true,
            goalReminders: true,
          }
        });
      } catch {
        setForm({ 
          name: user?.name || '', 
          email: user?.email || '', 
          avatar: user?.avatar || '',
          currency: user?.currency || 'USD',
          theme: user?.theme || 'light',
          notifications: user?.notifications || {
            email: true,
            budgetAlerts: true,
            goalReminders: true,
          }
        });
      }
    };
    load();
  }, [user]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const oldCurrency = user?.currency;
      const { data } = await api.put('/auth/profile', form);
      setUser({ ...user, ...data });
      localStorage.setItem('user', JSON.stringify({ ...user, ...data }));
      
      // If currency changed, update all transactions
      if (oldCurrency !== form.currency) {
        await api.put('/transactions/update-currency', { currency: form.currency });
      }
      
      setMessage('Profile updated successfully!');
      
      // Apply theme
      if (data.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Refresh page to show new currency
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="card">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-6">Profile Settings</h2>
        
        {message && (
          <div className={`mb-4 p-3 rounded-lg ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-6xl shadow-lg">
              {form.avatar || '👤'}
            </div>
            <button
              type="button"
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            >
              <Camera className="w-5 h-5 text-purple-600" />
            </button>
          </div>
          <p className="mt-3 text-sm text-gray-600">Click camera icon to change avatar</p>

          {/* Avatar Picker */}
          {showAvatarPicker && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">Choose an avatar:</p>
              <div className="grid grid-cols-7 gap-2">
                {avatarOptions.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setForm({ ...form, avatar: emoji });
                      setShowAvatarPicker(false);
                    }}
                    className={`text-3xl p-2 rounded-lg hover:bg-purple-100 transition-colors ${
                      form.avatar === emoji ? 'bg-purple-200 ring-2 ring-purple-500' : 'bg-white'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Personal Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input name="name" value={form.name} onChange={onChange} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" name="email" value={form.email} className="input-field bg-gray-100" disabled />
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
                <select name="currency" value={form.currency} onChange={onChange} className="input-field">
                  {currencies.map((curr) => (
                    <option key={curr} value={curr}>{curr}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                <select name="theme" value={form.theme} onChange={onChange} className="input-field">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.notifications.email}
                  onChange={(e) => setForm({ 
                    ...form, 
                    notifications: { ...form.notifications, email: e.target.checked }
                  })}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Email notifications</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.notifications.budgetAlerts}
                  onChange={(e) => setForm({ 
                    ...form, 
                    notifications: { ...form.notifications, budgetAlerts: e.target.checked }
                  })}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Budget alerts</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.notifications.goalReminders}
                  onChange={(e) => setForm({ 
                    ...form, 
                    notifications: { ...form.notifications, goalReminders: e.target.checked }
                  })}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Goal reminders</span>
              </label>
            </div>
          </div>

          <div>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;



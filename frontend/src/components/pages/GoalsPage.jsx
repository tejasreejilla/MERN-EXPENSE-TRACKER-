import React, { useState, useEffect } from 'react';
import { Target, Plus, TrendingUp, Calendar, DollarSign, Edit2, Trash2 } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/currencyUtils';

const GoalsPage = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: 0,
    deadline: '',
    category: 'Savings',
    emoji: '🎯',
  });
  
  const userCurrency = user?.currency || 'USD';

  const emojiOptions = ['🎯', '💰', '🏠', '✈️', '🚗', '💍', '🎓', '🏥', '🎁', '📱', '💻', '🏖️'];
  const categories = ['Savings', 'Emergency Fund', 'Vacation', 'Investment', 'Purchase', 'Other'];

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const { data } = await api.get('/goals');
      setGoals(data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGoal) {
        await api.put(`/goals/${editingGoal._id}`, formData);
      } else {
        await api.post('/goals', formData);
      }
      fetchGoals();
      resetForm();
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await api.delete(`/goals/${id}`);
        fetchGoals();
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  const handleAddAmount = async (goalId) => {
    const amount = prompt('Enter amount to add:');
    if (amount && !isNaN(amount)) {
      try {
        await api.post(`/goals/${goalId}/add`, { amount: parseFloat(amount) });
        fetchGoals();
      } catch (error) {
        console.error('Error adding amount:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: 0,
      deadline: '',
      category: 'Savings',
      emoji: '🎯',
    });
    setEditingGoal(null);
    setShowForm(false);
  };

  const getProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysLeft = (deadline) => {
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
          Financial Goals
        </h1>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New Goal
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const progress = getProgress(goal.currentAmount, goal.targetAmount);
          const daysLeft = getDaysLeft(goal.deadline);
          const isCompleted = goal.status === 'completed';

          return (
            <div key={goal._id} className={`card ${isCompleted ? 'bg-green-50 border-green-200' : ''}`}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{goal.emoji}</span>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{goal.name}</h3>
                    <span className="text-xs text-gray-500">{goal.category}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingGoal(goal);
                      setFormData(goal);
                      setShowForm(true);
                    }}
                    className="text-purple-600 hover:text-purple-800"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(goal._id)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-gray-700">
                    {formatCurrency(goal.currentAmount, userCurrency)} / {formatCurrency(goal.targetAmount, userCurrency)}
                  </span>
                  <span className="text-purple-600 font-bold">{progress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      isCompleted ? 'bg-green-500' : 'bg-gradient-to-r from-purple-500 to-purple-600'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{daysLeft} days left</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">
                    {formatCurrency(((goal.targetAmount - goal.currentAmount) / (daysLeft || 1)), userCurrency)}/day
                  </span>
                </div>
              </div>

              {!isCompleted && (
                <button
                  onClick={() => handleAddAmount(goal._id)}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <DollarSign className="w-4 h-4" />
                  Add Money
                </button>
              )}

              {isCompleted && (
                <div className="text-center py-2 bg-green-100 rounded-lg">
                  <span className="text-green-700 font-semibold">🎉 Goal Completed!</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {goals.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No goals yet. Create your first financial goal!</p>
        </div>
      )}

      {/* Goal Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingGoal ? 'Edit Goal' : 'Create New Goal'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Goal Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Emoji</label>
                <div className="grid grid-cols-6 gap-2">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData({ ...formData, emoji })}
                      className={`text-2xl p-2 rounded-lg hover:bg-purple-100 ${
                        formData.emoji === emoji ? 'bg-purple-200 ring-2 ring-purple-500' : 'bg-gray-50'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount</label>
                <input
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  className="input-field"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 btn-primary">
                  {editingGoal ? 'Update' : 'Create'} Goal
                </button>
                <button type="button" onClick={resetForm} className="flex-1 btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsPage;

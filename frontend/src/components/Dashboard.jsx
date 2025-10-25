import React, { useState, useEffect, useMemo } from 'react';
import { transactionAPI } from '../services/api';
import { TrendingUp, TrendingDown, Wallet, Calendar, DollarSign } from 'lucide-react';
import Charts from './Charts';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/currencyUtils';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const userCurrency = user?.currency || 'USD';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transRes, statsRes] = await Promise.all([
        transactionAPI.getAll({}),
        transactionAPI.getStatistics(),
      ]);
      setTransactions(transRes.data);
      setStatistics(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const last30Days = useMemo(() => {
    const now = new Date();
    const cutoff = new Date(now);
    cutoff.setDate(now.getDate() - 30);
    return transactions.filter(t => new Date(t.date) >= cutoff);
  }, [transactions]);

  const recentIncome = useMemo(() => last30Days.filter(t => t.type === 'income'), [last30Days]);
  const recentExpenses = useMemo(() => last30Days.filter(t => t.type === 'expense'), [last30Days]);

  const expensePieData = useMemo(() => {
    const byCat = recentExpenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    return Object.entries(byCat).map(([name, value]) => ({ name, value }));
  }, [recentExpenses]);

  const incomePieData = useMemo(() => {
    const byCat = recentIncome.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    return Object.entries(byCat).map(([name, value]) => ({ name, value }));
  }, [recentIncome]);

  const totalIncomeL30D = useMemo(() => 
    recentIncome.reduce((sum, t) => sum + t.amount, 0), 
    [recentIncome]
  );

  const totalExpenseL30D = useMemo(() => 
    recentExpenses.reduce((sum, t) => sum + t.amount, 0), 
    [recentExpenses]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Income</p>
              <p className="text-3xl font-bold mt-2">
                {formatCurrency(statistics?.totalIncome || 0, userCurrency)}
              </p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Expenses</p>
              <p className="text-3xl font-bold mt-2">
                {formatCurrency(statistics?.totalExpense || 0, userCurrency)}
              </p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <TrendingDown className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-indigo-500 to-indigo-600 text-white transform hover:scale-105 transition-transform duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Balance</p>
              <p className="text-3xl font-bold mt-2">
                {formatCurrency(statistics?.balance || 0, userCurrency)}
              </p>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <Wallet className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Expenses Section - Pie Chart + Full Transaction List */}
      <div className="card mb-8">
        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-6">
          Recent Expenses (Last 30 Days)
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pie Chart */}
          <div className="lg:col-span-1">
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={expensePieData} 
                    dataKey="value" 
                    nameKey="name" 
                    outerRadius={100}
                    innerRadius={60}
                    fill="#a855f7"
                    paddingAngle={3}
                    label={({ percent }) => percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''}
                  >
                    {expensePieData.map((_, i) => (
                      <Cell 
                        key={i} 
                        fill={['#9333ea','#a855f7','#c084fc','#7e22ce','#d8b4fe','#6b21a8'][i % 6]}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(v) => formatCurrency(v, userCurrency)}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '2px solid #9333ea',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Transaction List - Full Column */}
          <div className="lg:col-span-2">
            <div className="h-80 overflow-y-auto">
              {recentExpenses.length > 0 ? (
                <div className="space-y-2">
                  {recentExpenses.map((transaction) => (
                    <div key={transaction._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-2xl">{transaction.emoji || '💰'}</div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{transaction.description}</div>
                          <div className="text-sm text-gray-500">{transaction.category} • {format(new Date(transaction.date), 'MMM dd, yyyy')}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-red-600">
                          -{formatCurrency(transaction.amount, transaction.currency || userCurrency)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">No expenses in the last 30 days</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Income Section - Pie Chart + Full Transaction List */}
      <div className="card mb-8">
        <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-6">
          Recent Income (Last 30 Days)
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pie Chart */}
          <div className="lg:col-span-1">
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={incomePieData} 
                    dataKey="value" 
                    nameKey="name" 
                    outerRadius={100}
                    innerRadius={60}
                    fill="#10b981"
                    paddingAngle={3}
                    label={({ percent }) => percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''}
                  >
                    {incomePieData.map((_, i) => (
                      <Cell 
                        key={i} 
                        fill={['#10b981','#059669','#34d399','#6ee7b7','#a7f3d0'][i % 5]}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(v) => formatCurrency(v, userCurrency)}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '2px solid #10b981',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Transaction List - Full Column */}
          <div className="lg:col-span-2">
            <div className="h-80 overflow-y-auto">
              {recentIncome.length > 0 ? (
                <div className="space-y-2">
                  {recentIncome.map((transaction) => (
                    <div key={transaction._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-2xl">{transaction.emoji || '💰'}</div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{transaction.description}</div>
                          <div className="text-sm text-gray-500">{transaction.category} • {format(new Date(transaction.date), 'MMM dd, yyyy')}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">
                          +{formatCurrency(transaction.amount, transaction.currency || userCurrency)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">No income in the last 30 days</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expenses by Category and Other Graphs */}
      {statistics && <Charts statistics={statistics} />}

      {/* Financial Review - Last 30 Days */}
      <div className="card mt-8">
        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-6">
          Financial Review (Last 30 Days)
        </h3>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">Income</span>
            </div>
            <p className="text-2xl font-bold text-green-700">{formatCurrency(totalIncomeL30D, userCurrency)}</p>
            <p className="text-xs text-green-600 mt-1">{recentIncome.length} transactions</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Expenses</span>
            </div>
            <p className="text-2xl font-bold text-purple-700">{formatCurrency(totalExpenseL30D, userCurrency)}</p>
            <p className="text-xs text-purple-600 mt-1">{recentExpenses.length} transactions</p>
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-800">Net Change</span>
            </div>
            <p className={`text-2xl font-bold ${totalIncomeL30D - totalExpenseL30D >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {formatCurrency(totalIncomeL30D - totalExpenseL30D, userCurrency)}
            </p>
            <p className="text-xs text-indigo-600 mt-1">Last 30 days</p>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Recent Transactions
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {last30Days.slice(0, 10).map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                      {format(new Date(transaction.date), 'MMM dd')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <span>{transaction.emoji || '💰'}</span>
                        <span>{transaction.description}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{transaction.category}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-right">
                      <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount, transaction.currency || userCurrency)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {last30Days.length > 10 && (
            <p className="text-center text-sm text-gray-500 mt-4">
              Showing 10 of {last30Days.length} transactions
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useEffect, useState } from 'react';
import { transactionAPI } from '../../services/api';
import { Plus } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import TransactionForm from '../TransactionForm';
import TransactionList from '../TransactionList';

const ExpensesPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const { data } = await transactionAPI.getAll({ type: 'expense' });
    setTransactions(data);
    const grouped = data.reduce((acc, t) => {
      const key = new Date(t.date).toISOString().slice(0, 10);
      acc[key] = (acc[key] || 0) + t.amount;
      return acc;
    }, {});
    const rows = Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, amount]) => ({ date, amount }));
    setChartData(rows);
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Expenses Overview</h2>
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add Expense
          </button>
        </div>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#a855f7" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Expense Transactions</h3>
        <TransactionList transactions={transactions} onEdit={() => {}} onDelete={() => {}} />
      </div>

      {showForm && (
        <TransactionForm onClose={() => { setShowForm(false); load(); }} transaction={null} />
      )}
    </div>
  );
};

export default ExpensesPage;



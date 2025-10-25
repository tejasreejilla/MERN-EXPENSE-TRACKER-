import React, { useState, useEffect } from 'react';
import { transactionAPI } from '../../services/api';
import { Plus, Download } from 'lucide-react';
import TransactionList from '../TransactionList';
import TransactionForm from '../TransactionForm';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: '', category: '' });

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await transactionAPI.getAll(filter);
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setShowForm(true);
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTransaction(null);
    fetchData();
  };

  const downloadTransactions = (type = 'all') => {
    let dataToDownload = transactions;
    let filename = 'all_transactions';

    if (type === 'income') {
      dataToDownload = transactions.filter(t => t.type === 'income');
      filename = 'income_records';
    } else if (type === 'expense') {
      dataToDownload = transactions.filter(t => t.type === 'expense');
      filename = 'expense_records';
    }

    // Convert to CSV
    const headers = ['Date', 'Description', 'Category', 'Amount', 'Type'];
    const csvContent = [
      headers.join(','),
      ...dataToDownload.map(t => [
        new Date(t.date).toLocaleDateString(),
        `"${t.description}"`,
        t.category,
        t.amount,
        t.type
      ].join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
            All Transactions
          </h2>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => downloadTransactions('all')} className="btn-secondary flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download All</span>
            </button>
            <button onClick={() => downloadTransactions('income')} className="btn-secondary flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Income</span>
            </button>
            <button onClick={() => downloadTransactions('expense')} className="btn-secondary flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Expenses</span>
            </button>
            <button onClick={handleAddTransaction} className="btn-primary flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          <select
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            className="input-field"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <TransactionList
          transactions={transactions}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
        />
      </div>

      {showForm && (
        <TransactionForm
          transaction={editingTransaction}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default TransactionsPage;

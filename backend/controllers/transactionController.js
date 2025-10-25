import Transaction from '../models/Transaction.js';

export const getTransactions = async (req, res) => {
  try {
    const { startDate, endDate, type, category } = req.query;

    let query = { user: req.user._id };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (type) {
      query.type = type;
    }

    if (category) {
      query.category = category;
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (transaction && transaction.user.toString() === req.user._id.toString()) {
      res.json(transaction);
    } else {
      res.status(404).json({ message: 'Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { type, category, amount, description, date, emoji, currency, receipt } = req.body;

    const transaction = await Transaction.create({
      user: req.user._id,
      type,
      category,
      amount,
      description,
      emoji: emoji || '💰',
      currency: currency || 'USD',
      receipt: receipt || '',
      date: date || Date.now(),
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (transaction && transaction.user.toString() === req.user._id.toString()) {
      transaction.type = req.body.type || transaction.type;
      transaction.category = req.body.category || transaction.category;
      transaction.amount = req.body.amount || transaction.amount;
      transaction.description = req.body.description || transaction.description;
      transaction.date = req.body.date || transaction.date;

      const updatedTransaction = await transaction.save();
      res.json(updatedTransaction);
    } else {
      res.status(404).json({ message: 'Transaction not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (transaction && transaction.user.toString() === req.user._id.toString()) {
      await Transaction.deleteOne({ _id: req.params.id });
      res.json({ message: 'Transaction removed' });
    } else {
      res.status(404).json({ message: 'Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        }
      };
    }

    const transactions = await Transaction.find({
      user: req.user._id,
      ...dateFilter,
    });

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryBreakdown = transactions.reduce((acc, t) => {
      if (!acc[t.category]) {
        acc[t.category] = { income: 0, expense: 0 };
      }
      acc[t.category][t.type] += t.amount;
      return acc;
    }, {});

    const monthlyData = transactions.reduce((acc, t) => {
      const month = new Date(t.date).toISOString().slice(0, 7);
      if (!acc[month]) {
        acc[month] = { income: 0, expense: 0 };
      }
      acc[month][t.type] += t.amount;
      return acc;
    }, {});

    res.json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      categoryBreakdown,
      monthlyData,
      transactionCount: transactions.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAllCurrency = async (req, res) => {
  try {
    const { currency } = req.body;
    
    await Transaction.updateMany(
      { user: req.user._id },
      { $set: { currency: currency } }
    );
    
    res.json({ message: 'All transactions updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a goal name'],
    trim: true,
  },
  targetAmount: {
    type: Number,
    required: [true, 'Please provide a target amount'],
    min: [0, 'Target amount cannot be negative'],
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Current amount cannot be negative'],
  },
  currency: {
    type: String,
    default: 'USD',
  },
  deadline: {
    type: Date,
    required: [true, 'Please provide a deadline'],
  },
  category: {
    type: String,
    enum: ['Savings', 'Emergency Fund', 'Vacation', 'Investment', 'Purchase', 'Other'],
    default: 'Savings',
  },
  emoji: {
    type: String,
    default: '🎯',
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

goalSchema.index({ user: 1, status: 1 });

const Goal = mongoose.model('Goal', goalSchema);

export default Goal;

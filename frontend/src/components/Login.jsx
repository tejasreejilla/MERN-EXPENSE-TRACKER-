import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, Wallet, TrendingUp, PieChart, Shield } from 'lucide-react';

const Login = ({ onToggle }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-purple-100 to-indigo-100 px-4 py-12">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Project Info */}
        <div className="space-y-8 animate-fade-in hidden lg:block">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-500 rounded-2xl mb-4 shadow-lg">
              <Wallet className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold leading-tight text-gray-800">
              Smart Finance<br />Management
            </h1>
            <p className="text-xl text-gray-600">
              Track, analyze, and optimize your income and expenses with powerful insights
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-4 bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all">
              <div className="bg-purple-500 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">Real-time Tracking</h3>
                <p className="text-gray-600 text-sm">Monitor your transactions instantly and stay on top of your finances</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all">
              <div className="bg-purple-500 p-3 rounded-lg">
                <PieChart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">Visual Analytics</h3>
                <p className="text-gray-600 text-sm">Beautiful charts and graphs to understand your spending patterns</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all">
              <div className="bg-purple-500 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">Secure & Private</h3>
                <p className="text-gray-600 text-sm">Your financial data is encrypted and protected with industry standards</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 animate-fade-in">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to manage your finances</p>
          </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-transform"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={onToggle}
              className="text-purple-600 hover:text-purple-700 font-semibold hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

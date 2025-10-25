import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Wallet, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-purple-500 p-2 rounded-lg group-hover:bg-purple-600 transition-all shadow-md">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">
              Income & Expense Tracker
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center hover:bg-purple-200 transition-all text-lg">
                {user?.avatar || <User className="w-5 h-5 text-purple-600" />}
              </div>
              <span className="hidden sm:block font-medium">{user?.name}</span>
            </Link>
            <button
              onClick={logout}
              className="flex items-center space-x-2 btn-secondary"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

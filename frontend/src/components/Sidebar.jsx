import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, TrendingUp, TrendingDown, Target, LogOut, User, Receipt, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FeedbackModal from './FeedbackModal';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [showFeedback, setShowFeedback] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
      isActive ? 'bg-purple-100 text-purple-800 font-semibold shadow-md' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
    }`;

  return (
    <>
      <aside className="h-screen sticky top-0 w-72 bg-white border-r border-purple-200 p-4 hidden md:flex md:flex-col">
        <div className="flex items-center gap-3 mb-6 p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-lg text-2xl">
            {user?.avatar || <User className="w-6 h-6 text-white" />}
          </div>
          <div>
            <div className="text-xs text-purple-600 font-medium">Signed in as</div>
            <div className="text-base font-bold text-gray-900 truncate">{user?.name}</div>
          </div>
        </div>

        <nav className="space-y-2">
          <NavLink to="/" className={navLinkClass} end>
            <LayoutGrid className="w-5 h-5" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/transactions" className={navLinkClass}>
            <Receipt className="w-5 h-5" />
            <span>Transactions</span>
          </NavLink>
          <NavLink to="/income" className={navLinkClass}>
            <TrendingUp className="w-5 h-5" />
            <span>Income</span>
          </NavLink>
          <NavLink to="/expenses" className={navLinkClass}>
            <TrendingDown className="w-5 h-5" />
            <span>Expenses</span>
          </NavLink>
          <NavLink to="/goals" className={navLinkClass}>
            <Target className="w-5 h-5" />
            <span>Goals</span>
          </NavLink>
          <NavLink to="/profile" className={navLinkClass}>
            <User className="w-5 h-5" />
            <span>Profile</span>
          </NavLink>
        </nav>

        <div className="mt-auto pt-4 space-y-2">
          <button 
            onClick={() => setShowFeedback(true)} 
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2.5 px-4 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Send Feedback</span>
          </button>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 btn-secondary">
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {showFeedback && (
        <FeedbackModal 
          onClose={() => setShowFeedback(false)}
          onSuccess={() => {
            alert('Thank you for your feedback!');
          }}
        />
      )}
    </>
  );
};

export default Sidebar;



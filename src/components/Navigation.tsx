import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Settings, LogOut, Code2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Code2 className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold text-gray-900">DevConnect</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-blue-600 text-gray-900' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>

            <Link
              to="/profile"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/profile') 
                  ? 'bg-blue-600 text-gray-900' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>

            <Link
              to="/profile/edit"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/profile/edit') 
                  ? 'bg-blue-600 text-gray-900' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>

            <div className="flex items-center space-x-3">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="h-8 w-8 rounded-full border border-gray-300"
              />
              <span className="text-sm text-gray-700">{user?.name}</span>
              <button
                onClick={logout}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
import React from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../common/OrgContextProvider';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiAlertTriangle, FiServer, FiBarChart3, FiSettings, FiUser, FiLogOut } = FiIcons;

const Navigation = () => {
  const { user, logout, isProductAdmin } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/alerts', icon: FiAlertTriangle, label: 'Alerts' },
    { path: '/resources', icon: FiServer, label: 'Resources' },
    { path: '/metrics', icon: FiBarChart3, label: 'Metrics' },
    { path: '/settings', icon: FiSettings, label: 'Settings' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm border-r border-gray-200 w-64 min-h-screen">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900">SRE Agent</h1>
        {isProductAdmin && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1 inline-block">
            Product Admin
          </span>
        )}
      </div>

      <div className="px-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
              isActive(item.path)
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <SafeIcon icon={item.icon} className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <SafeIcon icon={FiUser} className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || user?.email}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.org_id && `Org: ${user.org_id}`}
            </p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 w-full"
        >
          <SafeIcon icon={FiLogOut} className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
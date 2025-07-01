import React from 'react';
import { motion } from 'framer-motion';
import { useAlerts } from '../../hooks/useAlerts';
import { useAuth } from '../common/OrgContextProvider';
import AlertsStats from '../alerts/AlertsStats';
import LoadingSpinner from '../common/LoadingSpinner';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiActivity, FiTrendingUp, FiServer, FiAlertTriangle } = FiIcons;

const Dashboard = () => {
  const { currentOrgId, isProductAdmin } = useAuth();
  const { alerts, isLoading } = useAlerts();

  // Defensive check for org context
  if (!isProductAdmin && !currentOrgId) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <SafeIcon icon={FiAlertTriangle} className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-yellow-900 mb-2">No Organization Context</h3>
          <p className="text-yellow-700">
            Unable to load dashboard without organization context. Please contact support.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Overview of your infrastructure health and alerts
          {currentOrgId && (
            <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Org: {currentOrgId}
            </span>
          )}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-blue-100">
              <SafeIcon icon={FiActivity} className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">System Health</p>
              <p className="text-2xl font-bold text-gray-900">98.5%</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-green-100">
              <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Uptime</p>
              <p className="text-2xl font-bold text-gray-900">99.9%</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-purple-100">
              <SafeIcon icon={FiServer} className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Resources</p>
              <p className="text-2xl font-bold text-gray-900">247</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-red-100">
              <SafeIcon icon={FiAlertTriangle} className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Alerts</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? '-' : alerts.filter(a => a.status === 'open').length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Alerts Overview */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Alerts Overview</h2>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <AlertsStats alerts={alerts} isLoading={isLoading} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
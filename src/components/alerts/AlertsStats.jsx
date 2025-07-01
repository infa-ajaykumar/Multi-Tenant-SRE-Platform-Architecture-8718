import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiAlertTriangle, FiAlertCircle, FiInfo, FiCheckCircle } = FiIcons;

/**
 * Alert statistics component
 */
const AlertsStats = ({ alerts, isLoading }) => {
  
  const getStats = () => {
    if (!alerts || alerts.length === 0) {
      return {
        total: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        open: 0,
        acknowledged: 0,
        resolved: 0
      };
    }

    return alerts.reduce((stats, alert) => {
      stats.total++;
      
      // Count by severity
      const severity = alert.severity?.toLowerCase();
      if (severity === 'critical') stats.critical++;
      else if (severity === 'high') stats.high++;
      else if (severity === 'medium') stats.medium++;
      else if (severity === 'low') stats.low++;
      
      // Count by status
      const status = alert.status?.toLowerCase();
      if (status === 'open') stats.open++;
      else if (status === 'acknowledged') stats.acknowledged++;
      else if (status === 'resolved') stats.resolved++;
      
      return stats;
    }, {
      total: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      open: 0,
      acknowledged: 0,
      resolved: 0
    });
  };

  const stats = getStats();

  const statCards = [
    {
      title: 'Total Alerts',
      value: stats.total,
      icon: FiInfo,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'Critical',
      value: stats.critical,
      icon: FiAlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-100'
    },
    {
      title: 'High',
      value: stats.high,
      icon: FiAlertCircle,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    },
    {
      title: 'Open',
      value: stats.open,
      icon: FiAlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-100'
    },
    {
      title: 'Acknowledged',
      value: stats.acknowledged,
      icon: FiInfo,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100'
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      icon: FiCheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-100'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${stat.bg}`}>
              <SafeIcon icon={stat.icon} className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? '-' : stat.value}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AlertsStats;
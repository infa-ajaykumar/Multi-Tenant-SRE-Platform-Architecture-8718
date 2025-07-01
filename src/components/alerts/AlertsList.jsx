import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiAlertTriangle, FiAlertCircle, FiInfo, FiCheckCircle, FiClock } = FiIcons;

/**
 * Alerts list component with org-aware rendering
 */
const AlertsList = ({ alerts, totalCount, onAcknowledge, onResolve, isUpdating }) => {
  
  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return { icon: FiAlertTriangle, color: 'text-red-600' };
      case 'high':
        return { icon: FiAlertCircle, color: 'text-orange-600' };
      case 'medium':
        return { icon: FiInfo, color: 'text-yellow-600' };
      case 'low':
        return { icon: FiInfo, color: 'text-blue-600' };
      default:
        return { icon: FiInfo, color: 'text-gray-600' };
    }
  };

  const getSeverityBadge = (severity) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (severity?.toLowerCase()) {
      case 'critical':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'high':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'medium':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'low':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = 'px-2 py-1 text-xs font-medium rounded-full';
    switch (status?.toLowerCase()) {
      case 'open':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'acknowledged':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'resolved':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <SafeIcon icon={FiCheckCircle} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
        <p className="text-gray-500">
          There are no alerts matching your current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          Alerts ({totalCount})
        </h3>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {alerts.map((alert, index) => {
            const severityConfig = getSeverityIcon(alert.severity);
            
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <SafeIcon 
                      icon={severityConfig.icon} 
                      className={`w-5 h-5 mt-0.5 ${severityConfig.color}`} 
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {alert.title}
                        </h4>
                        <span className={getSeverityBadge(alert.severity)}>
                          {alert.severity}
                        </span>
                        <span className={getStatusBadge(alert.status)}>
                          {alert.status}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {alert.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Source: {alert.source}</span>
                        <span>Provider: {alert.cloud_provider?.toUpperCase()}</span>
                        <span>Resource: {alert.resource_id}</span>
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiClock} className="w-3 h-3" />
                          <span>
                            {alert.created_at ? format(new Date(alert.created_at), 'MMM dd, HH:mm') : 'Unknown'}
                          </span>
                        </div>
                      </div>

                      {/* Debug info for org context */}
                      {process.env.NODE_ENV === 'development' && (
                        <div className="mt-2 text-xs text-gray-400">
                          Org ID: {alert.org_id || 'NULL'}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {alert.status === 'open' && (
                      <button
                        onClick={() => onAcknowledge(alert.id)}
                        disabled={isUpdating}
                        className="px-3 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded hover:bg-yellow-200 disabled:opacity-50"
                      >
                        Acknowledge
                      </button>
                    )}
                    
                    {alert.status !== 'resolved' && (
                      <button
                        onClick={() => onResolve(alert.id)}
                        disabled={isUpdating}
                        className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded hover:bg-green-200 disabled:opacity-50"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AlertsList;
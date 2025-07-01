import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAlerts } from '../../hooks/useAlerts';
import { useAuth } from '../common/OrgContextProvider';
import { AlertService } from '../../services/alertService';
import AlertsFilters from './AlertsFilters';
import AlertsList from './AlertsList';
import AlertsStats from './AlertsStats';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiRefreshCw, FiCheckCircle, FiDownload, FiAlertTriangle } = FiIcons;

/**
 * Main alerts page with org-aware functionality
 */
const AlertsPage = () => {
  const { isProductAdmin, currentOrgId } = useAuth();
  const [selectedOrgId, setSelectedOrgId] = useState(null);
  
  // Get target org ID for product admins
  const targetOrgId = isProductAdmin ? selectedOrgId : currentOrgId;
  
  const {
    alerts,
    totalCount,
    isLoading,
    error,
    filters,
    updateFilters,
    acknowledgeAlert,
    resolveAlert,
    refreshAlerts,
    validateAlerts,
    isRefreshing,
    isValidating,
    isUpdating
  } = useAlerts();

  // Handle org selection for product admins
  const handleOrgChange = (orgId) => {
    setSelectedOrgId(orgId);
    // Update URL for product admins
    if (isProductAdmin) {
      const url = new URL(window.location);
      if (orgId) {
        url.searchParams.set('org_id', orgId);
      } else {
        url.searchParams.delete('org_id');
      }
      window.history.replaceState({}, '', url);
    }
  };

  // Handle export
  const handleExport = async () => {
    try {
      const blob = await AlertService.exportAlerts(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `alerts-${targetOrgId || 'all'}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Alerts exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export alerts');
    }
  };

  // Defensive check for org context
  if (!isProductAdmin && !currentOrgId) {
    return (
      <div className="p-6">
        <ErrorMessage 
          title="No Organization Context"
          message="Unable to load alerts without organization context. Please contact support."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorMessage 
          title="Failed to Load Alerts"
          message={error.message || 'An unexpected error occurred'}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>
          <p className="text-gray-600 mt-1">
            Monitor and manage alerts across your infrastructure
            {isProductAdmin && targetOrgId && (
              <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Org: {targetOrgId}
              </span>
            )}
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => refreshAlerts(targetOrgId)}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <SafeIcon 
              icon={FiRefreshCw} 
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} 
            />
            <span>Refresh</span>
          </button>
          
          <button
            onClick={() => validateAlerts(targetOrgId)}
            disabled={isValidating}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <SafeIcon 
              icon={FiCheckCircle} 
              className={`w-4 h-4 ${isValidating ? 'animate-spin' : ''}`} 
            />
            <span>Validate</span>
          </button>
          
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <SafeIcon icon={FiDownload} className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Org Context Warning */}
      {!targetOrgId && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800 font-medium">
              No organization context selected. Please select an organization to view alerts.
            </span>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <AlertsStats alerts={alerts} isLoading={isLoading} />

      {/* Filters */}
      <AlertsFilters 
        filters={filters}
        onFiltersChange={updateFilters}
        isProductAdmin={isProductAdmin}
        selectedOrgId={selectedOrgId}
        onOrgChange={handleOrgChange}
      />

      {/* Alerts List */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <AlertsList
          alerts={alerts}
          totalCount={totalCount}
          onAcknowledge={acknowledgeAlert}
          onResolve={resolveAlert}
          isUpdating={isUpdating}
        />
      )}
    </div>
  );
};

export default AlertsPage;
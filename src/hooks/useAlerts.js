import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { AlertService } from '../services/alertService';
import { useOrgContext } from '../utils/orgContext';
import toast from 'react-hot-toast';

/**
 * Custom hook for alert management with org context
 */
export const useAlerts = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);
  const { currentOrgId, isProductAdmin } = useOrgContext();
  const queryClient = useQueryClient();

  // Query key includes org context
  const queryKey = ['alerts', currentOrgId, filters];

  // Fetch alerts query
  const {
    data: alertsData,
    isLoading,
    error,
    refetch
  } = useQuery(
    queryKey,
    () => AlertService.getAlerts(filters),
    {
      enabled: !!currentOrgId || isProductAdmin,
      refetchInterval: 30000, // Refresh every 30 seconds
      onError: (error) => {
        console.error('Alerts fetch error:', error);
        toast.error('Failed to fetch alerts');
      }
    }
  );

  // Refresh alerts mutation
  const refreshMutation = useMutation(
    (targetOrgId) => AlertService.refreshAlerts(targetOrgId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['alerts']);
        toast.success('Alerts refreshed successfully');
      },
      onError: (error) => {
        console.error('Alerts refresh error:', error);
        toast.error('Failed to refresh alerts');
      }
    }
  );

  // Validate alerts mutation
  const validateMutation = useMutation(
    (targetOrgId) => AlertService.validateAlerts(targetOrgId),
    {
      onSuccess: (data) => {
        toast.success(`Validation complete: ${data.valid_count} valid, ${data.invalid_count} invalid`);
      },
      onError: (error) => {
        console.error('Alerts validation error:', error);
        toast.error('Failed to validate alerts');
      }
    }
  );

  // Update alert mutation
  const updateMutation = useMutation(
    ({ alertId, updates }) => AlertService.updateAlert(alertId, updates),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['alerts']);
        toast.success('Alert updated successfully');
      },
      onError: (error) => {
        console.error('Alert update error:', error);
        toast.error('Failed to update alert');
      }
    }
  );

  // Update filters with defensive checks
  const updateFilters = (newFilters) => {
    // Ensure all filter values are lowercase strings
    const normalizedFilters = Object.entries(newFilters).reduce((acc, [key, value]) => {
      if (value && typeof value === 'string') {
        acc[key] = value.toLowerCase();
      } else if (value !== undefined && value !== null) {
        acc[key] = value;
      }
      return acc;
    }, {});

    setFilters(prev => ({ ...prev, ...normalizedFilters }));
  };

  // Acknowledge alert
  const acknowledgeAlert = (alertId) => {
    updateMutation.mutate({ alertId, updates: { status: 'acknowledged' } });
  };

  // Resolve alert
  const resolveAlert = (alertId) => {
    updateMutation.mutate({ alertId, updates: { status: 'resolved' } });
  };

  // Refresh alerts
  const refreshAlerts = (targetOrgId = null) => {
    refreshMutation.mutate(targetOrgId);
  };

  // Validate alerts
  const validateAlerts = (targetOrgId = null) => {
    validateMutation.mutate(targetOrgId);
  };

  return {
    alerts: alertsData?.alerts || [],
    totalCount: alertsData?.total_count || 0,
    isLoading,
    error,
    filters,
    updateFilters,
    refetch,
    acknowledgeAlert,
    resolveAlert,
    refreshAlerts,
    validateAlerts,
    isRefreshing: refreshMutation.isLoading,
    isValidating: validateMutation.isLoading,
    isUpdating: updateMutation.isLoading
  };
};
import api from './api';
import { orgContextManager } from '../utils/orgContext';
import { AlertSeverity, AlertStatus, CloudProvider, AlertSource } from '../types';

/**
 * Alert service with org-aware operations
 */
export class AlertService {
  
  /**
   * Fetch alerts with org context and filtering
   */
  static async getAlerts(filters = {}) {
    try {
      // Ensure all filter values are lowercase strings
      const normalizedFilters = {
        ...filters,
        severity: filters.severity?.toLowerCase(),
        status: filters.status?.toLowerCase(),
        source: filters.source?.toLowerCase(),
        cloud_provider: filters.cloud_provider?.toLowerCase(),
      };

      // Add org context
      const params = orgContextManager.buildQueryParams(normalizedFilters);
      
      const response = await api.get('/alerts', { params });
      
      // Validate org_id in response data
      this.validateOrgData(response.data.alerts, 'alerts');
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
      throw error;
    }
  }

  /**
   * Refresh alerts for org
   */
  static async refreshAlerts(targetOrgId = null) {
    try {
      const params = orgContextManager.buildQueryParams({}, targetOrgId);
      
      const response = await api.post('/alerts/refresh', {}, { params });
      
      return response.data;
    } catch (error) {
      console.error('Failed to refresh alerts:', error);
      throw error;
    }
  }

  /**
   * Validate alerts configuration
   */
  static async validateAlerts(targetOrgId = null) {
    try {
      const params = orgContextManager.buildQueryParams({}, targetOrgId);
      
      const response = await api.post('/alerts/validate', {}, { params });
      
      return response.data;
    } catch (error) {
      console.error('Failed to validate alerts:', error);
      throw error;
    }
  }

  /**
   * Update alert status
   */
  static async updateAlert(alertId, updates) {
    try {
      const response = await api.patch(`/alerts/${alertId}`, updates);
      
      // Validate org_id in response
      this.validateOrgData([response.data], 'alert update');
      
      return response.data;
    } catch (error) {
      console.error('Failed to update alert:', error);
      throw error;
    }
  }

  /**
   * Acknowledge alert
   */
  static async acknowledgeAlert(alertId) {
    return this.updateAlert(alertId, { status: AlertStatus.ACKNOWLEDGED });
  }

  /**
   * Resolve alert
   */
  static async resolveAlert(alertId) {
    return this.updateAlert(alertId, { status: AlertStatus.RESOLVED });
  }

  /**
   * Export alerts to CSV
   */
  static async exportAlerts(filters = {}) {
    try {
      const normalizedFilters = {
        ...filters,
        severity: filters.severity?.toLowerCase(),
        status: filters.status?.toLowerCase(),
        source: filters.source?.toLowerCase(),
        cloud_provider: filters.cloud_provider?.toLowerCase(),
      };

      const params = orgContextManager.buildQueryParams(normalizedFilters);
      
      const response = await api.get('/alerts/export', { 
        params,
        responseType: 'blob'
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to export alerts:', error);
      throw error;
    }
  }

  /**
   * Validate that data has correct org_id
   */
  static validateOrgData(dataArray, context) {
    const currentOrgId = orgContextManager.getCurrentOrgId();
    
    if (!orgContextManager.isProductAdmin() && currentOrgId) {
      const invalidItems = dataArray.filter(item => 
        !item.org_id || item.org_id !== currentOrgId
      );
      
      if (invalidItems.length > 0) {
        console.error(`Invalid org_id in ${context}:`, invalidItems);
        throw new Error(`Data isolation violation in ${context}`);
      }
    }
  }

  /**
   * Get available filter options
   */
  static getFilterOptions() {
    return {
      severity: Object.values(AlertSeverity),
      status: Object.values(AlertStatus),
      source: Object.values(AlertSource),
      cloud_provider: Object.values(CloudProvider)
    };
  }
}
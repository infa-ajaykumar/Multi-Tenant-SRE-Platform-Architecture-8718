import api from './api';
import { orgContextManager } from '../utils/orgContext';
import { CloudProvider } from '../types';

/**
 * Resource service with org-aware operations
 */
export class ResourceService {
  
  /**
   * Fetch resources with org context and filtering
   */
  static async getResources(filters = {}) {
    try {
      const normalizedFilters = {
        ...filters,
        cloud_provider: filters.cloud_provider?.toLowerCase(),
        resource_type: filters.resource_type?.toLowerCase(),
      };

      const params = orgContextManager.buildQueryParams(normalizedFilters);
      
      const response = await api.get('/resources', { params });
      
      // Validate org_id in response data
      this.validateOrgData(response.data.resources, 'resources');
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch resources:', error);
      throw error;
    }
  }

  /**
   * Refresh resources for org
   */
  static async refreshResources(targetOrgId = null) {
    try {
      const params = orgContextManager.buildQueryParams({}, targetOrgId);
      
      const response = await api.post('/resources/refresh', {}, { params });
      
      return response.data;
    } catch (error) {
      console.error('Failed to refresh resources:', error);
      throw error;
    }
  }

  /**
   * Get resource details
   */
  static async getResource(resourceId) {
    try {
      const response = await api.get(`/resources/${resourceId}`);
      
      // Validate org access
      const currentOrgId = orgContextManager.getCurrentOrgId();
      if (!orgContextManager.isProductAdmin() && 
          response.data.org_id !== currentOrgId) {
        throw new Error('Unauthorized access to resource');
      }
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch resource:', error);
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
      cloud_provider: Object.values(CloudProvider),
      resource_type: ['ec2', 'rds', 'lambda', 'vm', 'storage', 'network']
    };
  }
}
import { UserRole } from '../types';

/**
 * Org context utilities for handling multi-tenancy
 */
export class OrgContextManager {
  constructor() {
    this.currentUser = null;
    this.currentOrgId = null;
  }

  /**
   * Set current user context
   */
  setUser(user) {
    this.currentUser = user;
    this.currentOrgId = user?.org_id || null;
    
    // Defensive check for org_id
    if (!this.currentOrgId && user?.role === UserRole.ORG_USER) {
      console.error('ORG_USER without org_id detected', user);
      throw new Error('Org user must have org_id');
    }
  }

  /**
   * Get current org context
   */
  getCurrentOrgId() {
    return this.currentOrgId;
  }

  /**
   * Check if user is product admin
   */
  isProductAdmin() {
    return this.currentUser?.role === UserRole.PRODUCT_ADMIN;
  }

  /**
   * Get org context for API calls
   * Product admins can override with query param
   */
  getOrgContext(overrideOrgId = null) {
    if (this.isProductAdmin() && overrideOrgId) {
      return overrideOrgId;
    }
    
    if (!this.currentOrgId) {
      console.warn('No org context available');
      return null;
    }
    
    return this.currentOrgId;
  }

  /**
   * Validate org access for current user
   */
  validateOrgAccess(orgId) {
    if (this.isProductAdmin()) {
      return true; // Product admins can access any org
    }
    
    return this.currentOrgId === orgId;
  }

  /**
   * Build query params with org context
   */
  buildQueryParams(params = {}, targetOrgId = null) {
    const orgId = this.getOrgContext(targetOrgId);
    
    if (orgId) {
      params.org_id = orgId;
    }
    
    return params;
  }
}

// Global instance
export const orgContextManager = new OrgContextManager();

/**
 * Hook for React components to use org context
 */
export const useOrgContext = () => {
  return {
    currentOrgId: orgContextManager.getCurrentOrgId(),
    isProductAdmin: orgContextManager.isProductAdmin(),
    getOrgContext: orgContextManager.getOrgContext.bind(orgContextManager),
    validateOrgAccess: orgContextManager.validateOrgAccess.bind(orgContextManager),
    buildQueryParams: orgContextManager.buildQueryParams.bind(orgContextManager)
  };
};
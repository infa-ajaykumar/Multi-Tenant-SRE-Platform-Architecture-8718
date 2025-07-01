/**
 * Test utilities for multi-tenant scenarios
 */

/**
 * Mock user contexts for testing
 */
export const mockUsers = {
  productAdmin: {
    id: 'admin-1',
    email: 'admin@sreagent.com',
    name: 'Product Admin',
    role: 'product_admin',
    org_id: null // Product admins don't have org_id
  },
  
  orgUser1: {
    id: 'user-1',
    email: 'user1@org1.com',
    name: 'Org User 1',
    role: 'org_user',
    org_id: 'org-1'
  },
  
  orgUser2: {
    id: 'user-2',
    email: 'user2@org2.com',
    name: 'Org User 2',
    role: 'org_user',
    org_id: 'org-2'
  },
  
  invalidOrgUser: {
    id: 'user-invalid',
    email: 'invalid@example.com',
    name: 'Invalid User',
    role: 'org_user',
    org_id: null // This should trigger validation errors
  }
};

/**
 * Mock alert data with proper org tagging
 */
export const createMockAlert = (orgId, overrides = {}) => ({
  id: `alert-${Date.now()}`,
  title: 'Test Alert',
  description: 'This is a test alert',
  severity: 'high',
  status: 'open',
  source: 'opsgenie',
  cloud_provider: 'aws',
  resource_id: 'i-1234567890abcdef0',
  resource_type: 'ec2',
  org_id: orgId,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_resolved: false,
  ...overrides
});

/**
 * Generate test data for different orgs
 */
export const generateTestData = () => {
  const org1Alerts = [
    createMockAlert('org-1', { severity: 'critical', title: 'Database Down' }),
    createMockAlert('org-1', { severity: 'high', title: 'High CPU Usage' }),
    createMockAlert('org-1', { severity: 'medium', title: 'Disk Space Warning' })
  ];
  
  const org2Alerts = [
    createMockAlert('org-2', { severity: 'high', title: 'API Errors' }),
    createMockAlert('org-2', { severity: 'low', title: 'Slow Response Time' })
  ];
  
  // Problematic data (should never exist in production)
  const invalidAlerts = [
    createMockAlert(null, { title: 'Alert with null org_id' }),
    createMockAlert(undefined, { title: 'Alert with undefined org_id' })
  ];
  
  return {
    org1Alerts,
    org2Alerts,
    invalidAlerts
  };
};

/**
 * Test org context isolation
 */
export const testOrgIsolation = (alerts, expectedOrgId) => {
  const issues = [];
  
  alerts.forEach((alert, index) => {
    if (!alert.org_id) {
      issues.push(`Alert ${index}: Missing org_id`);
    } else if (alert.org_id !== expectedOrgId) {
      issues.push(`Alert ${index}: Wrong org_id. Expected: ${expectedOrgId}, Got: ${alert.org_id}`);
    }
  });
  
  return {
    passed: issues.length === 0,
    issues
  };
};

/**
 * Simulate API responses for testing
 */
export const mockApiResponses = {
  alerts: {
    success: (orgId) => ({
      alerts: generateTestData().org1Alerts.filter(a => a.org_id === orgId),
      total_count: 3,
      org_id: orgId
    }),
    
    crossOrgLeak: () => ({
      alerts: [
        ...generateTestData().org1Alerts,
        ...generateTestData().org2Alerts
      ],
      total_count: 5
    }),
    
    nullOrgId: () => ({
      alerts: generateTestData().invalidAlerts,
      total_count: 2
    })
  }
};
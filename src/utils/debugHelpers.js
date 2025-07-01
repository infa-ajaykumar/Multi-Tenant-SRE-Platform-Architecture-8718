/**
 * Debug helpers for org context and data isolation
 */

/**
 * Log org context issues
 */
export const logOrgContextIssue = (context, data) => {
  if (process.env.NODE_ENV === 'development') {
    console.group('🔍 Org Context Debug');
    console.log('Context:', context);
    console.log('Data:', data);
    console.log('Org ID present:', !!data?.org_id);
    console.log('Org ID value:', data?.org_id);
    console.groupEnd();
  }
};

/**
 * Validate org data integrity
 */
export const validateOrgData = (dataArray, expectedOrgId, context) => {
  if (!Array.isArray(dataArray)) {
    console.warn(`Invalid data format in ${context}:`, dataArray);
    return false;
  }

  const issues = [];
  
  dataArray.forEach((item, index) => {
    if (!item.org_id) {
      issues.push(`Item ${index}: Missing org_id`);
    } else if (expectedOrgId && item.org_id !== expectedOrgId) {
      issues.push(`Item ${index}: Org ID mismatch. Expected: ${expectedOrgId}, Got: ${item.org_id}`);
    }
  });

  if (issues.length > 0) {
    console.error(`Org data validation failed in ${context}:`, issues);
    return false;
  }

  return true;
};

/**
 * Check enum/string consistency
 */
export const validateEnumValues = (data, field, validValues) => {
  if (!data[field]) return true;
  
  const value = data[field].toLowerCase();
  const isValid = validValues.includes(value);
  
  if (!isValid) {
    console.warn(`Invalid ${field} value: ${data[field]}. Valid values:`, validValues);
  }
  
  return isValid;
};

/**
 * Trace org_id propagation through the stack
 */
export const traceOrgPropagation = (stage, orgId, additionalData = {}) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔄 Org Propagation [${stage}]:`, {
      org_id: orgId,
      is_null: orgId === null,
      is_undefined: orgId === undefined,
      ...additionalData
    });
  }
};

/**
 * Monitor API calls for org context
 */
export const monitorApiCall = (endpoint, params, response) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`📡 API Call: ${endpoint}`);
    console.log('Request params:', params);
    console.log('Has org_id in params:', !!params?.org_id);
    console.log('Response data count:', response?.data?.length || 0);
    
    if (response?.data && Array.isArray(response.data)) {
      const orgIds = [...new Set(response.data.map(item => item.org_id))];
      console.log('Unique org_ids in response:', orgIds);
    }
    
    console.groupEnd();
  }
};
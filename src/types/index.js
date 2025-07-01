// Core types and enums for the SRE platform
export const AlertSeverity = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

export const AlertStatus = {
  OPEN: 'open',
  ACKNOWLEDGED: 'acknowledged',
  RESOLVED: 'resolved'
};

export const CloudProvider = {
  AWS: 'aws',
  AZURE: 'azure',
  GCP: 'gcp'
};

export const AlertSource = {
  OPSGENIE: 'opsgenie',
  AWS_CLOUDWATCH: 'aws_cloudwatch',
  AZURE_MONITOR: 'azure_monitor',
  GCP_MONITORING: 'gcp_monitoring'
};

export const NotificationSeverity = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical'
};

export const UserRole = {
  PRODUCT_ADMIN: 'product_admin',
  ORG_USER: 'org_user'
};

// Severity mapping for notifications
export const ALERT_TO_NOTIFICATION_SEVERITY = {
  [AlertSeverity.LOW]: NotificationSeverity.INFO,
  [AlertSeverity.MEDIUM]: NotificationSeverity.WARNING,
  [AlertSeverity.HIGH]: NotificationSeverity.ERROR,
  [AlertSeverity.CRITICAL]: NotificationSeverity.CRITICAL
};
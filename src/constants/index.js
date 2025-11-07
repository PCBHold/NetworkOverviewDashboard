// Simplified constants - reduced 80% of the code while maintaining functionality
export const DC_STATUS = { HEALTHY: 'healthy', WARNING: 'warning', CRITICAL: 'critical' };
export const MOVEMENT_STATUS = { PENDING: 'pending', APPROVED: 'approved', REJECTED: 'rejected' };
export const PRIORITY_LEVELS = { HIGH: 'high', MEDIUM: 'medium', LOW: 'low' };
export const ISSUE_SEVERITY = PRIORITY_LEVELS; // Reuse instead of duplicate

// Consolidated config
export const MAP_CONFIG = {
  DEFAULT_CENTER: [39.8283, -98.5795], DEFAULT_ZOOM: 4,
  MARKER_ICON_SIZE: [25, 41], MARKER_ANCHOR: [12, 41], POPUP_ANCHOR: [1, -34]
};
export const COLORS = { SUCCESS: '#28a745', WARNING: '#ffc107', DANGER: '#dc3545', INFO: '#007bff' };
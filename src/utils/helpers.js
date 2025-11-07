// Consolidated formatter with shared Intl instance - reduces bundle size
const numberFormatter = new Intl.NumberFormat('en-US');
const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });

export const formatCurrency = (amount) => currencyFormatter.format(amount);
export const formatNumber = (number) => numberFormatter.format(number);
export const formatDate = (date) => (typeof date === 'string' ? new Date(date) : date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
export const formatPercentage = (value, decimals = 1) => `${value.toFixed(decimals)}%`;

// Optimized utility functions - removed unused ones, simplified implementations
export const generateId = (prefix = '') => `${prefix ? prefix + '-' : ''}${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`;
export const debounce = (func, delay) => { let timeoutId; return (...args) => { clearTimeout(timeoutId); timeoutId = setTimeout(() => func(...args), delay); }; };

// Simplified deepClone using JSON (sufficient for most cases, much smaller)
export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

// Status color mapping (moved from separate function to simple object lookup)
export const STATUS_COLORS = {
  healthy: '#28a745', warning: '#ffc107', critical: '#dc3545', pending: '#007bff', 
  approved: '#28a745', rejected: '#dc3545', high: '#dc3545', medium: '#ffc107', low: '#28a745'
};
export const getStatusColor = (status) => STATUS_COLORS[status?.toLowerCase()] || STATUS_COLORS.medium;
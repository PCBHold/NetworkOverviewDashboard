import React, { memo } from 'react';
import PropTypes from 'prop-types';
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Typography,
} from '@mui/material';
import { formatCurrency, formatNumber } from '../../utils/helpers';
import './MaterialUI.css';

export const StatusBadge = ({ status, variant = 'status' }) => {
  if (!status) return null;
  
  const getStatusClass = () => {
    if (variant === 'priority' || variant === 'severity') {
      const map = { high: 'critical', medium: 'warning', low: 'healthy' };
      return map[status] || 'pending';
    }
    return status || 'pending';
  };
  
  return (
    <Chip
      label={status.toUpperCase()}
      className={`status-chip ${getStatusClass()}`}
      size="small"
      role="status"
      aria-label={`${variant} status: ${status}`}
    />
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string,
  variant: PropTypes.oneOf(['priority', 'severity', 'status'])
};

export const Button = ({ 
  variant = 'primary', 
  size = 'medium', 
  type = 'button',
  disabled, 
  loading, 
  onClick, 
  ariaLabel, 
  children, 
  ...props 
}) => {
  const getMuiVariant = (variant) => {
    if (variant === 'secondary') return 'outlined';
    return 'contained';
  };

  return (
    <MuiButton
      variant={getMuiVariant(variant)}
      size={size}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel}
      type={type}
      className={`mui-button ${variant}`}
      startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </MuiButton>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  ariaLabel: PropTypes.string,
  children: PropTypes.node,
  type: PropTypes.oneOf(['button', 'submit', 'reset'])
};

export const LoadingSpinner = ({ size = 'medium', color = 'primary' }) => {
  const sizeMap = {
    small: 20,
    medium: 40,
    large: 60
  };

  return (
    <div className="loading-spinner-container">
      <CircularProgress
        size={sizeMap[size] || 40}
        color={color}
      />
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['primary', 'secondary', 'error', 'warning', 'info', 'success'])
};

export const Card = ({ title, children, className = '', role = 'region', ariaLabel, ...props }) => (
  <MuiCard 
    className={`mui-card ${className}`}
    role={role}
    aria-label={ariaLabel || (title ? `${title} section` : undefined)}
    {...props}
  >
    {title && (
      <CardHeader
        className="mui-card-header"
        title={
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
        }
      />
    )}
    <CardContent className="mui-card-content">
      {children}
    </CardContent>
  </MuiCard>
);

Card.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  role: PropTypes.string,
  ariaLabel: PropTypes.string
};

export const MetricDisplay = memo(({ label, value, change, trend, icon: Icon, format = 'text' }) => {
  const formatValue = (val) => ({
    currency: () => formatCurrency(val),
    percentage: () => `${val}%`,
    number: () => formatNumber(val),
    text: () => val
  }[format] || (() => val))();

  const trendText = trend === 'positive' ? 'increase' : 'decrease';
  const changeText = change ? `, ${trendText} of ${change}` : '';

  return (
    <div 
      className="metric-display"
      role="group" 
      aria-label={`${label}: ${formatValue(value)}${changeText}`}
    >
      <div className="metric-display-content">
        {Icon && (
          <div className="metric-display-icon">
            <Icon size={24} aria-hidden="true" />
          </div>
        )}
        <div className="metric-display-info">
          <Typography variant="body2" className="metric-display-label" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h6" className="metric-display-value" component="div" aria-live="polite">
            {formatValue(value)}
          </Typography>
        </div>
      </div>
      {change && (
        <div>
          <Typography 
            variant="body2"
            className={`metric-display-change ${trend}`}
            aria-label={`Change: ${change} ${trendText}`}
          >
            {change}
          </Typography>
        </div>
      )}
    </div>
  );
});

MetricDisplay.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  change: PropTypes.string,
  trend: PropTypes.oneOf(['positive', 'negative']),
  icon: PropTypes.elementType,
  format: PropTypes.oneOf(['currency', 'percentage', 'number', 'text'])
};


export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorId: null };
  }

  static getDerivedStateFromError(error) {
    const errorId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return { hasError: true, error, errorId };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error caught by boundary:', {
      errorId: this.state.errorId,
      error: error.toString(),
      errorInfo,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorId: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback, showErrorDetails = true } = this.props;

      if (Fallback) {
        return <Fallback error={this.state.error} onRetry={this.handleRetry} onReload={this.handleReload} />;
      }

      return (
        <div className="error-boundary-container">
          <Typography variant="h5" className="error-boundary-title">
            Something went wrong
          </Typography>
          <Typography variant="body1" className="error-boundary-message">
            We apologize for the inconvenience. This error has been logged for review.
          </Typography>

          <div className="error-boundary-actions">
            <MuiButton
              variant="contained"
              color="primary"
              onClick={this.handleRetry}
            >
              Try Again
            </MuiButton>
            <MuiButton
              variant="outlined"
              color="secondary"
              onClick={this.handleReload}
            >
              Reload Page
            </MuiButton>
          </div>

          {showErrorDetails && process.env.NODE_ENV === 'development' && (
            <div className="error-boundary-details">
              <Typography variant="subtitle2" className="error-boundary-details-title">
                Error details (development only):
              </Typography>
              <Typography variant="body2" component="div">
                <strong>Error ID:</strong> {this.state.errorId}
                <br />
                <strong>Message:</strong> {this.state.error?.message}
                <br />
                <strong>Stack:</strong>
                <pre className="error-boundary-stack">
                  {this.state.error?.stack}
                </pre>
              </Typography>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.elementType,
  showErrorDetails: PropTypes.bool
};

export { default as ThemeToggle } from './ThemeToggle';

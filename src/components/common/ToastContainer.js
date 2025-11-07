import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';
import './ToastContainer.css';

const Toast = memo(({ id, message, type, onClose }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  };

  const IconComponent = icons[type] || Info;

  return (
    <div className={`toast toast--${type}`}>
      <IconComponent size={20} className="toast-icon" />
      <div className="toast-message">
        {message}
      </div>
      <button
        onClick={() => onClose(id)}
        className="toast-close-button"
        aria-label="Close notification"
      >
        <X size={18} />
      </button>
    </div>
  );
});

Toast.propTypes = {
  id: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired,
  onClose: PropTypes.func.isRequired
};

const ToastContainer = memo(({ toasts, onRemoveToast }) => {
  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={onRemoveToast}
        />
      ))}
    </div>
  );
});

ToastContainer.propTypes = {
  toasts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['success', 'error', 'warning', 'info']).isRequired
  })).isRequired,
  onRemoveToast: PropTypes.func.isRequired
};

export default memo(ToastContainer);
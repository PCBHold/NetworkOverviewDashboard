import React from 'react';
import { CircularProgress } from '@mui/material';
import './LoadingFallback.css';

const LoadingFallback = ({ message = 'Loading...' }) => (
  <div className="loading-fallback">
    <CircularProgress size={40} />
    <span className="loading-message">{message}</span>
  </div>
);

export default LoadingFallback;
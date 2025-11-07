import React, { Suspense, lazy } from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary, ThemeToggle } from './components/common';
import ToastContainer from './components/common/ToastContainer';
import LoadingFallback from './components/common/LoadingFallback';
import { ToastProvider, useToast } from './contexts/ToastContext';

// Lazy load components for better performance
const NetworkHealthMap = lazy(() => import('./components/NetworkHealthMap'));
const InventoryMovements = lazy(() => import('./components/InventoryMovements'));
const MovementImpact = lazy(() => import('./components/MovementImpact'));
const IssuesWidgets = lazy(() => import('./components/IssuesWidgets'));

const AppContent = () => {
  const { toasts, removeToast } = useToast();

  return (
    <ErrorBoundary>
      <div className="dashboard" role="main" aria-label="Network Dashboard">
        <header className="dashboard-header" role="banner">
          <div>
            <h1 className="dashboard-title">Network Overview</h1>
            <div className="dashboard-subtitle">
              Real-time distribution center monitoring and inventory management
            </div>
          </div>
          <ThemeToggle />
        </header>
        
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback message="Loading map" />}>
            <NetworkHealthMap />
          </Suspense>
        </ErrorBoundary>
        
        <div className="main-content" role="region" aria-label="Main content area">
          <div className="left-panel" role="region" aria-label="Inventory movements panel">
            <ErrorBoundary>
              <Suspense fallback={<LoadingFallback message="Loading inventory" />}>
                <InventoryMovements />
              </Suspense>
            </ErrorBoundary>
          </div>
          
          <div className="right-panel" role="region" aria-label="Metrics and issues panel">
            <ErrorBoundary>
              <Suspense fallback={<LoadingFallback message="Loading metrics" />}>
                <MovementImpact />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
        
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback message="Loading issues" />}>
            <IssuesWidgets />
          </Suspense>
        </ErrorBoundary>

        <ToastContainer 
          toasts={toasts} 
          onRemoveToast={removeToast} 
        />
      </div>
    </ErrorBoundary>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
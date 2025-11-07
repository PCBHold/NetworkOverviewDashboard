import { useState, useCallback, useMemo } from 'react';
import { MOVEMENT_STATUS } from '../constants';

/**
 * Custom hook for managing inventory movements
 * @param {Array} initialMovements - Initial movements data
 * @returns {Object} Hook return object with movements state and actions
 */
export const useMovements = (initialMovements = []) => {
  const [movements, setMovements] = useState(initialMovements);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Approve a movement
  const approveMovement = useCallback(async (movementId) => {
    if (!movementId) {
      const errorMessage = 'Movement ID is required';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }

    setLoading(true);
    setError(null);
    
    try {
      // Validate movement exists
      const movement = movements.find(m => m.id === movementId);
      if (!movement) {
        throw new Error('Movement not found');
      }

      if (movement.status === MOVEMENT_STATUS.APPROVED) {
        throw new Error('Movement is already approved');
      }

      // Fast optimistic update for better UX
      setMovements(prevMovements => 
        prevMovements.map(movement => 
          movement.id === movementId 
            ? { ...movement, status: MOVEMENT_STATUS.APPROVED, approvedAt: new Date() }
            : movement
        )
      );
      
      // Simulate quick API call (reduced delay for performance)
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return { success: true, message: 'Movement approved successfully' };
    } catch (err) {
      // Revert optimistic update on error
      setMovements(prevMovements => 
        prevMovements.map(movement => 
          movement.id === movementId 
            ? { ...movement, status: movement.originalStatus || MOVEMENT_STATUS.PENDING, approvedAt: undefined }
            : movement
        )
      );

      const errorMessage = err.message || 'Failed to approve movement. Please try again.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [movements]);

  // Reject a movement
  const rejectMovement = useCallback(async (movementId) => {
    if (!movementId) {
      const errorMessage = 'Movement ID is required';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }

    setLoading(true);
    setError(null);
    
    try {
      // Validate movement exists
      const movement = movements.find(m => m.id === movementId);
      if (!movement) {
        throw new Error('Movement not found');
      }

      if (movement.status === MOVEMENT_STATUS.REJECTED) {
        throw new Error('Movement is already rejected');
      }
      
      // Optimistic update - remove from list
      setMovements(prevMovements => 
        prevMovements.filter(movement => movement.id !== movementId)
      );
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { success: true, message: 'Movement rejected and removed' };
    } catch (err) {
      const errorMessage = err.message || 'Failed to reject movement. Please try again.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [movements]);

  // Simplified selectors - removed unused functions, kept only what's needed
  const getPendingCount = useCallback(() => movements.filter(movement => movement.status === MOVEMENT_STATUS.PENDING).length, [movements]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    movements, loading, error,
    actions: { approveMovement, rejectMovement, clearError },
    selectors: { getPendingCount }
  };
};

/**
 * Custom hook for managing toast notifications
 * @returns {Object} Hook return object with toast state and actions
 */
// Toast functionality moved to contexts/ToastContext.js

/**
 * Custom hook for local storage with JSON serialization
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {Array} [value, setValue] tuple
 */
/**
 * Custom hook for managing table data with sorting, filtering, and pagination
 * @param {Array} data - The data array to manage
 * @param {Object} config - Configuration object
 * @returns {Object} Hook return object with table state and actions
 */
export const useTableData = (data = [], config = {}) => {
  const {
    initialSort = null,
    initialFilter = '',
    pageSize = 10
  } = config;

  const [sortConfig, setSortConfig] = useState(initialSort);
  const [filterText, setFilterText] = useState(initialFilter);
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting logic
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  // Filtering logic
  const filteredData = useMemo(() => {
    if (!filterText) return sortedData;

    return sortedData.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(filterText.toLowerCase())
      )
    );
  }, [sortedData, filterText]);

  // Pagination logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Actions
  const handleSort = useCallback((key) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const handleFilter = useCallback((text) => {
    setFilterText(text);
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  return {
    data: paginatedData,
    allData: filteredData,
    totalItems: filteredData.length,
    currentPage,
    totalPages,
    sortConfig,
    filterText,
    actions: {
      handleSort,
      handleFilter,
      handlePageChange
    }
  };
};

/**
 * Custom hook for local storage with JSON serialization
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {Array} [value, setValue] tuple
 */
export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      // Clear corrupted data
      try {
        window.localStorage.removeItem(key);
      } catch (clearError) {
        console.warn(`Error clearing localStorage key "${key}":`, clearError);
      }
      return defaultValue;
    }
  });

  const setStoredValue = useCallback((newValue) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
      // Try to clear space if quota exceeded
      if (error.name === 'QuotaExceededError') {
        try {
          // Clear all localStorage as last resort
          window.localStorage.clear();
          console.warn('Cleared all localStorage due to quota exceeded');
        } catch (clearError) {
          console.error('Failed to clear localStorage:', clearError);
        }
      }
    }
  }, [key, value]);

  return [value, setStoredValue];
};

/**
 * Custom hook for managing async operations with loading and error states
 * @param {Function} asyncFunction - The async function to execute
 * @returns {Object} Hook return object with execute function and state
 */
export const useAsyncOperation = (asyncFunction) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await asyncFunction(...args);
      setData(result);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [asyncFunction]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    execute,
    reset
  };
};
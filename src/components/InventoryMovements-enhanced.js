import React, { useCallback, memo, useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Toolbar,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Search, Download, Filter, X } from 'lucide-react';
import { inventoryMovements, distributionCenters } from '../data/mockData';
import { useMovements } from '../hooks';
import { useToast } from '../contexts/ToastContext';
import { StatusBadge, Button, LoadingSpinner, Card } from './common';
import { formatCurrency, formatNumber, formatDate } from '../utils/helpers';
import { exportMovementsToCSV } from '../utils/export';
import './InventoryMovements.css';

const InventoryMovements = () => {
  const { movements, loading, error, actions } = useMovements(inventoryMovements);
  const toast = useToast();

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  const getDCName = useCallback((dcId) => {
    const dc = distributionCenters.find(center => center.id === dcId);
    return dc?.name ?? dcId;
  }, []);

  // Filter and sort movements
  const filteredAndSortedMovements = useMemo(() => {
    let result = [...movements];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        (m) =>
          m.sku.toLowerCase().includes(search) ||
          m.description.toLowerCase().includes(search) ||
          getDCName(m.originDC).toLowerCase().includes(search) ||
          getDCName(m.destinationDC).toLowerCase().includes(search)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter((m) => m.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      result = result.filter((m) => m.priority === priorityFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      // Handle special cases
      if (sortBy === 'originDC' || sortBy === 'destinationDC') {
        aVal = getDCName(aVal);
        bVal = getDCName(bVal);
      }

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return result;
  }, [movements, searchTerm, statusFilter, priorityFilter, sortBy, sortDirection, getDCName]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
  };

  const handleExport = useCallback(() => {
    try {
      exportMovementsToCSV(filteredAndSortedMovements, getDCName);
      toast.success(`Exported ${filteredAndSortedMovements.length} movements to CSV`);
    } catch (err) {
      toast.error('Failed to export data');
      console.error('Export error:', err);
    }
  }, [filteredAndSortedMovements, getDCName, toast]);

  const handleApprove = useCallback(
    async (movementId) => {
      const result = await actions.approveMovement(movementId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    },
    [actions, toast]
  );

  const handleReject = useCallback(
    async (movementId) => {
      const result = await actions.rejectMovement(movementId);
      if (result.success) {
        toast.warning(result.message);
      } else {
        toast.error(result.message);
      }
    },
    [actions, toast]
  );

  const handleView = useCallback(
    (movement) => {
      const movementDetails = `
Movement Details:
• ID: ${movement.id}
• SKU: ${movement.sku}
• Description: ${movement.description}
• Status: ${movement.status}
• Priority: ${movement.priority}
• Category: ${movement.category || 'N/A'}
• From: ${getDCName(movement.originDC)}
• To: ${getDCName(movement.destinationDC)}
• Quantity: ${formatNumber(movement.quantity)} units
• Est. Savings: ${formatCurrency(movement.estimatedSavings)}
• Created: ${formatDate(movement.createdAt)}
• Required By: ${formatDate(movement.requiredBy)}
    `.trim();

      if (toast && typeof toast.info === 'function') {
        toast.info(movementDetails);
      } else {
        alert(movementDetails);
      }
    },
    [toast, getDCName]
  );

  if (error) {
    return (
      <Card title="Suggested Inventory Movements" className="inventory-movements">
        <div className="error-message" role="alert">
          <p>Error loading movements: {error}</p>
          <Button onClick={() => actions.clearError()} variant="primary" ariaLabel="Retry loading movements">
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || priorityFilter !== 'all';

  return (
    <Card title="Suggested Inventory Movements" className="inventory-movements">
      {/* Filters Toolbar */}
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          gap: 2,
          flexWrap: 'wrap',
          backgroundColor: 'background.paper',
        }}
      >
        <TextField
          size="small"
          placeholder="Search SKU, description, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                  edge="end"
                >
                  <X size={16} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 250, flexGrow: 1 }}
          aria-label="Search inventory movements"
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="priority-filter-label">Priority</InputLabel>
          <Select
            labelId="priority-filter-label"
            value={priorityFilter}
            label="Priority"
            onChange={(e) => setPriorityFilter(e.target.value)}
            aria-label="Filter by priority"
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </Select>
        </FormControl>

        {hasActiveFilters && (
          <Tooltip title="Clear all filters">
            <IconButton
              onClick={handleClearFilters}
              size="small"
              aria-label="Clear all filters"
              color="primary"
            >
              <Filter size={20} />
            </IconButton>
          </Tooltip>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title="Export to CSV">
          <IconButton
            onClick={handleExport}
            disabled={filteredAndSortedMovements.length === 0}
            aria-label="Export movements to CSV"
            color="primary"
          >
            <Download size={20} />
          </IconButton>
        </Tooltip>
      </Toolbar>

      {loading && (
        <div className="loading-overlay" role="status" aria-live="polite">
          <LoadingSpinner /> Processing...
        </div>
      )}

      <TableContainer component={Paper} className="mui-table">
        <Table aria-label="Inventory movements data">
          <TableHead className="mui-table-head">
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'description'}
                  direction={sortBy === 'description' ? sortDirection : 'asc'}
                  onClick={() => handleSort('description')}
                >
                  Details
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'status'}
                  direction={sortBy === 'status' ? sortDirection : 'asc'}
                  onClick={() => handleSort('status')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'sku'}
                  direction={sortBy === 'sku' ? sortDirection : 'asc'}
                  onClick={() => handleSort('sku')}
                >
                  SKU
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'originDC'}
                  direction={sortBy === 'originDC' ? sortDirection : 'asc'}
                  onClick={() => handleSort('originDC')}
                >
                  Ship From
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortBy === 'destinationDC'}
                  direction={sortBy === 'destinationDC' ? sortDirection : 'asc'}
                  onClick={() => handleSort('destinationDC')}
                >
                  Ship To
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortBy === 'quantity'}
                  direction={sortBy === 'quantity' ? sortDirection : 'asc'}
                  onClick={() => handleSort('quantity')}
                >
                  Quantity
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={sortBy === 'estimatedSavings'}
                  direction={sortBy === 'estimatedSavings' ? sortDirection : 'asc'}
                  onClick={() => handleSort('estimatedSavings')}
                >
                  Est. Savings
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedMovements.map((movement) => (
              <TableRow
                key={movement.id}
                role="row"
                className="inventory-row"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleView(movement);
                  }
                }}
              >
                <TableCell role="cell">
                  <div className="movement-details">
                    <div className="movement-description">{movement.description}</div>
                    <div className="movement-meta">
                      <StatusBadge status={movement.priority} variant="priority" />
                      <span className="movement-date" title={`Created on ${formatDate(movement.createdAt)}`}>
                        {formatDate(movement.createdAt)}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell role="cell">
                  <StatusBadge status={movement.status} />
                </TableCell>
                <TableCell role="cell">
                  <code className="sku-code">{movement.sku}</code>
                </TableCell>
                <TableCell role="cell">{getDCName(movement.originDC)}</TableCell>
                <TableCell role="cell">{getDCName(movement.destinationDC)}</TableCell>
                <TableCell className="number-cell" role="cell" align="right">
                  {formatNumber(movement.quantity)}
                </TableCell>
                <TableCell className="currency-cell" role="cell" align="right">
                  {formatCurrency(movement.estimatedSavings)}
                </TableCell>
                <TableCell align="center" role="cell">
                  <div className="action-buttons" role="group" aria-label={`Actions for ${movement.sku}`}>
                    {movement.status === 'pending' && (
                      <>
                        <Button
                          variant="success"
                          size="small"
                          onClick={() => handleApprove(movement.id)}
                          ariaLabel={`Approve movement ${movement.sku}`}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="small"
                          onClick={() => handleReject(movement.id)}
                          ariaLabel={`Reject movement ${movement.sku}`}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleView(movement)}
                      ariaLabel={`View details for movement ${movement.sku}`}
                    >
                      View
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredAndSortedMovements.length === 0 && !loading && (
        <div className="empty-state" role="status">
          <p>
            {hasActiveFilters
              ? 'No movements match your filters. Try adjusting your search or filters.'
              : 'No inventory movements available at this time.'}
          </p>
        </div>
      )}
    </Card>
  );
};

export default memo(InventoryMovements);

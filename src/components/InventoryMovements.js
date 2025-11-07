import React, { useCallback, memo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { inventoryMovements, distributionCenters } from '../data/mockData';
import { useMovements } from '../hooks';
import { useToast } from '../contexts/ToastContext';
import { StatusBadge, Button, LoadingSpinner, Card } from './common';
import { formatCurrency, formatNumber, formatDate } from '../utils/helpers';
import './InventoryMovements.css';

const InventoryMovements = () => {
  const { movements, loading, error, actions } = useMovements(inventoryMovements);
  const toast = useToast();

  const getDCName = (dcId) => {
    const dc = distributionCenters.find(center => center.id === dcId);
    return dc?.name ?? dcId;
  };

  const handleApprove = useCallback(async (movementId) => {
    const result = await actions.approveMovement(movementId);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }, [actions, toast]);

  const handleReject = useCallback(async (movementId) => {
    const result = await actions.rejectMovement(movementId);
    if (result.success) {
      toast.warning(result.message);
    } else {
      toast.error(result.message);
    }
  }, [actions, toast]);

  const handleView = useCallback((movement) => {
    // Create detailed movement information for the toast
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
    
    // Show detailed information in toast
    if (toast && typeof toast.info === 'function') {
      toast.info(movementDetails); // No timeout - stays visible until user closes
    } else {
      // Fallback to alert if toast is not available
      alert(movementDetails);
    }
  }, [toast, getDCName]);

  if (error) {
    return (
      <Card title="Suggested Inventory Movements" className="inventory-movements">
        <div className="error-message">
          <p>Error loading movements: {error}</p>
          <Button onClick={() => actions.clearError()} variant="primary">
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Suggested Inventory Movements" className="inventory-movements">
      {loading && (
        <div className="loading-overlay" role="status" aria-live="polite">
          <LoadingSpinner /> Processing...
        </div>
      )}
      
      <TableContainer component={Paper} className="mui-table">
        <Table aria-label="Inventory movements data">
          <TableHead className="mui-table-head">
            <TableRow>
              <TableCell>Details</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Ship From</TableCell>
              <TableCell>Ship To</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Est. Savings</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movements.map((movement) => (
              <TableRow key={movement.id} role="row" className="inventory-row">
                <TableCell role="cell">
                  <div className="movement-details">
                    <div className="movement-description">
                      {movement.description}
                    </div>
                    <div className="movement-meta">
                      Priority: <StatusBadge status={movement.priority} variant="priority" />
                      <span className="movement-date">
                        Due: {formatDate(movement.requiredBy)}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell role="cell">
                  <StatusBadge status={movement.status} variant="status" />
                </TableCell>
                <TableCell role="cell">
                  <code className="sku-code">{movement.sku}</code>
                </TableCell>
                <TableCell role="cell">{getDCName(movement.originDC)}</TableCell>
                <TableCell role="cell">{getDCName(movement.destinationDC)}</TableCell>
                <TableCell className="number-cell" role="cell">{formatNumber(movement.quantity)}</TableCell>
                <TableCell className="currency-cell" role="cell">
                  {formatCurrency(movement.estimatedSavings)}
                </TableCell>
                <TableCell role="cell">
                  <div className="action-buttons" role="group" aria-label={`Actions for ${movement.sku}`}>
                    {movement.status === 'pending' && (
                      <>
                        <Button
                          variant="success"
                          size="small"
                          onClick={() => handleApprove(movement.id)}
                          disabled={loading}
                          ariaLabel={`Approve movement for ${movement.sku}`}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="small"
                          onClick={() => handleReject(movement.id)}
                          disabled={loading}
                          ariaLabel={`Reject movement for ${movement.sku}`}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleView(movement)}
                      ariaLabel={`View details for ${movement.sku}`}
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

      {movements.length === 0 && (
        <div className="empty-state" role="status">
          <p>No inventory movements found.</p>
        </div>
      )}
    </Card>
  );
};

export default memo(InventoryMovements);
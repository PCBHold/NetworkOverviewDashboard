/**
 * Export data to CSV file
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name of the file to download
 * @param {Array} columns - Optional array of column definitions {key: string, label: string}
 */
export const exportToCSV = (data, filename = 'export.csv', columns = null) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // If columns not provided, use all keys from first object
  const columnDefs = columns || Object.keys(data[0]).map(key => ({
    key,
    label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()
  }));

  // Create CSV header
  const headers = columnDefs.map(col => `"${col.label}"`).join(',');

  // Create CSV rows
  const rows = data.map(row => {
    return columnDefs.map(col => {
      const value = row[col.key];
      // Handle null/undefined
      if (value === null || value === undefined) return '""';
      // Escape quotes and wrap in quotes
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(',');
  });

  // Combine header and rows
  const csvContent = [headers, ...rows].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

/**
 * Format data for export
 * @param {Array} movements - Array of movement objects
 * @param {Function} getDCName - Function to get DC name from ID
 * @returns {Array} Formatted data ready for export
 */
export const formatMovementsForExport = (movements, getDCName) => {
  return movements.map(movement => ({
    ID: movement.id,
    SKU: movement.sku,
    Description: movement.description,
    Status: movement.status,
    Priority: movement.priority,
    Category: movement.category || 'N/A',
    'Origin DC': getDCName(movement.originDC),
    'Destination DC': getDCName(movement.destinationDC),
    Quantity: movement.quantity,
    'Estimated Savings': movement.estimatedSavings,
    'Created At': movement.createdAt,
    'Required By': movement.requiredBy
  }));
};

/**
 * Export movements to CSV with proper formatting
 * @param {Array} movements - Array of movement objects
 * @param {Function} getDCName - Function to get DC name from ID
 * @param {string} filename - Optional custom filename
 */
export const exportMovementsToCSV = (movements, getDCName, filename = null) => {
  const formattedData = formatMovementsForExport(movements, getDCName);
  const defaultFilename = `inventory-movements-${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(formattedData, filename || defaultFilename);
};

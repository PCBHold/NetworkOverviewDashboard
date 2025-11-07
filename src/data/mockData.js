import { DC_STATUS, MOVEMENT_STATUS, PRIORITY_LEVELS, ISSUE_SEVERITY } from '../constants';

// Mock Distribution Centers Data
export const distributionCenters = [
  {
    id: 'dc-ny-001',
    name: 'New York DC',
    code: 'NY001',
    position: [40.7128, -74.0060],
    status: DC_STATUS.HEALTHY,
    details: { 
      capacity: 95,
      maxCapacity: 100,
      orders: 1250, 
      issues: 0,
      address: '123 Industrial Blvd, Queens, NY 11101',
      manager: 'Sarah Johnson'
    }
  },
  {
    id: 'dc-chi-001',
    name: 'Chicago DC',
    code: 'CHI001',
    position: [41.8781, -87.6298],
    status: DC_STATUS.WARNING,
    details: { 
      capacity: 87,
      maxCapacity: 100,
      orders: 890, 
      issues: 3,
      address: '456 Logistics Way, Chicago, IL 60601',
      manager: 'Michael Chen'
    }
  },
  {
    id: 'dc-la-001',
    name: 'Los Angeles DC',
    code: 'LA001',
    position: [34.0522, -118.2437],
    status: DC_STATUS.CRITICAL,
    details: { 
      capacity: 112,
      maxCapacity: 100,
      orders: 1450, 
      issues: 8,
      address: '789 Port Ave, Los Angeles, CA 90021',
      manager: 'Jennifer Rodriguez'
    }
  },
  {
    id: 'dc-dal-001',
    name: 'Dallas DC',
    code: 'DAL001',
    position: [32.7767, -96.7970],
    status: DC_STATUS.HEALTHY,
    details: { 
      capacity: 78,
      maxCapacity: 100,
      orders: 675, 
      issues: 1,
      address: '321 Freight Rd, Dallas, TX 75201',
      manager: 'Robert Wilson'
    }
  },
  {
    id: 'dc-atl-001',
    name: 'Atlanta DC',
    code: 'ATL001',
    position: [33.7490, -84.3880],
    status: DC_STATUS.WARNING,
    details: { 
      capacity: 92,
      maxCapacity: 100,
      orders: 1100, 
      issues: 2,
      address: '654 Distribution Dr, Atlanta, GA 30309',
      manager: 'Lisa Thompson'
    }
  },
  {
    id: 'dc-sea-001',
    name: 'Seattle DC',
    code: 'SEA001',
    position: [47.6062, -122.3321],
    status: DC_STATUS.HEALTHY,
    details: { 
      capacity: 68,
      maxCapacity: 100,
      orders: 520, 
      issues: 0,
      address: '987 Harbor St, Seattle, WA 98101',
      manager: 'Kevin Park'
    }
  }
];

// Mock Inventory Movements Data
export const inventoryMovements = [
  {
    id: 'mov-001',
    description: 'Rebalance high-demand SKU to meet seasonal demand',
    status: MOVEMENT_STATUS.PENDING,
    sku: 'DHL-8834-XL',
    originDC: 'dc-chi-001',
    destinationDC: 'dc-la-001',
    quantity: 150,
    estimatedSavings: 12500,
    priority: PRIORITY_LEVELS.HIGH,
    createdAt: new Date('2024-11-01'),
    requiredBy: new Date('2024-11-10'),
    category: 'demand-balancing'
  },
  {
    id: 'mov-002',
    description: 'Seasonal inventory adjustment for Q4 preparation',
    status: MOVEMENT_STATUS.APPROVED,
    sku: 'DHL-2156-MD',
    originDC: 'dc-ny-001',
    destinationDC: 'dc-atl-001',
    quantity: 89,
    estimatedSavings: 6750,
    priority: PRIORITY_LEVELS.MEDIUM,
    createdAt: new Date('2024-10-28'),
    requiredBy: new Date('2024-11-15'),
    category: 'seasonal-adjustment'
  },
  {
    id: 'mov-003',
    description: 'Overflow capacity management to optimize storage',
    status: MOVEMENT_STATUS.PENDING,
    sku: 'DHL-9944-SM',
    originDC: 'dc-sea-001',
    destinationDC: 'dc-dal-001',
    quantity: 205,
    estimatedSavings: 8900,
    priority: PRIORITY_LEVELS.LOW,
    createdAt: new Date('2024-11-02'),
    requiredBy: new Date('2024-11-20'),
    category: 'capacity-optimization'
  },
  {
    id: 'mov-004',
    description: 'Critical shortage replenishment for key customer',
    status: MOVEMENT_STATUS.PENDING,
    sku: 'DHL-3367-LG',
    originDC: 'dc-dal-001',
    destinationDC: 'dc-la-001',
    quantity: 75,
    estimatedSavings: 15600,
    priority: PRIORITY_LEVELS.HIGH,
    createdAt: new Date('2024-11-03'),
    requiredBy: new Date('2024-11-08'),
    category: 'shortage-replenishment'
  },
  {
    id: 'mov-005',
    description: 'Cost optimization transfer to reduce handling fees',
    status: MOVEMENT_STATUS.APPROVED,
    sku: 'DHL-7728-XS',
    originDC: 'dc-atl-001',
    destinationDC: 'dc-chi-001',
    quantity: 120,
    estimatedSavings: 4200,
    priority: PRIORITY_LEVELS.MEDIUM,
    createdAt: new Date('2024-10-30'),
    requiredBy: new Date('2024-11-12'),
    category: 'cost-optimization'
  }
];

// Mock Issues Data
export const issuesData = {
  orderIssues: [
    {
      id: 'ord-001',
      description: 'Delayed shipment to Los Angeles DC due to carrier issues',
      severity: ISSUE_SEVERITY.HIGH,
      affectedOrders: 15,
      estimatedResolution: '2024-11-06'
    },
    {
      id: 'ord-002',
      description: 'Missing documentation for SKU DHL-8834',
      severity: ISSUE_SEVERITY.MEDIUM,
      affectedOrders: 3,
      estimatedResolution: '2024-11-05'
    },
    {
      id: 'ord-003',
      description: 'Customer complaint - wrong item delivered',
      severity: ISSUE_SEVERITY.MEDIUM,
      affectedOrders: 1,
      estimatedResolution: '2024-11-05'
    },
    {
      id: 'ord-004',
      description: 'Payment processing error for Order #45621',
      severity: ISSUE_SEVERITY.LOW,
      affectedOrders: 1,
      estimatedResolution: '2024-11-07'
    },
    {
      id: 'ord-005',
      description: 'Address validation failed for 3 orders',
      severity: ISSUE_SEVERITY.MEDIUM,
      affectedOrders: 3,
      estimatedResolution: '2024-11-06'
    }
  ],
  inboundIssues: [
    {
      id: 'inb-001',
      description: 'Chicago DC receiving dock capacity exceeded',
      severity: ISSUE_SEVERITY.HIGH,
      affectedShipments: 8,
      estimatedResolution: '2024-11-08'
    },
    {
      id: 'inb-002',
      description: 'Quality control inspection backlog',
      severity: ISSUE_SEVERITY.HIGH,
      affectedShipments: 12,
      estimatedResolution: '2024-11-07'
    },
    {
      id: 'inb-003',
      description: 'Supplier delay from Manufacturing Partner A',
      severity: ISSUE_SEVERITY.MEDIUM,
      affectedShipments: 5,
      estimatedResolution: '2024-11-10'
    },
    {
      id: 'inb-004',
      description: 'Temperature-sensitive items require immediate processing',
      severity: ISSUE_SEVERITY.HIGH,
      affectedShipments: 3,
      estimatedResolution: '2024-11-05'
    },
    {
      id: 'inb-005',
      description: 'Customs clearance pending for international shipment',
      severity: ISSUE_SEVERITY.MEDIUM,
      affectedShipments: 2,
      estimatedResolution: '2024-11-09'
    }
  ],
  inventoryIssues: [
    {
      id: 'inv-001',
      description: 'Stock-out risk for DHL-3367-LG in Los Angeles',
      severity: ISSUE_SEVERITY.HIGH,
      affectedSKUs: 1,
      estimatedResolution: '2024-11-06'
    },
    {
      id: 'inv-002',
      description: 'Overstock situation in Seattle DC for seasonal items',
      severity: ISSUE_SEVERITY.MEDIUM,
      affectedSKUs: 4,
      estimatedResolution: '2024-11-15'
    },
    {
      id: 'inv-003',
      description: 'Inventory discrepancy found during cycle count',
      severity: ISSUE_SEVERITY.MEDIUM,
      affectedSKUs: 2,
      estimatedResolution: '2024-11-08'
    },
    {
      id: 'inv-004',
      description: 'Expired items need immediate removal from Dallas DC',
      severity: ISSUE_SEVERITY.HIGH,
      affectedSKUs: 3,
      estimatedResolution: '2024-11-05'
    },
    {
      id: 'inv-005',
      description: 'Safety stock levels below threshold for 8 SKUs',
      severity: ISSUE_SEVERITY.HIGH,
      affectedSKUs: 8,
      estimatedResolution: '2024-11-07'
    }
  ]
};
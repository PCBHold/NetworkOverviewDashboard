import React, { memo } from 'react';
import { TrendingUp, DollarSign, Package, Truck, Clock } from 'lucide-react';
import { Card, MetricDisplay } from './common';
import { formatCurrency } from '../utils/helpers';

const MovementImpact = () => {
  const impactMetrics = [
    {
      label: 'Total Estimated Savings',
      value: 47950,
      change: '+$12,400',
      trend: 'positive',
      icon: DollarSign,
      format: 'currency'
    },
    {
      label: 'Inventory Efficiency',
      value: 94.2,
      change: '+3.8%',
      trend: 'positive',
      icon: Package,
      format: 'percentage'
    },
    {
      label: 'Avg. Delivery Time',
      value: '2.3 days',
      change: '-0.7 days',
      trend: 'positive',
      icon: Clock,
      format: 'text'
    },
    {
      label: 'Transport Cost',
      value: 28650,
      change: '-$4,200',
      trend: 'positive',
      icon: Truck,
      format: 'currency'
    },
    {
      label: 'Storage Utilization',
      value: 87.5,
      change: '+5.2%',
      trend: 'positive',
      icon: Package,
      format: 'percentage'
    },
    {
      label: 'Order Fulfillment',
      value: 98.7,
      change: '+1.3%',
      trend: 'positive',
      icon: TrendingUp,
      format: 'percentage'
    }
  ];

  return (
    <Card title="Suggested Movement Impact" className="movement-impact">
      <div className="impact-metrics">
        {impactMetrics.map((metric, index) => (
          <MetricDisplay
            key={index}
            label={metric.label}
            value={metric.value}
            change={metric.change}
            trend={metric.trend}
            icon={metric.icon}
            format={metric.format}
          />
        ))}
      </div>
      
      <div className="impact-summary">
        <h3 className="summary-title">Quick Summary</h3>
        <ul className="summary-list">
          <li className="summary-item">• 5 pending movements worth {formatCurrency(47950)} in savings</li>
          <li className="summary-item">• 2 high-priority transfers requiring immediate attention</li>
          <li className="summary-item">• Overall network efficiency improvement of +3.8%</li>
          <li className="summary-item">• Estimated implementation time: 3-5 business days</li>
        </ul>
      </div>
    </Card>
  );
};

export default memo(MovementImpact);
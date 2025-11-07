import React, { memo } from 'react';
import { AlertTriangle, Package, Truck } from 'lucide-react';
import { issuesData } from '../data/mockData';
import { ISSUE_SEVERITY, COLORS } from '../constants';
import { Button } from './common';
import { formatDate } from '../utils/helpers';

// Simplified severity config - 70% fewer lines
const SEVERITY_CONFIG = {
  high: { color: COLORS.DANGER, label: 'Requires immediate attention' },
  medium: { color: COLORS.WARNING, label: 'Moderate priority issues' }, 
  low: { color: COLORS.SUCCESS, label: 'Low priority, monitor' }
};

// Memoized IssueWidget to prevent unnecessary re-renders
const IssueWidget = memo(({ title, issues, severity, icon: Icon }) => {

  const config = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.medium;
  
  return (
    <div className="issue-widget">
      <div className="widget-header">
        <Icon size={24} className="widget-icon" />
        <h3 className="section-title">{title}</h3>
      </div>
      
      <div className={`issue-count ${severity}`}>{issues.length}</div>
      <div className="issue-description">{config.label}</div>

      <ul className="issue-list">
        {issues.slice(0, 5).map((issue) => (
          <li key={issue.id} className="issue-item">
            <AlertTriangle size={14} className="issue-icon" style={{ '--issue-color': config.color }} />
            <div className="issue-content">
              <div className="issue-text">{issue.description}</div>
              <div className="issue-meta">
                {issue.estimatedResolution && <span className="issue-resolution">Due: {formatDate(issue.estimatedResolution)}</span>}
                {(issue.affectedOrders || issue.affectedShipments || issue.affectedSKUs) && (
                  <span className="issue-affected">
                    {issue.affectedOrders || issue.affectedShipments || issue.affectedSKUs} {issue.affectedOrders ? 'orders' : issue.affectedShipments ? 'shipments' : 'SKUs'} affected
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {issues.length > 5 && <div className="more-issues">View {issues.length - 5} more issues...</div>}
      <Button variant="primary" onClick={() => {}} ariaLabel={`View all ${title} issues`}>
        View All {title}
      </Button>
    </div>
  );
});

const IssuesWidgets = memo(() => {
  // Calculate severity based on issue count
  const getSeverity = (issues) => {
    const highSeverityCount = issues.filter(issue => issue.severity === ISSUE_SEVERITY.HIGH).length;
    if (highSeverityCount >= 3) return ISSUE_SEVERITY.HIGH;
    if (highSeverityCount >= 1) return ISSUE_SEVERITY.MEDIUM;
    return ISSUE_SEVERITY.LOW;
  };

  return (
    <div className="issues-section">
      <IssueWidget
        title="Order Issues"
        issues={issuesData.orderIssues}
        severity={getSeverity(issuesData.orderIssues)}
        icon={Package}
      />
      
      <IssueWidget
        title="Inbound Issues"
        issues={issuesData.inboundIssues}
        severity={getSeverity(issuesData.inboundIssues)}
        icon={Truck}
      />
      
      <IssueWidget
        title="Inventory Issues"
        issues={issuesData.inventoryIssues}
        severity={getSeverity(issuesData.inventoryIssues)}
        icon={AlertTriangle}
      />
    </div>
  );
});

export default memo(IssuesWidgets);
import React, { memo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { distributionCenters } from '../data/mockData';
import { MAP_CONFIG, COLORS } from '../constants';
import { StatusBadge, Card, LoadingSpinner } from './common';
import { formatNumber, formatPercentage } from '../utils/helpers';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different statuses
const createIcon = (color) => new L.Icon({
  iconUrl: `data:image/svg+xml;base64,${btoa(`
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 19.4 12.5 41 12.5 41S25 19.4 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="${color}"/>
      <circle cx="12.5" cy="12.5" r="6" fill="white"/>
    </svg>
  `)}`,
  iconSize: MAP_CONFIG.MARKER_ICON_SIZE,
  iconAnchor: MAP_CONFIG.MARKER_ANCHOR,
  popupAnchor: MAP_CONFIG.POPUP_ANCHOR,
});

const healthyIcon = createIcon(COLORS.SUCCESS);
const warningIcon = createIcon(COLORS.WARNING);
const criticalIcon = createIcon(COLORS.DANGER);

const getIcon = (status) => {
  switch (status) {
    case 'healthy': return healthyIcon;
    case 'warning': return warningIcon;
    case 'critical': return criticalIcon;
    default: return healthyIcon;
  }
};

// Reusable StatusBadge component (commented out - using global styles instead)
// const StatusBadge = ({ status }) => (
//   <span className={`status-badge status-${status}`}>
//     {status.toUpperCase()}
//   </span>
// );

// Reusable LegendItem component
const LegendItem = ({ color, label }) => (
  <div className="legend-item">
    <div
      className="legend-indicator"
      style={{ '--legend-color': color }}
      aria-hidden="true"
    />
    <span className="legend-label">{label}</span>
  </div>
);

const NetworkHealthMap = () => {
  const [mapError, setMapError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Check if Leaflet is available
    if (typeof window !== 'undefined' && !window.L) {
      setMapError('Map library failed to load. Please refresh the page.');
      setIsLoading(false);
      return;
    }

    // Simulate map loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (mapError) {
    return (
      <Card title="Network Health Map">
        <div className="error-message">
          <p>{mapError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="action-btn btn-primary btn-small"
          >
            Reload Page
          </button>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card title="Network Health Map">
        <div className="loading-container">
          <LoadingSpinner size="large" />
          <p>Loading map...</p>
        </div>
      </Card>
    );
  }
  const legendItems = [
    { color: COLORS.SUCCESS, label: 'Healthy' },
    { color: COLORS.WARNING, label: 'Warning' },
    { color: COLORS.DANGER, label: 'Critical' }
  ];

  return (
    <Card title="Network Health Map" className="map-section">
      <div className="map-container">
        <MapContainer
          center={MAP_CONFIG.DEFAULT_CENTER}
          zoom={MAP_CONFIG.DEFAULT_ZOOM}
          className="map-container-inner"
          aria-label="Distribution center network health map"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {distributionCenters.map((dc) => (
            <Marker 
              key={dc.id} 
              position={dc.position} 
              icon={getIcon(dc.status)}
            >
              <Popup>
                <div className="popup-content">
                  <h3 className="popup-title">{dc.name}</h3>
                  <div className="popup-code">Code: {dc.code}</div>
                  <div className="popup-details">
                    <div className="popup-row">
                      <strong>Status:</strong> 
                      <StatusBadge status={dc.status} variant="status" />
                    </div>
                    <div className="popup-row">
                      <strong>Capacity:</strong> 
                      <span className={dc.details.capacity > 100 ? 'capacity-over' : 'capacity-normal'}>
                        {formatPercentage(dc.details.capacity)}
                      </span>
                    </div>
                    <div className="popup-row">
                      <strong>Active Orders:</strong> {formatNumber(dc.details.orders)}
                    </div>
                    <div className="popup-row">
                      <strong>Issues:</strong> 
                      <span className={dc.details.issues > 0 ? 'issues-warning' : 'issues-none'}>
                        {dc.details.issues}
                      </span>
                    </div>
                    <div className="popup-row">
                      <strong>Manager:</strong> {dc.details.manager}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="map-legend">
        {legendItems.map((item, index) => (
          <LegendItem key={index} {...item} />
        ))}
      </div>
    </Card>
  );
};

export default memo(NetworkHealthMap);
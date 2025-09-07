// src/components/Map/MapComponent.jsx
import React, { useRef, useEffect, useState } from "react";
import { FaMapPin, FaSync, FaSatellite, FaMap, FaExclamationTriangle, FaCamera } from "react-icons/fa";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./MapComponent.css";
import { fetchAuthSession } from "aws-amplify/auth";

// --- ⬇️ YOUR AWS CONFIGURATION ⬇️ ---
const API_KEY = import.meta.env.MAP_API_KEY;
const REGION = "ap-south-1";
const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL;
// --- ⬆️ END OF CONFIGURATION ⬆️ ---

const MapComponent = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);

  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [mapStyle, setMapStyle] = useState("Satellite");
  const [isSatelliteView, setIsSatelliteView] = useState(true);
  const [error, setError] = useState(null);

  // Get status color based on complaint status
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'submitted': return '#F59E0B'; // Orange - newly submitted
      case 'in-progress': case 'in progress': return '#3B82F6'; // Blue - being worked on
      case 'resolved': case 'completed': return '#22C55E'; // Green - completed
      case 'rejected': case 'cancelled': return '#EF4444'; // Red - rejected
      default: return '#6B7280'; // Gray - unknown status
    }
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'roads & transportation':
      case 'roads and transportation':
        return '🛣️';
      case 'water supply':
        return '💧';
      case 'electricity':
        return '⚡';
      case 'garbage collection':
        return '🗑️';
      case 'street lighting':
        return '💡';
      default:
        return '📍';
    }
  };

  const clearMarkers = () => {
    markersRef.current.forEach(marker => {
      const popup = marker.getPopup();
      if (popup) {
        popup.remove();
      }
      marker.remove();
    });
    markersRef.current = [];
  };

  const addMarkersToMap = (data) => {
    if (!map.current || !data.length) return;

    clearMarkers();

    data.forEach((complaint, index) => {
      // Skip if no valid coordinates
      if (!complaint.latitude || !complaint.longitude) return;

      const lat = parseFloat(complaint.latitude);
      const lon = parseFloat(complaint.longitude);

      if (isNaN(lat) || isNaN(lon)) return;

      // Create marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'complaint-marker';
      markerElement.setAttribute('data-complaint-id', complaint.complaintId);

      const statusColor = getStatusColor(complaint.status);

      markerElement.style.cssText = `
        width: 32px;
        height: 32px;
        background-color: ${statusColor};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        cursor: pointer;
        position: relative;
        transition: all 0.3s ease;
        z-index: ${10 + index};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
      `;

      // Add category icon
      markerElement.innerHTML = getCategoryIcon(complaint.category);

      // Add pulsing animation for new complaints (submitted today)
      const createdDate = new Date(complaint.createdAt);
      const today = new Date();
      const isToday = createdDate.toDateString() === today.toDateString();

      if (isToday) {
        const pulseKeyframes = `
          @keyframes pulse-complaint-${index} {
            0% { box-shadow: 0 2px 10px rgba(0,0,0,0.3), 0 0 0 0 ${statusColor}; }
            70% { box-shadow: 0 2px 10px rgba(0,0,0,0.3), 0 0 0 10px transparent; }
            100% { box-shadow: 0 2px 10px rgba(0,0,0,0.3), 0 0 0 0 transparent; }
          }
        `;

        const styleId = `pulse-complaint-style-${index}`;
        if (!document.getElementById(styleId)) {
          const style = document.createElement('style');
          style.id = styleId;
          style.textContent = pulseKeyframes;
          document.head.appendChild(style);
        }

        markerElement.style.animation = `pulse-complaint-${index} 2s infinite`;
      }

      // Event handlers
      markerElement.addEventListener('mouseenter', (e) => {
        e.stopPropagation();
        markerElement.style.transform = 'scale(1.2)';
        markerElement.style.zIndex = '1000';
      }, { passive: false });

      markerElement.addEventListener('mouseleave', (e) => {
        e.stopPropagation();
        markerElement.style.transform = 'scale(1)';
        markerElement.style.zIndex = `${10 + index}`;
      }, { passive: false });

      // Prevent drag events
      ['mousedown', 'touchstart', 'dragstart', 'drag'].forEach(eventType => {
        markerElement.addEventListener(eventType, (e) => {
          e.stopPropagation();
          e.preventDefault();
          return false;
        }, { passive: false, capture: true });
      });

      // Enhanced popup content with complaint details
      const formatDate = (dateStr) => {
        try {
          return new Date(dateStr).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        } catch {
          return 'Invalid Date';
        }
      };

      const popupContent = `
        <div style="
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          min-width: 280px;
          max-width: 320px;
          padding: 8px;
        ">
          <div style="
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 2px solid ${statusColor};
          ">
            <span style="font-size: 20px; margin-right: 8px;">
              ${getCategoryIcon(complaint.category)}
            </span>
            <div>
              <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">
                ${complaint.category || 'Civic Issue'}
              </h3>
              <p style="margin: 0; font-size: 12px; color: #6b7280;">
                ${complaint.subCategory || 'General'}
              </p>
            </div>
          </div>
          
          <div style="margin: 8px 0;">
            <div style="
              display: inline-flex;
              align-items: center;
              background-color: ${statusColor};
              color: white;
              padding: 4px 8px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: 600;
              margin-bottom: 8px;
            ">
              ${complaint.status?.toUpperCase() || 'UNKNOWN'}
            </div>
          </div>

          <div style="background: #f9fafb; padding: 8px; border-radius: 6px; margin: 8px 0;">
            <p style="margin: 0; font-size: 13px; color: #374151; line-height: 1.4;">
              <strong>Description:</strong><br>
              ${complaint.description || 'No description provided'}
            </p>
          </div>

          <div style="font-size: 12px; color: #6b7280; margin: 6px 0;">
            <p style="margin: 2px 0;">
              <strong>📍 Location:</strong> ${complaint.manualLocation || 'Not specified'}
            </p>
            <p style="margin: 2px 0;">
              <strong>🏘️ District:</strong> ${complaint.district || 'Unknown'}
            </p>
            <p style="margin: 2px 0;">
              <strong>📧 Reported by:</strong> ${complaint.userId?.replace(/(.{3}).*@/, '$1***@') || 'Anonymous'}
            </p>
            <p style="margin: 2px 0;">
              <strong>📅 Submitted:</strong> ${formatDate(complaint.createdAt)}
            </p>
            <p style="margin: 2px 0;">
              <strong>🔄 Last Updated:</strong> ${formatDate(complaint.updatedAt)}
            </p>
          </div>

          ${complaint.imageUrl ? `
            <div style="margin-top: 8px; text-align: center;">
              <a href="${complaint.imageUrl}" target="_blank" style="
                display: inline-flex;
                align-items: center;
                background: #3b82f6;
                color: white;
                text-decoration: none;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 500;
              ">
                📷 View Photo
              </a>
            </div>
          ` : ''}

          <div style="
            margin-top: 8px;
            padding-top: 6px;
            border-top: 1px solid #e5e7eb;
            font-size: 11px;
            color: #9ca3af;
            text-align: center;
          ">
            ID: ${complaint.complaintId?.slice(0, 8)}...
          </div>
        </div>
      `;

      // Create popup
      const popup = new maplibregl.Popup({
        offset: 35,
        closeButton: true,
        closeOnClick: false,
        maxWidth: '350px',
        anchor: 'bottom',
        className: 'complaint-popup'
      }).setHTML(popupContent);

      // Create marker
      const marker = new maplibregl.Marker({
        element: markerElement,
        anchor: 'center',
        draggable: false,
      })
        .setLngLat([lon, lat])
        .setPopup(popup);

      marker.addTo(map.current);
      markersRef.current.push(marker);

      // Click handler
      markerElement.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();

        // Close other popups
        markersRef.current.forEach(m => {
          if (m !== marker && m.getPopup().isOpen()) {
            m.getPopup().remove();
          }
        });

        // Toggle popup
        if (popup.isOpen()) {
          popup.remove();
        } else {
          popup.addTo(map.current);
        }
      }, { passive: false });
    });
  };

// Update the fetchComplaintData function to re-center map when data loads:
const fetchComplaintData = async () => {
  setIsLoading(true);
  setError(null);
  
  console.log('Fetching from:', `${API_GATEWAY_URL}/complaints`);
  
  try {
    // Get the authentication token
    const { idToken } = (await fetchAuthSession()).tokens ?? {};
    if (!idToken) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(`${API_GATEWAY_URL}/complaints`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken.toString()}`, // Add this line
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Received data:', data.length, 'complaints');

    // Filter out complaints without valid coordinates
    const validComplaints = data.filter(complaint => 
      complaint.latitude && 
      complaint.longitude && 
      !isNaN(parseFloat(complaint.latitude)) && 
      !isNaN(parseFloat(complaint.longitude))
    );

    setComplaints(validComplaints);
    setLastUpdated(new Date());
    addMarkersToMap(validComplaints);

    // Auto-fit map to show all complaints OR center on calculated point
    if (validComplaints.length > 0 && map.current) {
      if (validComplaints.length === 1) {
        // If only one complaint, center on it
        const complaint = validComplaints[0];
        map.current.setCenter([parseFloat(complaint.longitude), parseFloat(complaint.latitude)]);
        map.current.setZoom(14); // Zoom in for single complaint
      } else {
        // Multiple complaints - fit all in view
        const bounds = new maplibregl.LngLatBounds();
        validComplaints.forEach(complaint => {
          bounds.extend([parseFloat(complaint.longitude), parseFloat(complaint.latitude)]);
        });
        
        map.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 12
        });
      }
    }

  } catch (error) {
    console.error('Error fetching complaint data:', error);
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};


const calculateGeographicCenter = (complaintsData) => {
  if (!complaintsData || complaintsData.length === 0) {
    return [77.364, 28.651]; // Fallback to Delhi
  }

  const validComplaints = complaintsData.filter(complaint => 
    complaint.latitude && 
    complaint.longitude && 
    !isNaN(parseFloat(complaint.latitude)) && 
    !isNaN(parseFloat(complaint.longitude))
  );

  if (validComplaints.length === 0) {
    return [77.364, 28.651];
  }

  if (validComplaints.length === 1) {
    const complaint = validComplaints[0];
    return [parseFloat(complaint.longitude), parseFloat(complaint.latitude)];
  }

  // For multiple points, calculate centroid
  let x = 0, y = 0, z = 0;

  validComplaints.forEach(complaint => {
    const lat = parseFloat(complaint.latitude) * Math.PI / 180;
    const lon = parseFloat(complaint.longitude) * Math.PI / 180;

    x += Math.cos(lat) * Math.cos(lon);
    y += Math.cos(lat) * Math.sin(lon);
    z += Math.sin(lat);
  });

  const total = validComplaints.length;
  x = x / total;
  y = y / total;
  z = z / total;

  const centralLon = Math.atan2(y, x);
  const centralSquareRoot = Math.sqrt(x * x + y * y);
  const centralLat = Math.atan2(z, centralSquareRoot);

  const centerLon = centralLon * 180 / Math.PI;
  const centerLat = centralLat * 180 / Math.PI;

  console.log(`Geographic center calculated from ${validComplaints.length} complaints: [${centerLon.toFixed(6)}, ${centerLat.toFixed(6)}]`);
  
  return [centerLon, centerLat];
};


  // Toggle map style
  const toggleMapStyle = () => {
    if (!map.current) return;

    const newStyle = isSatelliteView ? "Standard" : "Satellite";
    const newIsSatellite = !isSatelliteView;

    setMapStyle(newStyle);
    setIsSatelliteView(newIsSatellite);

    const center = map.current.getCenter();
    const zoom = map.current.getZoom();
    const bearing = map.current.getBearing();

    if (API_KEY) {
      map.current.setStyle(`https://maps.geo.${REGION}.amazonaws.com/v2/styles/${newStyle}/descriptor?key=${API_KEY}`);
    } else {
      const freeStyle = newIsSatellite
        ? {
          "version": 8,
          "sources": {
            "satellite": {
              "type": "raster",
              "tiles": ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
              "tileSize": 256,
              "attribution": "© Esri"
            }
          },
          "layers": [
            {
              "id": "satellite",
              "type": "raster",
              "source": "satellite"
            }
          ]
        }
        : "https://demotiles.maplibre.org/style.json";
      map.current.setStyle(freeStyle);
    }

    map.current.once('styledata', () => {
      map.current.setCenter(center);
      map.current.setZoom(zoom);
      map.current.setBearing(bearing);

      setTimeout(() => {
        addMarkersToMap(complaints);
      }, 200);
    });
  };

// Update the map initialization to use dynamic center:
useEffect(() => {
  if (map.current) return;

  const initializeMap = async () => {
    try {
      if (!mapContainer.current) {
        console.error('Map container not found');
        return;
      }

      // Use fallback center initially, will be updated when data loads
      const initialCenter = [77.364, 28.651]; // Delhi fallback

      const styleConfig = API_KEY
        ? `https://maps.geo.${REGION}.amazonaws.com/v2/styles/Satellite/descriptor?key=${API_KEY}`
        : {
          "version": 8,
          "sources": {
            "satellite": {
              "type": "raster",
              "tiles": ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
              "tileSize": 256,
              "attribution": "© Esri"
            }
          },
          "layers": [
            {
              "id": "satellite",
              "type": "raster",
              "source": "satellite"
            }
          ]
        };

      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: styleConfig,
        center: initialCenter,
        zoom: 6, // Lower initial zoom, will auto-fit when data loads
        pitch: 0,
        bearing: 0,
        antialias: true,
        preserveDrawingBuffer: true,
        attributionControl: false
      });

      map.current.addControl(new maplibregl.NavigationControl(), "top-right");
      map.current.addControl(new maplibregl.FullscreenControl(), "top-right");

      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setTimeout(() => {
          if (map.current) {
            map.current.resize();
            fetchComplaintData(); // This will now automatically center and zoom
          }
        }, 100);
      });

      map.current.getCanvasContainer().addEventListener('contextmenu', (e) => {
        e.preventDefault();
      });

      map.current.on('error', (e) => {
        console.error('Map error:', e);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  const timer = setTimeout(initializeMap, 100);

  return () => {
    clearTimeout(timer);
    if (map.current) {
      clearMarkers();
      map.current.remove();
      map.current = null;
    }
  };
}, []);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (map.current && !isLoading) {
        fetchComplaintData();
      }
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <div className="map-wrapper">
      <div className="bg-white px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <FaExclamationTriangle className="w-5 h-5 mr-2 text-orange-500" />
          Live Complaint Tracking ({complaints.length} issues)
          {isSatelliteView && (
            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              <FaSatellite className="w-3 h-3 inline mr-1" />
              SATELLITE
            </span>
          )}
        </h2>
        <div className="flex items-center space-x-3">
          {lastUpdated && (
            <span className="text-sm text-gray-500">
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={toggleMapStyle}
            className="flex items-center px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          >
            {isSatelliteView ? <FaMap className="w-3 h-3 mr-1" /> : <FaSatellite className="w-3 h-3 mr-1" />}
            {isSatelliteView ? 'Street View' : 'Satellite'}
          </button>
          <button
            onClick={fetchComplaintData}
            disabled={isLoading}
            className="flex items-center px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FaSync className={`w-3 h-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-orange-500 mr-2 animate-pulse"></div>
            <span>Submitted</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span>In Progress</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span>Resolved</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span>Rejected</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-200">
          <p className="text-sm text-red-600">
            ⚠️ Error loading data: {error}
          </p>
        </div>
      )}

      <div className="map-content">
        <div
          ref={mapContainer}
          className="map-container"
          style={{ width: '100%', height: '100%', minHeight: '400px' }}
        />
        {isLoading && (
          <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded shadow-md flex items-center z-10">
            <FaSync className="w-4 h-4 mr-2 animate-spin text-blue-500" />
            <span className="text-sm">Loading complaints...</span>
          </div>
        )}
      </div>

      {/* With this: */}
      <style>{`
  .complaint-popup .maplibregl-popup-content {
    border-radius: 12px !important;
    box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
    padding: 0 !important;
  }
  .complaint-popup .maplibregl-popup-tip {
    border-bottom-color: white !important;
  }
`}</style>

    </div>
  );
};

export default MapComponent;

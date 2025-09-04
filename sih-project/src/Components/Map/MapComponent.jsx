// src/components/Map/MapComponent.jsx
import React, { useRef, useEffect, useState } from "react";
import { FaMapPin, FaSync, FaSatellite, FaMap } from "react-icons/fa";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./MapComponent.css";

// --- ⬇️ YOUR AWS CONFIGURATION ⬇️ ---
const API_KEY = import.meta.env.MAP_API_KEY;
const REGION = "ap-south-1";
// --- ⬆️ END OF CONFIGURATION ⬆️ ---

// Mock GPS data
const mockGpsData = [
  { 
    id: 1, 
    latitude: 23.372, 
    longitude: 85.324, 
    title: "Vehicle 1 - Ranchi", 
    status: "active",
    timestamp: "2025-09-05T01:10:00Z"
  },
  { 
    id: 2, 
    latitude: 22.804, 
    longitude: 86.202, 
    title: "Vehicle 2 - Jamshedpur", 
    status: "inactive",
    timestamp: "2025-09-05T01:05:00Z"
  },
  { 
    id: 3, 
    latitude: 23.795, 
    longitude: 86.430, 
    title: "Vehicle 3 - Dhanbad", 
    status: "active",
    timestamp: "2025-09-05T01:12:00Z"
  },
];

const fetchGpsData = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockGpsData.map(item => ({
    ...item,
    latitude: item.latitude + (Math.random() - 0.5) * 0.01,
    longitude: item.longitude + (Math.random() - 0.5) * 0.01,
    timestamp: new Date().toISOString()
  }));
};

const MapComponent = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  
  const [gpsData, setGpsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [mapStyle, setMapStyle] = useState("Satellite");
  const [isSatelliteView, setIsSatelliteView] = useState(true);

  const getMarkerColor = (status) => {
    switch (status) {
      case 'active': return '#22C55E';
      case 'inactive': return '#EF4444';  
      case 'warning': return '#F59E0B';
      default: return '#6B7280';
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
    if (!map.current) return;

    clearMarkers();

    data.forEach((item, index) => {
      // Create marker element with fixed positioning
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.setAttribute('data-marker-id', item.id);
      
      // Critical: Use CSS transforms instead of direct positioning
      markerElement.style.cssText = `
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: ${getMarkerColor(item.status)};
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        cursor: pointer;
        position: absolute;
        transform-origin: center center;
        transition: transform 0.2s ease-in-out;
        z-index: ${10 + index};
        pointer-events: auto;
      `;

      // Add pulsing animation for active markers
      if (item.status === 'active') {
        const keyframes = `
          @keyframes pulse-${item.id} {
            0% { box-shadow: 0 2px 8px rgba(0,0,0,0.4), 0 0 0 0 rgba(34, 197, 94, 0.7); }
            70% { box-shadow: 0 2px 8px rgba(0,0,0,0.4), 0 0 0 8px rgba(34, 197, 94, 0); }
            100% { box-shadow: 0 2px 8px rgba(0,0,0,0.4), 0 0 0 0 rgba(34, 197, 94, 0); }
          }
        `;
        
        // Add keyframes to document if not already present
        const styleId = `pulse-style-${item.id}`;
        if (!document.getElementById(styleId)) {
          const style = document.createElement('style');
          style.id = styleId;
          style.textContent = keyframes;
          document.head.appendChild(style);
        }
        
        markerElement.style.animation = `pulse-${item.id} 2s infinite`;
      }

      // Fixed event handlers - prevent all event bubbling
      markerElement.addEventListener('mouseenter', (e) => {
        e.stopPropagation();
        e.preventDefault();
        markerElement.style.transform = 'scale(1.2)';
        markerElement.style.zIndex = '1000';
      }, { passive: false });
      
      markerElement.addEventListener('mouseleave', (e) => {
        e.stopPropagation();
        e.preventDefault();
        markerElement.style.transform = 'scale(1)';
        markerElement.style.zIndex = `${10 + index}`;
      }, { passive: false });

      // Prevent all drag and touch events
      ['mousedown', 'touchstart', 'dragstart', 'drag'].forEach(eventType => {
        markerElement.addEventListener(eventType, (e) => {
          e.stopPropagation();
          e.preventDefault();
          return false;
        }, { passive: false, capture: true });
      });

      // Enhanced popup content
      const popupContent = `
        <div style="
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          min-width: 200px;
          padding: 4px;
        ">
          <h3 style="
            margin: 0 0 8px 0; 
            font-size: 16px; 
            font-weight: 600;
            color: #1f2937;
            border-bottom: 2px solid ${getMarkerColor(item.status)};
            padding-bottom: 4px;
          ">${item.title}</h3>
          <div style="display: flex; align-items: center; margin: 6px 0;">
            <div style="
              width: 8px; 
              height: 8px; 
              border-radius: 50%; 
              background-color: ${getMarkerColor(item.status)};
              margin-right: 8px;
            "></div>
            <span style="font-size: 14px; font-weight: 600; color: ${getMarkerColor(item.status)};">
              ${item.status.toUpperCase()}
            </span>
          </div>
          <p style="margin: 6px 0; font-size: 13px; color: #6B7280;">
            <strong>📍 Location:</strong> ${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}
          </p>
          <p style="margin: 6px 0; font-size: 13px; color: #6B7280;">
            <strong>🕒 Last Updated:</strong> ${new Date(item.timestamp).toLocaleTimeString()}
          </p>
        </div>
      `;

      // Create popup with fixed settings
      const popup = new maplibregl.Popup({
        offset: 30,
        closeButton: true,
        closeOnClick: false,
        maxWidth: '300px',
        anchor: 'bottom',
        className: 'custom-popup'
      }).setHTML(popupContent);

      // Create marker with draggable explicitly disabled
      const marker = new maplibregl.Marker({
        element: markerElement,
        anchor: 'center',
        draggable: false, // Explicitly disable dragging
        pitchAlignment: 'auto',
        rotationAlignment: 'auto'
      })
        .setLngLat([item.longitude, item.latitude])
        .setPopup(popup);

      // Add marker to map
      marker.addTo(map.current);

      // Store reference
      markersRef.current.push(marker);

      // Add click handler to marker element (not the MapLibre marker object)
      markerElement.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        
        // Close all other popups
        markersRef.current.forEach(m => {
          if (m !== marker && m.getPopup().isOpen()) {
            m.getPopup().remove();
          }
        });
        
        // Toggle this popup
        if (popup.isOpen()) {
          popup.remove();
        } else {
          popup.addTo(map.current);
        }
      }, { passive: false });
    });
  };

  const loadGpsData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchGpsData();
      setGpsData(data);
      setLastUpdated(new Date());
      addMarkersToMap(data);
    } catch (error) {
      console.error('Error fetching GPS data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle between satellite and standard view
  const toggleMapStyle = () => {
    if (!map.current) return;
    
    const newStyle = isSatelliteView ? "Standard" : "Satellite";
    const newIsSatellite = !isSatelliteView;
    
    setMapStyle(newStyle);
    setIsSatelliteView(newIsSatellite);
    
    // Get current map state
    const center = map.current.getCenter();
    const zoom = map.current.getZoom();
    const bearing = map.current.getBearing();
    
    // Change style while preserving map state
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
    
    // Re-add markers after style loads
    map.current.once('styledata', () => {
      // Restore map state
      map.current.setCenter(center);
      map.current.setZoom(zoom);
      map.current.setBearing(bearing);
      
      // Re-add markers after a short delay
      setTimeout(() => {
        addMarkersToMap(gpsData);
      }, 200);
    });
  };

  // Initialize map
  useEffect(() => {
    if (map.current) return;

    const initializeMap = () => {
      try {
        if (!mapContainer.current) {
          console.error('Map container not found');
          return;
        }

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
          center: [85.4, 23.6],
          zoom: 8,
          pitch: 0,
          bearing: 0,
          antialias: true,
          preserveDrawingBuffer: true, // Helps with marker stability
          attributionControl: false
        });

        // Add controls
        map.current.addControl(new maplibregl.NavigationControl(), "top-right");
        map.current.addControl(new maplibregl.FullscreenControl(), "top-right");

        map.current.on('load', () => {
          console.log('Map loaded successfully');
          setTimeout(() => {
            if (map.current) {
              map.current.resize();
              loadGpsData();
            }
          }, 100);
        });

        // Prevent context menu to avoid interference
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

  // Auto-refresh data
  useEffect(() => {
    const interval = setInterval(() => {
      if (map.current && gpsData.length > 0) {
        loadGpsData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [gpsData.length]);

  return (
    <div className="map-wrapper">
      <div className="bg-white px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center">
          <FaMapPin className="w-5 h-5 mr-2 text-blue-500" />
          Live GPS Tracking ({gpsData.length} devices)
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
            onClick={loadGpsData}
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
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
            <span>Active</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span>Inactive</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
            <span>Warning</span>
          </div>
        </div>
      </div>

      <div className="map-content">
        <div 
          ref={mapContainer} 
          className="map-container"
          style={{ width: '100%', height: '100%', minHeight: '400px' }}
        />
        {isLoading && (
          <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded shadow-md flex items-center z-10">
            <FaSync className="w-4 h-4 mr-2 animate-spin text-blue-500" />
            <span className="text-sm">Updating locations...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapComponent;

// src/components/MapComponent.jsx
import React from "react";
import { FaMapPin } from "react-icons/fa";   // FontAwesome map pin
import { FiFilter } from "react-icons/fi";  // Feather filter icon

const MapComponent = () => {
  return (
    <div className="bg-gray-100 h-full rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <FaMapPin className="w-5 h-5 mr-2 text-blue-500" />
            Problem Locations
          </h2>
          <button
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Filter Map"
          >
            <FiFilter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="relative h-full bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
            <FaMapPin className="w-12 h-12 text-blue-500" />
          </div>
          <p className="text-gray-600 font-medium">Interactive Map</p>
          <p className="text-sm text-gray-500 mt-1">
            Problem locations will be displayed here
          </p>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;

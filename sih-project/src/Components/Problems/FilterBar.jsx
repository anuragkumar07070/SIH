// src/components/Problems/FilterBar.jsx
import React from 'react';
import { FiSearch } from 'react-icons/fi';

const FilterBar = ({ filters, onFilterChange }) => {
  return (
    <div className="p-4 border-b border-gray-200 bg-gray-50">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-grow">
          <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by description or location..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Category Filter */}
          <select 
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition w-full sm:w-auto"
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
          >
            <option>All Categories</option>
            <option>Roads & Transportation</option>
            <option>Streetlights & Electricity</option>
            <option>Sanitation & Waste</option>
            <option>Water & Drainage</option>
            <option>Public Safety & Hazards</option>
            <option>Parks & Public Spaces</option>
            <option>Miscellaneous</option>
          </select>

          {/* Status Filter - Updated with your exact statuses */}
          <select 
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition w-full sm:w-auto"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option>All Status</option>
            <option>Submitted</option>
            <option>Acknowledged</option>
            <option>Assigned</option>
            <option>Resolved</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
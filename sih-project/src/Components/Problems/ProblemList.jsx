// src/components/Problems/ProblemList.jsx
import React from 'react';
import PropTypes from 'prop-types';

const getPriorityClasses = (priority) => {
  // ... (this function is unchanged)
  switch (priority) {
    case 'High': return 'text-red-600 bg-red-100';
    case 'Medium': return 'text-yellow-600 bg-yellow-100';
    case 'Low': return 'text-green-600 bg-green-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

// --- THIS FUNCTION IS NOW UPDATED ---
const getStatusClasses = (status) => {
  switch (status) {
    case 'Submitted':
    case 'Acknowledged':
      return 'text-blue-600 bg-blue-100';
    case 'Assigned':
      return 'text-purple-600 bg-purple-100';
    case 'Resolved':
      return 'text-gray-700 bg-gray-200';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

const ProblemList = ({ problems, onViewDetails }) => {
  return (
    <div className="flex-grow overflow-y-auto">
      <ul className="divide-y divide-gray-200">
        {problems.map((problem) => (
          <li key={problem.complaintId} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{problem.description}</p>
                <p className="text-sm text-gray-500">{problem.category} &bull; {problem.manualLocation}</p>
                <div className="flex items-center space-x-2 mt-2">
                   <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityClasses(problem.priority)}`}>
                    {problem.priority} Priority
                  </span>
                   <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(problem.status)}`}>
                    {problem.status}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={() => onViewDetails(problem)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

ProblemList.propTypes = {
  problems: PropTypes.array.isRequired,
  onViewDetails: PropTypes.func.isRequired,
};

export default ProblemList;
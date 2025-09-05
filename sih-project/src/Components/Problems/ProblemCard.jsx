// sih-project/src/Components/Problems/ProblemCard.jsx
import React from 'react';
import PropTypes from 'prop-types';

// Utility functions for priority and status colors
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'High':
      return 'bg-red-100 text-red-600';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-600';
    case 'Low':
      return 'bg-green-100 text-green-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Open':
      return 'bg-blue-100 text-blue-600';
    case 'In Progress':
      return 'bg-purple-100 text-purple-600';
    case 'Closed':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const ProblemCard = ({ problem }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="h-40 w-full overflow-hidden">
        <img
          src={problem.image}
          alt={problem.title || 'Problem Image'}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-3 line-clamp-2">{problem.title}</h3>
        <div className="flex items-center justify-between">
          {/* Priority */}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(problem.priority)}`}>
            {problem.priority}
          </span>
          {/* Status */}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(problem.status)}`}>
            {problem.status}
          </span>
        </div>
      </div>
    </div>
  );
};

// PropTypes for validation
ProblemCard.propTypes = {
  problem: PropTypes.shape({
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProblemCard;
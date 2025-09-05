// src/components/Problems/ProblemModal.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FiX, FiMapPin, FiTag, FiFileText } from 'react-icons/fi';

const ProblemModal = ({ problem, onClose }) => {
  if (!problem) return null;

  return (
    // Backdrop
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {/* FIXED: Use problem.description instead of problem.title */}
          <h2 className="text-xl font-semibold text-gray-800">{problem.description}</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-grow p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side: Image */}
          <div>
            {/* FIXED: Use problem.imageUrl instead of problem.image */}
            <img 
              src={problem.imageUrl} 
              alt={problem.description} 
              className="w-full h-auto rounded-lg object-cover shadow-md"
            />
          </div>

          {/* Right Side: Details */}
          <div className="space-y-5">
            <div>
              <h3 className="font-semibold text-gray-700 flex items-center mb-2">
                <FiFileText className="mr-2 text-blue-500" /> Description
              </h3>
              <p className="text-gray-600">{problem.description}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700 flex items-center mb-2">
                <FiTag className="mr-2 text-blue-500" /> Category & Status
              </h3>
              <div className="flex flex-wrap gap-2 text-sm">
                {/* FIXED: Use problem.subCategory (camelCase) */}
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{problem.category} / {problem.subCategory}</span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{problem.status}</span>
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">{problem.priority} Priority</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 flex items-center mb-2">
                <FiMapPin className="mr-2 text-blue-500" /> Location Details
              </h3>
              <div className="text-gray-600 text-sm space-y-1">
                <p><strong>District:</strong> {problem.district}</p>
                {/* FIXED: Use problem.manualLocation */}
                <p><strong>Manual Location:</strong> {problem.manualLocation}</p>
                {/* FIXED: Use problem.latitude and problem.longitude directly */}
                <p><strong>Coordinates:</strong> {problem.latitude}, {problem.longitude}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            Assign Task
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
};

// Updated PropTypes to be less strict and match data
ProblemModal.propTypes = {
  problem: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default ProblemModal;
// src/components/Problems/ProblemList.jsx
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FiChevronDown, FiEdit2, FiUserCheck } from 'react-icons/fi';
import { fetchAuthSession } from 'aws-amplify/auth';
import ConfirmDialog from './ConfirmDialog';

const getPriorityClasses = (priority) => {
  switch (priority) {
    case 'High': return 'text-red-600 bg-red-100';
    case 'Medium': return 'text-yellow-600 bg-yellow-100';
    case 'Low': return 'text-green-600 bg-green-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

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

const ProblemList = ({ problems, onViewDetails, userRole, onUpdateSuccess }) => {
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: '',
    title: '',
    message: '',
    onConfirm: null,
  });
  const [isUpdating, setIsUpdating] = useState('');
  const dropdownRefs = useRef({});

  const departments = [
    'Roads & Transportation',
    'Streetlights & Electricity',
    'Sanitation & Waste',
    'Water & Drainage',
    'Public Safety & Hazards',
    'Parks & Public Spaces'
  ];

  const statusOptions = [
    'Acknowledged',
    'In Progress',
    'Resolved',
    'Rejected'
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    console.log('📋 confirmDialog state changed:', confirmDialog);
  }, [confirmDialog]);

  const toggleDropdown = (problemId, type) => {
    console.log('toggleDropdown called:', { problemId, type }); // DEBUG
    const key = `${problemId}-${type}`;
    setDropdownOpen(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

// API call to assign department
const assignDepartmentAPI = async (complaintId, department) => {
  try {
    setIsUpdating(complaintId);
    console.log('assignDepartmentAPI called:', { complaintId, department });
    
    // ✅ FIXED: Proper token access
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken;
    
    if (!idToken) {
      console.log('No authentication token available');
      throw new Error('Authentication failed');
    }
    
    console.log('✅ Authentication token retrieved successfully');
    
    const API_URL = `${import.meta.env.VITE_API_GATEWAY_URL}/complaints/${complaintId}`;
    console.log('Making API call to:', API_URL);
    
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${idToken.toString()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        updateType: 'assignment',
        assignedDepartment: department
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to assign department: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Assignment successful:', result);
    onUpdateSuccess(); // Refresh the data
    
  } catch (error) {
    console.error('Error assigning department:', error);
    alert('Failed to assign department. Please try again.');
  } finally {
    setIsUpdating('');
  }
};


// API call to update status
const updateStatusAPI = async (complaintId, status) => {
  try {
    setIsUpdating(complaintId);
    console.log('updateStatusAPI called:', { complaintId, status });
    
    // ✅ FIXED: Proper token access
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken;
    
    if (!idToken) {
      console.log('No authentication token available');
      throw new Error('Authentication failed');
    }
    
    console.log('✅ Authentication token retrieved successfully');
    
    const API_URL = `${import.meta.env.VITE_API_GATEWAY_URL}/complaints/${complaintId}`;
    
    const response = await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${idToken.toString()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        updateType: 'status',
        status: status
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update status: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    console.log('Status update successful:', result);
    onUpdateSuccess(); // Refresh the data
    
  } catch (error) {
    console.error('Error updating status:', error);
    alert('Failed to update status. Please try again.');
  } finally {
    setIsUpdating('');
  }
};


  // FIXED: Handle assign department with proper callback
  const handleAssignDepartment = (problemId, department) => {
    console.log('📋 handleAssignDepartment called:', { problemId, department });

    // Close the dropdown first
    setDropdownOpen(prev => ({ ...prev, [`${problemId}-assign`]: false }));

    // Create the callback function separately (IMPORTANT!)
    const confirmCallback = () => {
      console.log('🎯 CONFIRMATION CALLBACK EXECUTED!');
      assignDepartmentAPI(problemId, department);
      setConfirmDialog(prev => ({ ...prev, isOpen: false }));
    };

    // Use functional update to ensure state is set correctly
    setConfirmDialog(prev => ({
      ...prev,  // Keep existing properties
      isOpen: true,
      type: 'warning',
      title: 'Assign Department',
      message: `Are you sure you want to assign this complaint to "${department}"? This action will change the status to "Assigned".`,
      onConfirm: confirmCallback
    }));

    console.log('📋 setConfirmDialog called with isOpen: true');
  };



  // FIXED: Handle update status with proper callback
  const handleUpdateStatus = (problemId, status) => {
    console.log('📋 handleUpdateStatus called:', { problemId, status });

    setDropdownOpen(prev => ({ ...prev, [`${problemId}-status`]: false }));

    const confirmCallback = () => {
      console.log('🎯 STATUS UPDATE CALLBACK EXECUTED!');
      updateStatusAPI(problemId, status);
      setConfirmDialog(prev => ({ ...prev, isOpen: false }));
    };

    setConfirmDialog(prev => ({
      ...prev,
      isOpen: true,
      type: status === 'Rejected' ? 'danger' : 'default',
      title: 'Update Status',
      message: `Are you sure you want to change the status to "${status}"? This action cannot be undone.`,
      onConfirm: confirmCallback
    }));

    console.log('📋 setConfirmDialog called with isOpen: true');
  };


  const handleSubmitProgress = (problemId) => {
    console.log(`Submit progress for problem ${problemId}`);
  };

  // FIXED: Handle cancel confirm
  const handleCancelConfirm = () => {
    console.log('Confirmation cancelled'); // DEBUG
    setConfirmDialog({ isOpen: false, onConfirm: null });
  };

  return (
    <>
      <div className="flex-grow overflow-y-auto">
        <ul className="divide-y divide-gray-200">
          {problems.map((problem) => (
            <li key={problem.complaintId} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{problem.description}</p>
                  <p className="text-sm text-gray-500">{problem.category} • {problem.manualLocation}</p>
                  {problem.assignedDepartment && (
                    <p className="text-sm text-purple-600 font-medium">
                      📋 Assigned to: {problem.assignedDepartment}
                    </p>
                  )}
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityClasses(problem.priority)}`}>
                      {problem.priority || 'Medium'} Priority
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(problem.status)}`}>
                      {problem.status}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex-shrink-0 flex items-center space-x-2">
                  {userRole === 'SuperAdmin' ? (
                    // SuperAdmin buttons - Assign Task and Update Status
                    <>
                      {/* Assign Task Dropdown */}
                      <div
                        className="relative"
                        ref={el => dropdownRefs.current[`${problem.complaintId}-assign`] = el}
                      >
                        <button
                          onClick={() => toggleDropdown(problem.complaintId, 'assign')}
                          disabled={isUpdating === problem.complaintId}
                          className="flex items-center px-3 py-2 text-xs font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition disabled:opacity-50"
                        >
                          <FiUserCheck className="mr-1 w-3 h-3" />
                          {isUpdating === problem.complaintId ? 'Updating...' : 'Assign Task'}
                          <FiChevronDown className="ml-1 w-3 h-3" />
                        </button>

                        {dropdownOpen[`${problem.complaintId}-assign`] && (
                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                            <div className="py-1">
                              {departments.map((dept) => (
                                <button
                                  key={dept}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('Department button clicked:', dept); // DEBUG
                                    handleAssignDepartment(problem.complaintId, dept);
                                  }}
                                  className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                  {dept}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Update Status Dropdown */}
                      <div
                        className="relative"
                        ref={el => dropdownRefs.current[`${problem.complaintId}-status`] = el}
                      >
                        <button
                          onClick={() => toggleDropdown(problem.complaintId, 'status')}
                          disabled={isUpdating === problem.complaintId}
                          className="flex items-center px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-50"
                        >
                          {isUpdating === problem.complaintId ? 'Updating...' : 'Update Status'}
                          <FiChevronDown className="ml-1 w-3 h-3" />
                        </button>

                        {dropdownOpen[`${problem.complaintId}-status`] && (
                          <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                            <div className="py-1">
                              {statusOptions.map((status) => (
                                <button
                                  key={status}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('Status button clicked:', status); // DEBUG
                                    handleUpdateStatus(problem.complaintId, status);
                                  }}
                                  className="block w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    // Departmental Admin button - Submit Progress only
                    <button
                      onClick={() => handleSubmitProgress(problem.complaintId)}
                      className="flex items-center px-3 py-2 text-xs font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition"
                    >
                      <FiEdit2 className="mr-1 w-3 h-3" />
                      Submit Progress
                    </button>
                  )}

                  {/* View Details Button - Always visible */}
                  <button
                    onClick={() => onViewDetails(problem)}
                    className="px-4 py-2 text-xs font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        type={confirmDialog.type}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={handleCancelConfirm}
        confirmText="Yes, Continue"
        cancelText="Cancel"
      />
    </>
  );
};

ProblemList.propTypes = {
  problems: PropTypes.array.isRequired,
  onViewDetails: PropTypes.func.isRequired,
  userRole: PropTypes.string.isRequired,
  onUpdateSuccess: PropTypes.func.isRequired,
};

export default ProblemList;

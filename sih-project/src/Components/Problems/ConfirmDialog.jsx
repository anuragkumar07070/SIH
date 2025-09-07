// src/components/Problems/ConfirmDialog.jsx
import React from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const ConfirmDialog = ({ 
  isOpen, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel", 
  onConfirm, 
  onCancel,
  type = "default"
}) => {
  console.log('🔍 ConfirmDialog render:', { isOpen, onConfirm: !!onConfirm }); // DEBUG
  
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getButtonStyles = () => {
    switch (type) {
      case 'danger': return 'bg-red-600 hover:bg-red-700';
      case 'warning': return 'bg-yellow-600 hover:bg-yellow-700';
      default: return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🎯 CONFIRM BUTTON CLICKED!'); // DEBUG
    console.log('🎯 onConfirm exists:', typeof onConfirm === 'function'); // DEBUG
    
    if (typeof onConfirm === 'function') {
      console.log('🎯 Calling onConfirm...'); // DEBUG
      onConfirm();
    } else {
      console.error('❌ onConfirm is not a function!', onConfirm);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('❌ CANCEL BUTTON CLICKED!'); // DEBUG
    
    if (typeof onCancel === 'function') {
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <div className={`p-2 rounded-full ${getTypeStyles()} mr-3`}>
              <FiAlertTriangle size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <div className="p-4">
          <p className="text-gray-600">{message}</p>
        </div>
        
        <div className="flex justify-end space-x-3 p-4 bg-gray-50 rounded-b-lg">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}  // This is the critical button
            className={`px-4 py-2 text-sm font-medium text-white ${getButtonStyles()} rounded-md transition-colors`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

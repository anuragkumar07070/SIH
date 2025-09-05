// // src/components/Problems/ProblemModal.jsx
// import React from 'react';
// import PropTypes from 'prop-types';
// import { FiX, FiMapPin, FiTag, FiFileText } from 'react-icons/fi';

// const ProblemModal = ({ problem, onClose }) => {
//   if (!problem) return null;

//   return (
//     // Backdrop
//     <div 
//       className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
//       onClick={onClose}
//     >
//       {/* Modal Content */}
//       <div 
//         className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
//         onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b border-gray-200">
//           {/* FIXED: Use problem.description instead of problem.title */}
//           <h2 className="text-xl font-semibold text-gray-800">{problem.description}</h2>
//           <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
//             <FiX size={20} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="flex-grow p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Left Side: Image */}
//           <div>
//             {/* FIXED: Use problem.imageUrl instead of problem.image */}
//             <img 
//               src={problem.imageUrl} 
//               alt={problem.description} 
//               className="w-full h-auto rounded-lg object-cover shadow-md"
//             />
//           </div>

//           {/* Right Side: Details */}
//           <div className="space-y-5">
//             <div>
//               <h3 className="font-semibold text-gray-700 flex items-center mb-2">
//                 <FiFileText className="mr-2 text-blue-500" /> Description
//               </h3>
//               <p className="text-gray-600">{problem.description}</p>
//             </div>
            
//             <div>
//               <h3 className="font-semibold text-gray-700 flex items-center mb-2">
//                 <FiTag className="mr-2 text-blue-500" /> Category & Status
//               </h3>
//               <div className="flex flex-wrap gap-2 text-sm">
//                 {/* FIXED: Use problem.subCategory (camelCase) */}
//                 <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{problem.category} / {problem.subCategory}</span>
//                 <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{problem.status}</span>
//                 <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">{problem.priority} Priority</span>
//               </div>
//             </div>

//             <div>
//               <h3 className="font-semibold text-gray-700 flex items-center mb-2">
//                 <FiMapPin className="mr-2 text-blue-500" /> Location Details
//               </h3>
//               <div className="text-gray-600 text-sm space-y-1">
//                 <p><strong>District:</strong> {problem.district}</p>
//                 {/* FIXED: Use problem.manualLocation */}
//                 <p><strong>Manual Location:</strong> {problem.manualLocation}</p>
//                 {/* FIXED: Use problem.latitude and problem.longitude directly */}
//                 <p><strong>Coordinates:</strong> {problem.latitude}, {problem.longitude}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer with Actions */}
//         <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
//           <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
//             Assign Task
//           </button>
//           <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
//             Update Status
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Updated PropTypes to be less strict and match data
// ProblemModal.propTypes = {
//   problem: PropTypes.object,
//   onClose: PropTypes.func.isRequired,
// };

// export default ProblemModal;

// src/components/Problems/ProblemModal.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FiX, FiMapPin, FiTag, FiFileText, FiCamera, FiEdit2, FiTrash2 } from 'react-icons/fi';

const ProblemModal = ({ problem, onClose, userRole }) => {
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({
    description: '',
    image: null,
    imagePreview: null
  });

  if (!problem) return null;

  const handleStatusSubmit = (e) => {
    e.preventDefault();
    // Handle status update submission here
    console.log('Status update:', statusUpdate);
    // Reset form and close
    setStatusUpdate({ description: '', image: null, imagePreview: null });
    setShowStatusForm(false);
    // Here you would typically send the data to your backend
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setStatusUpdate({
        ...statusUpdate,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const removeImage = () => {
    setStatusUpdate({
      ...statusUpdate,
      image: null,
      imagePreview: null
    });
  };

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
          <h2 className="text-xl font-semibold text-gray-800">{problem.description}</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-grow p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side: Image */}
          <div>
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
                <p><strong>Manual Location:</strong> {problem.manualLocation}</p>
                <p><strong>Coordinates:</strong> {problem.latitude}, {problem.longitude}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Update Form (shown when user clicks Status button) */}
        {showStatusForm && (
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <h3 className="font-medium text-gray-800 mb-3 flex items-center">
              <FiEdit2 className="mr-2" />
              Update Problem Status
            </h3>
            <form onSubmit={handleStatusSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={statusUpdate.description}
                  onChange={(e) => setStatusUpdate({...statusUpdate, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows="3"
                  placeholder="Describe the current status of the problem..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo</label>
                
                {statusUpdate.imagePreview ? (
                  // Image Preview
                  <div className="mt-2">
                    <div className="relative inline-block">
                      <img 
                        src={statusUpdate.imagePreview} 
                        alt="Preview" 
                        className="w-40 h-40 object-cover rounded-lg border border-gray-300 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Click the trash icon to remove this image</p>
                  </div>
                ) : (
                  // File Upload Button
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FiCamera className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Click to upload a photo</p>
                        <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowStatusForm(false);
                    setStatusUpdate({ description: '', image: null, imagePreview: null });
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Submit Update
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Footer with Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          {userRole === 'admin' ? (
            // Admin buttons
            <>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Assign Task
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                Update Status
              </button>
            </>
          ) : (
            // User button - only show Status button if form isn't already visible
            !showStatusForm && (
              <button 
                onClick={() => setShowStatusForm(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <FiEdit2 className="mr-2" />
                Status
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

ProblemModal.propTypes = {
  problem: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  userRole: PropTypes.oneOf(['user', 'admin']).isRequired,
};

export default ProblemModal;
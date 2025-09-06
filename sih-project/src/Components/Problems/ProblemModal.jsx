// sih-project/src/Components/Problems/ProblemModal.jsx
import React, { useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import PropTypes from 'prop-types';
import { FiX, FiTag, FiFileText, FiEdit2, FiMapPin, FiCamera, FiTrash2 } from 'react-icons/fi';

const ProblemModal = ({ problem, onClose, userRole, onUpdateSuccess }) => {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateData, setUpdateData] = useState({
    description: '',
    image: null,
    imagePreview: null
  });
  const [error, setError] = useState('');

  if (!problem) return null;

  // In ProblemModal.jsx, update the handleUpdateSubmit function:
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!updateData.description) {
      setError("Description is required.");
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const { idToken } = (await fetchAuthSession()).tokens ?? {};
      if (!idToken) throw new Error("Authentication error");

      const API_URL = `${import.meta.env.VITE_API_GATEWAY_URL}/complaints/${problem.complaintId}`;
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${idToken.toString()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updateType: 'progress',  // Add this line
          description: updateData.description,
          // Note: Image upload functionality would need backend integration
        }),
      });
      if (!response.ok) throw new Error("Failed to submit update.");

      // Reset form
      setUpdateData({ description: '', image: null, imagePreview: null });
      setShowUpdateForm(false);
      onUpdateSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to submit update:", err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUpdateData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const removeImage = () => {
    setUpdateData(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{problem.description}</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <FiX size={20} />
          </button>
        </div>

        <div className="flex-grow p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img src={problem.imageUrl} alt={problem.description} className="w-full h-auto rounded-lg object-cover shadow-md" />
          </div>
          <div className="space-y-5">
            <div>
              <h3 className="font-semibold flex items-center mb-2">
                <FiFileText className="mr-2 text-blue-500" /> Details
              </h3>
              <p><strong>Category:</strong> {problem.category} / {problem.subCategory}</p>
              <p><strong>Status:</strong> {problem.status}</p>
              <p><strong>District:</strong> {problem.district}</p>
              <p><strong>Location:</strong> {problem.manualLocation}</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t flex justify-end space-x-3">
          {userRole !== 'SuperAdmin' && !showUpdateForm && (
            <button
              onClick={() => setShowUpdateForm(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <FiEdit2 className="mr-2" /> Submit Progress Update
            </button>
          )}
        </div>

        {/* Updated Form - Only for Departmental Admins with IMAGE UPLOAD */}
        {showUpdateForm && userRole !== 'SuperAdmin' && (
          <div className="p-4 bg-gray-50 border-t">
            <h3 className="font-medium mb-3">Submit Progress Update</h3>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Progress Description</label>
                <textarea
                  name="description"
                  value={updateData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  rows="4"
                  placeholder="Describe the progress made on this issue..."
                  required
                />
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium mb-2">Upload Progress Photo (Optional)</label>

                {updateData.imagePreview ? (
                  <div className="mt-2">
                    <div className="relative inline-block">
                      <img
                        src={updateData.imagePreview}
                        alt="Progress Preview"
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
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FiCamera className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Click to upload progress photo</p>
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

              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowUpdateForm(false);
                    setUpdateData({ description: '', image: null, imagePreview: null });
                    setError('');
                  }}
                  className="px-4 py-2 text-sm bg-white border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Update'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

ProblemModal.propTypes = {
  problem: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  userRole: PropTypes.string.isRequired,
  onUpdateSuccess: PropTypes.func.isRequired,
};

export default ProblemModal;

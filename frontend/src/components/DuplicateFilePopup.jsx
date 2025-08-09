import { useState } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const API_BASE = "http://localhost:5000/api";

export default function DuplicateFilePopup({ 
  isOpen, 
  onClose, 
  duplicateInfo, 
  file, 
  onUploadSuccess,
  onReplaceSuccess 
}) {
  const [status, setStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleReplace = async () => {
    if (!file) return;

    setIsProcessing(true);
    setStatus("⏳ Replacing file...");

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setStatus("❌ You must be logged in to replace files");
        return;
      }
      const token = await user.getIdToken();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("existingFileId", duplicateInfo.file._id);

      const response = await axios.post(`${API_BASE}/uploads/replace`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setStatus("✅ File replaced successfully");
      
      // Close popup after a short delay
      setTimeout(() => {
        onClose();
        if (onReplaceSuccess) onReplaceSuccess();
        if (onUploadSuccess) onUploadSuccess();
      }, 1500);

    } catch (err) {
      console.error("❌ Replace error:", err);
      setStatus("❌ File replacement failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const getDuplicateMessage = () => {
    if (duplicateInfo.duplicateType === 'hash') {
      return "A file with identical content already exists.";
    } else if (duplicateInfo.duplicateType === 'filename') {
      return "A file with the same name already exists.";
    }
    return "This file already exists.";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          File Already Exists
        </h3>
        
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            {getDuplicateMessage()}
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Existing file:</strong> {duplicateInfo.file.fileName}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Size: {(duplicateInfo.file.size / 1024).toFixed(2)} KB
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Uploaded: {new Date(duplicateInfo.file.uploadDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {status && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            status.includes('✅') ? 'bg-green-100 text-green-800' : 
            status.includes('❌') ? 'bg-red-100 text-red-800' : 
            'bg-blue-100 text-blue-800'
          }`}>
            {status}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleReplace}
            disabled={isProcessing}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-4 py-2 rounded-md transition font-medium"
          >
            {isProcessing ? 'Replacing...' : 'Replace'}
          </button>
          
          <button
            onClick={handleSkip}
            disabled={isProcessing}
            className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition font-medium"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}

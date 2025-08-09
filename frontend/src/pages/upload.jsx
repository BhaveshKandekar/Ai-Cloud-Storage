import { useState } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth"; // Add this import
import DuplicateFilePopup from "../components/DuplicateFilePopup";

const API_BASE = "http://localhost:5000/api";

export default function Upload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [showDuplicatePopup, setShowDuplicatePopup] = useState(false);
  const [duplicateInfo, setDuplicateInfo] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      setStatus("❌ Please select a file");
      return;
    }

    // Get Firebase Auth token
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      setStatus("❌ You must be logged in to upload files");
      return;
    }
    const token = await user.getIdToken();

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("⏳ Uploading...");
      const response = await axios.post(`${API_BASE}/uploads`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      
      setStatus("✅ Uploaded Successfully");
      setFile(null);

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      console.error("❌ Upload error:", err);
      
      // Check if it's a duplicate file error
      if (err.response && err.response.status === 409) {
        setDuplicateInfo(err.response.data);
        setShowDuplicatePopup(true);
        setStatus("⚠️ File already exists - choose an action");
      } else {
        setStatus("❌ Upload Failed - Backend not reachable");
      }
    }
  };

  const handleDuplicatePopupClose = () => {
    setShowDuplicatePopup(false);
    setDuplicateInfo(null);
    setStatus("");
  };

  const handleReplaceSuccess = () => {
    setFile(null);
    setStatus("✅ File replaced successfully");
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Upload Files</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="block w-full mb-4 text-sm text-gray-500 dark:text-gray-300"
      />

      <button
        onClick={handleUpload}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition"
      >
        Upload
      </button>

      {status && <p className="mt-4 text-sm">{status}</p>}

      {/* Duplicate File Popup */}
      {showDuplicatePopup && duplicateInfo && (
        <DuplicateFilePopup
          isOpen={showDuplicatePopup}
          onClose={handleDuplicatePopupClose}
          duplicateInfo={duplicateInfo}
          file={file}
          onUploadSuccess={onUploadSuccess}
          onReplaceSuccess={handleReplaceSuccess}
        />
      )}
    </div>
  );
}

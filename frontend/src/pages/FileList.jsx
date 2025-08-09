import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";

export default function FileList({ refreshTrigger }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError("");
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      const token = await user.getIdToken();

      const res = await axios.get("http://localhost:5000/api/files", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ Sort files alphabetically by name
      const sortedFiles = res.data.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      setFiles(sortedFiles);
    } catch (err) {
      console.error("Error fetching files:", err);
      setError("Failed to fetch files");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileName) => {
    // Add confirmation dialog
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      const token = await user.getIdToken();

      await axios.delete(`http://localhost:5000/api/files/${encodeURIComponent(fileName)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh the file list after successful deletion
      fetchFiles();
    } catch (err) {
      console.error("Error deleting file:", err);
      setError("Failed to delete file");
    }
  };

  // Fetch on mount + whenever refreshTrigger changes
  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line
  }, [refreshTrigger]);

  if (loading) return <p className="text-gray-500">Loading files...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>
      {files.length === 0 ? (
        <p className="text-gray-500">No files uploaded yet.</p>
      ) : (
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-2 border rounded hover:bg-gray-50"
            >
              {/* ✅ Show exact original name from backend */}
              <span className="truncate max-w-[70%]">{file.name}</span>
              <div className="flex gap-2">
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline px-2 py-1 rounded hover:bg-blue-50"
                >
                  Download
                </a>
                <button
                  onClick={() => handleDelete(file.name)}
                  className="text-red-500 hover:underline px-2 py-1 rounded hover:bg-red-50 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

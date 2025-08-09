import { FaCloudUploadAlt, FaTachometerAlt, FaMoon, FaSun } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";

export default function Sidebar({ isDark, setIsDark, onLogout }) {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    setUser(auth.currentUser);
    // Listen for auth changes (optional, for live updates)
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  const navLinkStyle = (path) =>
    `flex items-center space-x-3 px-4 py-3 rounded-lg transition hover:bg-indigo-100 dark:hover:bg-indigo-900 ${
      location.pathname === path ? "bg-indigo-200 dark:bg-indigo-800 font-bold" : ""
    }`;

  return (
    <div className="w-64 min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 shadow-lg flex flex-col justify-between">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-8">☁ AI Cloud</h1>

        {/* User Info */}
        {user && (
          <div className="flex items-center space-x-3 mb-8">
            <img
              src={user.photoURL || "https://ui-avatars.com/api/?name=User"}
              alt="Profile"
              className="w-10 h-10 rounded-full border"
            />
            <div>
              <div className="font-semibold">{user.displayName || "User"}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">{user.email}</div>
            </div>
          </div>
        )}

        <nav className="space-y-2">
          <Link to="/" className={navLinkStyle("/")}>
            <FaTachometerAlt />
            <span>Dashboard</span>
          </Link>
          <Link to="/upload" className={navLinkStyle("/upload")}>
            <FaCloudUploadAlt />
            <span>Upload</span>
          </Link>
          <li>
            <Link to="/files" className="block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
              📁 Files
            </Link>
          </li>
        </nav>
      </div>

      <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <button
          onClick={() => setIsDark(!isDark)}
          className="w-full flex items-center justify-center space-x-2 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg hover:scale-105 transition transform"
        >
          {isDark ? <FaSun /> : <FaMoon />}
          <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:scale-105 transition transform"
        >
          <span>🚪 Logout</span>
        </button>
      </div>
    </div>
  );
}

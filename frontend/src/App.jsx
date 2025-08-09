import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/upload";
import FilesPage from "./pages/Files";
import FileList from "./pages/FileList";
import Landing from "./pages/LandingPage";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import "./firebase"; // Ensure Firebase is initialized

function PrivateRoute({ user, children }) {
  return user ? children : <Navigate to="/" />;
}

function App() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    setUser(null);
  };

  const handleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // User state will be set by onAuthStateChanged
    } catch (error) {
      alert("Sign in failed: " + error.message);
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 dark:from-gray-900 dark:to-gray-800">
      {user && (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Sidebar isDark={isDark} setIsDark={setIsDark} onLogout={handleLogout} />
          <div className="flex-1 p-4">
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute user={user}>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/file-list"
                element={
                  <PrivateRoute user={user}>
                    <FileList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/upload"
                element={
                  <PrivateRoute user={user}>
                    <Upload />
                  </PrivateRoute>
                }
              />
              <Route
                path="/files"
                element={
                  <PrivateRoute user={user}>
                    <FilesPage />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </div>
      )}
      {!user && (
        <Routes>
          <Route
            path="/"
            element={
              <Landing
                handleLogin={handleLogin}
                isDark={isDark}
                setIsDark={setIsDark}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </div>
  );
}

export default App;

import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./components/sidebar";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/upload";
import FilesPage from "./pages/Files";
import FileList from "./pages/FileList";
import Landing from "./pages/LandingPage";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
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
    } catch (error) {
      alert("Sign in failed: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full shadow-lg"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      {user && (
        <div className="flex min-h-screen text-gray-900 dark:text-gray-100">
          <Sidebar isDark={isDark} setIsDark={setIsDark} onLogout={handleLogout} />
          <main className="flex-1 p-6 lg:p-10">
            <AnimatePresence mode="wait">
              <Routes>
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute user={user}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        <Dashboard />
                      </motion.div>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/file-list"
                  element={
                    <PrivateRoute user={user}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        <FileList />
                      </motion.div>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/upload"
                  element={
                    <PrivateRoute user={user}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        <Upload />
                      </motion.div>
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/files"
                  element={
                    <PrivateRoute user={user}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                      >
                        <FilesPage />
                      </motion.div>
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      )}
      {!user && (
        <AnimatePresence mode="wait">
          <Routes>
            <Route
              path="/"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Landing
                    handleLogin={handleLogin}
                    isDark={isDark}
                    setIsDark={setIsDark}
                  />
                </motion.div>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      )}
    </div>
  );
}

export default App;

import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

export default function LandingPage({ handleLogin, isDark, setIsDark }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 dark:from-gray-900 dark:to-gray-800 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg p-10 rounded-2xl shadow-2xl backdrop-blur-lg bg-white/30 dark:bg-gray-800/40 border border-white/20 dark:border-gray-700/30 text-center"
      >
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          AI Cloud Storage
        </h1>

        {/* Subtitle */}
        <p className="mb-8 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          Securely store, manage, and access your files anytime <br />
          with <span className="font-semibold text-indigo-500">AI-powered organization</span>.
        </p>

        {/* Google Login Button */}
        <button
          onClick={handleLogin}
          className="flex items-center justify-center gap-3 w-full py-3 rounded-xl shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 font-medium hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
        >
          <FcGoogle size={24} />
          <span>Sign in with Google</span>
        </button>

        {/* Theme Toggle */}
        <div className="mt-6">
          <button
            onClick={() => setIsDark(!isDark)}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition"
          >
            {isDark ? "☀️ Switch to Light Mode" : "🌙 Switch to Dark Mode"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

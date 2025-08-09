export default function LandingPage({ handleLogin, isDark, setIsDark }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <h1 className="text-4xl font-bold mb-6">Welcome to AI Cloud Storage</h1>
      <p className="mb-6 text-lg text-center max-w-md">
        Securely store, manage, and access your files anytime with AI-powered organization.
      </p>
      <button
        onClick={handleLogin}
        className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Sign in with Google
      </button>
      
    </div>
  );
}

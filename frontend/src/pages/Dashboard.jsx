import { useEffect, useState } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { 
  HardDrive, 
  FileText, 
  Upload, 
  Calendar,
  TrendingUp,
  FolderOpen
} from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

const API_BASE = "http://localhost:5000/api";

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      const token = await user.getIdToken();

      const res = await axios.get(`${API_BASE}/analytics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAnalytics(res.data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transition-all">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transition-all">
        <div className="text-red-500 text-center">
          <p>Error loading dashboard: {error}</p>
          <button 
            onClick={fetchAnalytics}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transition-all">
        <p className="text-gray-500">No data available.</p>
      </div>
    );
  }

  // Prepare chart data
  const chartData = {
    labels: analytics.categories.map(cat => cat.name),
    datasets: [
      {
        data: analytics.categories.map(cat => cat.size),
        backgroundColor: [
          '#3B82F6', // Blue
          '#10B981', // Green
          '#F59E0B', // Yellow
          '#EF4444', // Red
          '#8B5CF6', // Purple
          '#F97316', // Orange
          '#06B6D4', // Cyan
          '#84CC16', // Lime
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#6B7280',
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const percentage = analytics.categories.find(cat => cat.size === value)?.percentage || 0;
            return `${label}: ${formatBytes(value)} (${percentage}%)`;
          }
        }
      }
    },
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transition-all">
        <h2 className="text-3xl font-semibold mb-2 text-gray-800 dark:text-white">
          Welcome Back 👋
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Here's your AI-powered cloud storage overview
        </p>
      </div>

      {/* Storage Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Storage */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Storage Used
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.totalSizeFormatted}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <HardDrive className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((analytics.totalSize / (10 * 1024 * 1024 * 1024)) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {Math.min((analytics.totalSize / (10 * 1024 * 1024 * 1024)) * 100, 100).toFixed(1)}% of 10 GB used
            </p>
          </div>
        </div>

        {/* File Count */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Files
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.fileCount}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Recent Uploads */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Recent Uploads
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.recentUploads}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Last 7 days
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <Upload className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Categories
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics.categories.length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                File types
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <FolderOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Details Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Storage by Category Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transition-all">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Storage by Category
          </h3>
          <div className="h-64 flex items-center justify-center">
            <Pie data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Recent Uploads List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transition-all">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Recent Uploads
          </h3>
          {analytics.recentUploadsList.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No recent uploads
            </p>
          ) : (
            <div className="space-y-3">
              {analytics.recentUploadsList.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                      <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm truncate max-w-32">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {file.category} • {file.size}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg transition-all">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Category Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Files</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Size</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {analytics.categories.map((category, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{category.name}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{category.count}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{category.sizeFormatted}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{category.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

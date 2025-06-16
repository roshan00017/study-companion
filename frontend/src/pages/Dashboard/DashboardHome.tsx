import Loader from "../../components/ui/Loader";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

export default function DashboardHome() {
  const { user, loading, logout } = useAuth();

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Welcome, {user?.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{user?.email}</p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Logout
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

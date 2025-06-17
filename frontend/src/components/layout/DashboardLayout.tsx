import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import Sidebar from "./Sidebar";

export default function DashboardLayout() {
  const { logout, user } = useAuth();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Sidebar />
      <div className="flex-1 ml-64">
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-end items-center px-6 py-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {user?.email}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg
                  bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
                  text-gray-700 dark:text-gray-200
                  transition-colors duration-200"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

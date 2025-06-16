import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, loading, logout } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800">
      <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
      <p className="mt-2 text-gray-600">{user.email}</p>

      <button
        onClick={logout}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}

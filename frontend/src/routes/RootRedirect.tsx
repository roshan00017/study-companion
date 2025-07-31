import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LandingPage from "../pages/LandingPage";

export default function RootRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // or a spinner
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LandingPage />;
}

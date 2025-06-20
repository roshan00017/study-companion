import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../services/firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { mapApiUserToUser } from "../utils/map.utils";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleAuth = async (idToken: string) => {
    try {
      setLoading(true);
      const response = await api.post("/auth/login", { idToken });
      if (response.data.success && response.data.data) {
        const userData = mapApiUserToUser(response.data.data);
        login(userData);
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError("Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      await handleAuth(idToken);
    } catch (err) {
      setError("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCredential = isRegister
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);

      const idToken = await userCredential.user.getIdToken();
      await handleAuth(idToken);
    } catch (err) {
      setError("Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/vite.svg"
            alt="Study Companion"
            className="h-14 w-14 mb-2"
          />
          <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-1">
            Study Companion
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {isRegister ? "Create your account" : "Sign in to your account"}
          </p>
        </div>
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm">
              Email
            </label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm">
              Password
            </label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={isRegister ? "new-password" : "current-password"}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-600 transition disabled:opacity-60"
          >
            {loading
              ? isRegister
                ? "Signing Up..."
                : "Logging In..."
              : isRegister
              ? "Sign Up"
              : "Login"}
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          <span className="mx-3 text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-60"
        >
          <FcGoogle className="h-6 w-6" />
          Continue with Google
        </button>

        <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-600 dark:text-blue-300 hover:underline font-medium"
            type="button"
          >
            {isRegister ? "Login" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}
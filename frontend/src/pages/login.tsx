import { useState } from "react";
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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleAuth = async (idToken: string) => {
    try {
      const response = await api.post("/api/auth/login", {
        idToken,
      });

      if (response.data.success && response.data.data) {
        const userData = mapApiUserToUser(response.data.data);
        login(userData);
        navigate("/dashboard", { replace: true });
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError("Authentication failed");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      await handleAuth(idToken);
    } catch (err) {
      console.error("Google login error:", err);
      setError("Google login failed");
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = isRegister
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);

      const idToken = await userCredential.user.getIdToken();
      await handleAuth(idToken);
    } catch (err) {
      console.error("Email/password auth error:", err);
      setError("Authentication failed");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <h2 className="text-2xl font-bold text-center mb-6">
          {isRegister ? "Sign Up" : "Login"}
        </h2>
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {isRegister ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="text-center my-4">or</div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50"
        >
          Continue with Google
        </button>

        <p className="text-center mt-4 text-sm">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-600 hover:underline"
          >
            {isRegister ? "Login" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}

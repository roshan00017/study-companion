import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

interface User {
  id: string;
  uid: string;
  name: string;
  email: string;
  avatar: string;
}

type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  login: (userData: User) => void; 
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/api/auth/me");
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      window.location.href = "/";
    }
  };
  const login = (userData: User) => {
    setUser(userData);
  };
  return (
    <AuthContext.Provider value={{ user, loading, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

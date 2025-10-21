import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import API from "../lib/api";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await API.get("/auth/me");
        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data } = await API.post("/auth/login", { email, password });
      setUser(data.user);
      navigate("/dashboard");
    } catch (error: any) {
      alert(error.response?.data?.error || "Login failed");
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const { data } = await API.post("/auth/register", {
        name,
        email,
        password,
      });
      setUser(data.user);
      navigate("/dashboard");
    } catch (error: any) {
      alert(error.response?.data?.error || "Registration failed");
    }
  };

  const signOut = async () => {
    try {
      await API.post("/auth/logout");
      setUser(null);
      navigate("/login");
    } catch {
      alert("Logout failed");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

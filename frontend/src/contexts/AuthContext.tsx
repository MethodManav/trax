import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("x-auth-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      navigate("/dashboard");
    }
    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ error?: string }> => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok || data.error) {
        return { error: data.error || "Invalid credentials" };
      }
      localStorage.setItem("x-auth-token", data.token);
      const userData = await getMy(data.token);
      if (userData) {
        setUser(userData.user);
        localStorage.setItem("x-auth-user", JSON.stringify(userData.user));
        return {};
      }
      return { error: "Internal Server Error" };
    } catch (error) {
      return { error: "Network error. Please try again." };
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string
  ): Promise<{ error?: string }> => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, name }),
        }
      );

      const data = await res.json();

      if (!res.ok || data.error) {
        return { error: data.error || "Signup failed" };
      }
      return {};
    } catch (error) {
      return { error: "Network error. Please try again." };
    }
  };

  const logout = () => {
    localStorage.removeItem("x-auth-token");
    localStorage.removeItem("x-auth-user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

async function getMy(token: string) {
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/my`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token!,
      },
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error || "Failed to fetch user data");
    }
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
  loginWithGoogle: () => Promise<{ error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const MOCK_USERS: User[] = [
  { id: "1", email: "admin@pricetracker.com", name: "Admin User", isAdmin: true },
  { id: "2", email: "user@example.com", name: "John Doe", isAdmin: false },
];

// Admin emails list
const ADMIN_EMAILS = ["admin@pricetracker.com", "admin@example.com"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem("pricetracker-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation
    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    if (password.length < 6) {
      return { error: "Invalid credentials" };
    }

    // Find or create user
    let foundUser = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    
    if (!foundUser) {
      // Create new user for demo purposes
      foundUser = {
        id: Date.now().toString(),
        email,
        name: email.split("@")[0],
        isAdmin: ADMIN_EMAILS.includes(email.toLowerCase()),
      };
    }

    setUser(foundUser);
    localStorage.setItem("pricetracker-user", JSON.stringify(foundUser));
    return {};
  };

  const loginWithGoogle = async (): Promise<{ error?: string }> => {
    // Simulate Google OAuth
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const googleUser: User = {
      id: "google-" + Date.now(),
      email: "googleuser@gmail.com",
      name: "Google User",
      isAdmin: false,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=google",
    };

    setUser(googleUser);
    localStorage.setItem("pricetracker-user", JSON.stringify(googleUser));
    return {};
  };

  const signup = async (email: string, password: string, name: string): Promise<{ error?: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!email || !password || !name) {
      return { error: "All fields are required" };
    }

    if (password.length < 6) {
      return { error: "Password must be at least 6 characters" };
    }

    // Check if user exists
    const existingUser = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return { error: "User already exists. Please login instead." };
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      isAdmin: ADMIN_EMAILS.includes(email.toLowerCase()),
    };

    setUser(newUser);
    localStorage.setItem("pricetracker-user", JSON.stringify(newUser));
    return {};
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("pricetracker-user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginWithGoogle, signup, logout }}>
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

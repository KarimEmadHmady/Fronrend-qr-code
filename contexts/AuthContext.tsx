"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// شكل بيانات اليوزر
interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

// شكل بيانات الكونتكست
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

// إنشاء الكونتكست
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// بروڤايدر
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // لما التطبيق يحمل، نحاول نرجع اليوزر والتوكن من localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    // تحقق من وجود البيانات والتأكد من أنها ليست null أو undefined
    if (storedUser && storedToken) {
      try {
        // تأكد أن القيمة ليست undefined أو null
        const parsedUser =
          storedUser && storedUser !== "undefined"
            ? JSON.parse(storedUser)
            : null;
        const parsedToken =
          storedToken && storedToken !== "undefined" ? storedToken : null;

        if (parsedUser && parsedToken) {
          setUser(parsedUser);
          setToken(parsedToken);
        }
      } catch (error) {
        console.error("Error parsing user or token from localStorage:", error);
      }
    }
  }, []);

  // لما يحصل لوجين
  const login = (userData: User, token: string) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  // لما يحصل لوج آوت
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// هوك لاستخدام الكونتكست بسهولة
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

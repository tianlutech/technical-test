import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/router";
import {
  login as loginService,
  logout as logoutService,
  getCurrentUser,
  isAuthenticated as checkAuth,
} from "@/src/service/auth.service";
import { User, ApiResponse, LoginResponse } from "@/src/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string) => Promise<ApiResponse<LoginResponse>>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkSession = useCallback(async () => {
    if (!checkAuth()) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    const result = await getCurrentUser();

    if (result.success && result.data) {
      setUser(result.data);
    } else {
      setUser(null);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = useCallback(async (email: string) => {
    const result = await loginService(email);

    if (result.success && result.data) {
      setUser(result.data.user);
    }

    return result;
  }, []);

  const logout = useCallback(async () => {
    await logoutService();
    setUser(null);
    router.push("/");
  }, [router]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

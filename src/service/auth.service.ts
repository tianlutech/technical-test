import { API_BASE_URL, AUTH_TOKEN_KEY } from "@/src/config/constants.config";
import { ApiResponse, LoginResponse, User } from "@/src/types";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function removeToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export async function login(
  email: string
): Promise<ApiResponse<LoginResponse>> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (data.success && data.data?.token) {
    setToken(data.data.token);
  }

  return data;
}

export async function logout(): Promise<ApiResponse<null>> {
  const token = getToken();

  if (!token) {
    removeToken();
    return { success: true };
  }

  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  removeToken();
  return response.json();
}

export async function getCurrentUser(): Promise<ApiResponse<User>> {
  const token = getToken();

  if (!token) {
    return { success: false, error: "Not authenticated" };
  }

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
}

export { getToken };

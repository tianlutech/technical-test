import { apiGet, apiPost } from './api-client';
import { LoginDto } from '@/src/validators/auth.validator';

export interface AuthUser {
  userId: string;
  email: string;
}

export const authApi = {
  login: (data: LoginDto) => apiPost<{ message: string }>('/api/auth/login', data),
  verifyToken: (token: string) => apiPost<{ token: string }>('/api/auth/verify', { token }),
  getMe: () => apiGet<AuthUser>('/api/auth/me'),
  logout: () => apiPost<{ message: string }>('/api/auth/logout'),
};


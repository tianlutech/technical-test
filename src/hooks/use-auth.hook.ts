// Custom hook for authentication - handles auth logic without try-catch
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { apiClient } from '../frontend-service/api-client';

export function useAuth() {
  const router = useRouter();

  const redirectToLogin = () => {
    router.push('/login');
  };

  const logout = () => {
    apiClient.logout();
    router.push('/login');
  };

  // Auth check effect
  useEffect(() => {
    const token = apiClient.getToken();
    if (!token) {
      redirectToLogin();
    }
  }, [router]);

  return {
    logout,
    redirectToLogin,
  };
}

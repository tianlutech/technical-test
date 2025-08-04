import { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { AuthService } from '../firebase/auth.service';
import { AuthState, AuthContextType, mapFirebaseUser } from '../types/auth.types';

export const useAuth = (): AuthContextType => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChange((user: User | null) => {
      setState(prev => ({
        ...prev,
        user: user ? mapFirebaseUser(user) : null,
        loading: false,
        error: null,
      }));
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await AuthService.signInWithGoogle();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage
      }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await AuthService.logout();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage
      }));
      throw error;
    }
  }, []);

  return {
    ...state,
    signInWithGoogle,
    logout,
  };
};

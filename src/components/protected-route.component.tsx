import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../contexts/auth.context';
import { LoadingSpinner } from '../layout/feedback/loading-spinner.layout';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback 
}) => {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return fallback || <LoadingSpinner />;
  }

  if (!user) {
    return null; // Will redirect to auth page
  }

  return <>{children}</>;
}; 
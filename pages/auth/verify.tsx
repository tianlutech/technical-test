import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { authApi } from '@/src/service/fetch/auth.api';
import { ApiError } from '@/src/service/fetch/api-client';

export default function VerifyPage() {
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (token && typeof token === 'string') {
      handleVerifyToken(token);
    }
  }, [token]);

  const handleVerifyToken = async (token: string) => {
    try {
      await authApi.verifyToken(token);
      router.push('/products');
    } catch (error) {
      if (error instanceof ApiError) {
        console.error('Verification error:', error.message);
      }
      router.push('/?error=invalid_token');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold text-white mb-2">Verifying your login</h1>
        <p className="text-slate-400">Please wait...</p>
      </div>
    </div>
  );
}


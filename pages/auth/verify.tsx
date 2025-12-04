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
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <div className="text-center">
        <div className="w-5 h-5 border-2 border-[#f97316] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-[#8e8e8e]">Signing you in...</p>
      </div>
    </div>
  );
}

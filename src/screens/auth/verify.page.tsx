import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { authApi } from '@/src/service/fetch/auth.api';
import { VerifyPageLayout } from '@/src/layout/verify-page.layout';

export default function VerifyPage() {
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (token && typeof token === 'string') {
      authApi.verifyToken(token)
        .then(() => router.push('/products'))
        .catch(() => router.push('/?error=invalid_token'));
    }
  }, [token, router]);

  return <VerifyPageLayout />;
}


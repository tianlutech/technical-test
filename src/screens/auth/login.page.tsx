import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authApi } from '@/src/service/fetch/auth.api';
import { ApiError } from '@/src/service/fetch/api-client';
import { PageLoader } from '@/src/layout/page-loader.layout';
import { LoginPageLayout } from '@/src/layout/login-page.layout';
import { LoginForm } from '@/src/layout/login-form.layout';
import { LoginSuccess } from '@/src/layout/login-success.layout';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    authApi.getMe({ skipAuthRedirect: true })
      .then(() => router.replace('/products'))
      .catch(() => setCheckingAuth(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    authApi.login({ email })
      .then(() => setSuccess(true))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to send login email'))
      .finally(() => setIsLoading(false));
  };

  const handleReset = () => {
    setSuccess(false);
    setEmail('');
  };

  if (checkingAuth) return <PageLoader variant="dark" />;

  return (
    <LoginPageLayout>
      {success ? (
        <LoginSuccess email={email} onReset={handleReset} />
      ) : (
        <LoginForm
          email={email}
          error={error}
          isLoading={isLoading}
          onEmailChange={setEmail}
          onSubmit={handleSubmit}
        />
      )}
    </LoginPageLayout>
  );
}

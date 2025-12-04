import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/src/layout/button.layout';
import { authApi } from '@/src/service/fetch/auth.api';
import { ApiError } from '@/src/service/fetch/api-client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    authApi.getMe()
      .then(() => {
        router.replace('/products');
      })
      .catch(() => {
        setCheckingAuth(false);
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authApi.login({ email });
      setSuccess(true);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Failed to send login email');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const { token } = router.query;
    if (token && typeof token === 'string') {
      handleVerifyToken(token);
    }
  }, [router.query]);

  const handleVerifyToken = async (token: string) => {
    try {
      await authApi.verifyToken(token);
      router.push('/products');
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Failed to verify login token');
      }
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-[#f97316] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-semibold text-white flex items-center justify-center gap-2">
            <span className="text-[#f97316]">●</span>
            <span>Tianlu</span>
          </h1>
        </div>

        {success ? (
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center mx-auto mb-6">
              <svg className="w-6 h-6 text-[#f97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-white mb-2">Check your email</h2>
            <p className="text-[#8e8e8e] text-sm mb-8">
              We sent a login link to<br />
              <span className="text-white">{email}</span>
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                setEmail('');
              }}
              className="text-sm text-[#8e8e8e] hover:text-white transition-colors"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-lg font-medium text-white mb-2">Welcome back</h2>
              <p className="text-[#8e8e8e] text-sm">Enter your email to sign in</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  required
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2f2f2f] rounded-lg text-white placeholder-[#8e8e8e] focus:outline-none focus:border-[#f97316] transition-colors text-sm"
                />
                {error && (
                  <p className="mt-2 text-sm text-red-400">{error}</p>
                )}
              </div>

              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full"
                size="lg"
              >
                Continue
              </Button>
            </form>

            <p className="text-center text-[#8e8e8e] text-xs mt-8">
              No password required. We&apos;ll email you a magic link.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

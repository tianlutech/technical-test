import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container } from '@/src/layout/container.layout';
import { Card } from '@/src/layout/card.layout';
import { Button } from '@/src/layout/button.layout';
import { Input } from '@/src/layout/input.layout';
import { Text } from '@/src/layout/text.layout';
import { authApi } from '@/src/service/fetch/auth.api';
import { ApiError } from '@/src/service/fetch/api-client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if user is already logged in
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

  // Show loading while checking auth
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <Text variant="body" className="text-slate-400">Loading...</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="text-orange-400">Tianlu</span> Tech
          </h1>
          <p className="text-slate-400">Product Management System</p>
        </div>

        <Card className="p-8 bg-slate-800/50 backdrop-blur border-slate-700">
          {success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="h-8 w-8 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Check your email</h2>
              <p className="text-slate-400 mb-6">
                We sent a login link to <span className="text-orange-400">{email}</span>
              </p>
              <Button
                variant="ghost"
                onClick={() => {
                  setSuccess(false);
                  setEmail('');
                }}
                className="text-slate-300 hover:text-white hover:bg-slate-700"
              >
                Send another email
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-white mb-1">Welcome back</h2>
                <p className="text-slate-400 text-sm">Sign in with your email address</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-400">{error}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  isLoading={isLoading}
                  className="w-full bg-orange-500 hover:bg-orange-600 focus:ring-orange-500 py-3"
                >
                  Send login link
                </Button>
              </form>
            </>
          )}
        </Card>

        <p className="text-center text-slate-500 text-sm mt-6">
          No password needed. We&apos;ll send you a magic link.
        </p>
      </div>
    </div>
  );
}


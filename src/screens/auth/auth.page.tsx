"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../../contexts/auth.context';
import { GoogleSignInButton } from '../components/google-signin-button.component';
import toast from 'react-hot-toast';

export const AuthPage: React.FC = () => {
  const router = useRouter();
  const { user, signInWithGoogle, loading, error } = useAuthContext();

  // Redirect if user is already authenticated
  React.useEffect(() => {
    if (user) {
      router.push('/products');
    }
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.success('Successfully signed in with Google!');
      router.push('/products');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Google sign-in failed';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Product List App
          </h1>
          <p className="text-gray-600">
            Sign in with your Google account
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <GoogleSignInButton
              onClick={handleGoogleSignIn}
              loading={loading}
            />
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                By signing in, you agree to our terms of service and privacy policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

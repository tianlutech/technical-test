import React from 'react';
import { Spinner } from './spinner.layout';

interface LoginFormProps {
  email: string;
  error: string;
  isLoading: boolean;
  onEmailChange: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ email, error, isLoading, onEmailChange, onSubmit }) => {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-white mb-2">Welcome back</h2>
        <p className="text-neutral-500 text-sm">Sign in to continue to your dashboard</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-neutral-400 mb-2">Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="you@company.com"
            required
            className="w-full px-4 py-3.5 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-sm"
          />
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-white hover:bg-neutral-100 text-neutral-900 font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner variant="light" />
              Sending...
            </span>
          ) : 'Continue with Email'}
        </button>
      </form>

      <p className="text-center text-neutral-600 text-xs mt-6">
        No password needed. We&apos;ll send you a secure magic link.
      </p>
    </div>
  );
};


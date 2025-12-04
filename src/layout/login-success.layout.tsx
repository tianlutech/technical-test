import React from 'react';

interface LoginSuccessProps {
  email: string;
  onReset: () => void;
}

export const LoginSuccess: React.FC<LoginSuccessProps> = ({ email, onReset }) => {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center">
      <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mx-auto mb-6">
        <svg className="w-7 h-7 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">Check your inbox</h2>
      <p className="text-neutral-400 text-sm mb-6">
        We sent a magic link to<br /><span className="text-white font-medium">{email}</span>
      </p>
      <button onClick={onReset} className="text-sm text-neutral-500 hover:text-white transition-colors">
        Use a different email
      </button>
    </div>
  );
};


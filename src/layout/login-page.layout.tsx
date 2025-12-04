import React from 'react';

interface LoginPageLayoutProps {
  children: React.ReactNode;
}

export const LoginPageLayout: React.FC<LoginPageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-2xl font-semibold text-white mb-2">Tianlu</h1>
          <p className="text-neutral-500 text-sm">Product Management System</p>
        </div>
        {children}
      </div>
    </div>
  );
};


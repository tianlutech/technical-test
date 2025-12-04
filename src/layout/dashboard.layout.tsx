import React from 'react';
import { Sidebar } from './sidebar.layout';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userEmail: string;
  onLogout: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  userEmail,
  onLogout,
}) => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Sidebar userEmail={userEmail} onLogout={onLogout} />
      <main className="ml-[260px] min-h-screen">
        <div className="max-w-5xl mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

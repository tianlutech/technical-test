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
    <div className="min-h-screen bg-white">
      <Sidebar userEmail={userEmail} onLogout={onLogout} />
      <main className="ml-[260px] min-h-screen">
        <div className="px-10 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

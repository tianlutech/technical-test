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
    <div className="min-h-screen bg-slate-50">
      <Sidebar userEmail={userEmail} onLogout={onLogout} />
      <main className="ml-64 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};


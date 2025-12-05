import React from 'react';
import Link from 'next/link';

interface SidebarProps {
  userEmail: string;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ userEmail, onLogout }) => {
  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-neutral-900 text-white flex flex-col">
      <div className="px-5 py-5 border-b border-neutral-800">
        <span className="font-semibold text-white">Tianlu</span>
      </div>

      <nav className="flex-1 px-3 py-4">
        <p className="px-3 mb-2 text-xs font-medium text-neutral-500 uppercase tracking-wider">Menu</p>
        <Link
          href="/products"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm bg-neutral-800 text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span>Products</span>
        </Link>
      </nav>

      <div className="px-3 py-4 border-t border-neutral-800">
        <p className="px-3 py-2 text-sm text-white truncate">{userEmail}</p>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-400 hover:bg-neutral-800/50 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
};

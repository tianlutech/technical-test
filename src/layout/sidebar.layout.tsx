import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface SidebarProps {
  userEmail: string;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ userEmail, onLogout }) => {
  const router = useRouter();

  const navItems = [
    {
      name: 'Products',
      href: '/products',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-[#0d0d0d] text-white flex flex-col">
      {/* Logo / Brand */}
      <div className="px-5 py-6">
        <h1 className="text-lg font-semibold tracking-tight flex items-center gap-2">
          <span className="text-[#f97316]">●</span>
          <span>Tianlu</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-[#2f2f2f] text-white'
                      : 'text-[#ececec] hover:bg-[#1a1a1a]'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-[#2f2f2f]">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-[#f97316] flex items-center justify-center text-white text-sm font-medium">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="mt-2 w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#ececec] hover:bg-[#1a1a1a] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};

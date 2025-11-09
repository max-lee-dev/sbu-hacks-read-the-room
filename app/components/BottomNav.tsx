'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const BottomNav = () => {
  const pathname = usePathname();

  const isHome = pathname === '/';
  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <nav className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2" style={{ maxWidth: '480px', width: 'calc(100% - 32px)' }}>
      <div
        className="flex h-16 items-center justify-around rounded-2xl px-4 backdrop-blur-md"
        style={{
          backgroundColor: 'rgba(45, 45, 45, 0.85)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)',
        }}
      >
        <Link
          href="/dashboard"
          className="relative flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors"
          aria-label="Library"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            style={{ color: isDashboard ? '#3ECF8E' : '#B0B0B0' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <span className="text-xs font-medium" style={{ color: isDashboard ? '#3ECF8E' : '#B0B0B0' }}>
            Library
          </span>
          {isDashboard && (
            <div
              className="absolute bottom-0 h-0.5 w-8 rounded-full"
              style={{ backgroundColor: '#3ECF8E' }}
            />
          )}
        </Link>

        <Link
          href="/"
          className="relative flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors"
          aria-label="Record"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill={isHome ? '#3ECF8E' : 'none'}
            stroke={isHome ? 'none' : 'currentColor'}
            style={{ color: isHome ? '#3ECF8E' : '#B0B0B0' }}
          >
            <circle cx="12" cy="12" r="10" strokeWidth={isHome ? 0 : 2} />
            <circle cx="12" cy="12" r="4" fill={isHome ? '#1A1A1A' : 'currentColor'} />
          </svg>
          <span className="text-xs font-medium" style={{ color: isHome ? '#3ECF8E' : '#B0B0B0' }}>
            Record
          </span>
          {isHome && (
            <div
              className="absolute bottom-0 h-0.5 w-8 rounded-full"
              style={{ backgroundColor: '#3ECF8E' }}
            />
          )}
        </Link>


        <Link
          href="/dashboard"
          className="relative flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors"
          aria-label="Mine"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            style={{ color: '#B0B0B0' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="text-xs font-medium" style={{ color: '#B0B0B0' }}>
            Profile
          </span>
        </Link>
      </div>
    </nav>
  );
};


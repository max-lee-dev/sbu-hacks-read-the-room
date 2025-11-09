'use client';

import { Recorder } from './components/Recorder';
import { BottomNav } from './components/BottomNav';

export default function Home() {
  return (
    <div className="mx-auto flex min-h-[100svh] max-w-[480px] flex-col font-sans" style={{ backgroundColor: '#1A1A1A' }}>
      <header className="w-full px-4 pt-6 pb-6">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: '#FFB380' }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              style={{ color: '#1A1A1A' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>Room Reader</h1>
            <p className="mt-1 text-xs" style={{ color: '#B0B0B0' }}>
              Social awareness assistant
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-24">
        <Recorder />
      </main>

      <BottomNav />
    </div>
  );
}

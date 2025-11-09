'use client';

import { BottomNav } from './BottomNav';

export const AnalysisSkeleton = () => {
  return (
    <div className="relative mx-auto flex min-h-[100svh] w-[480px] flex-col font-sans" style={{ backgroundColor: '#1A1A1A' }}>
      <header className="w-full px-4 pt-6 pb-4">
        {/* Title skeleton */}
        <div className="h-7 w-48 animate-pulse rounded" style={{ backgroundColor: '#2D2D2D' }} />
        {/* Date skeleton */}
        <div className="mt-1 h-4 w-32 animate-pulse rounded" style={{ backgroundColor: '#2D2D2D' }} />
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-24">
        <div className="w-full flex flex-col gap-4 rounded-2xl border border-black bg-white p-4 shadow-sm" style={{ backgroundColor: '#2D2D2D', border: '1px solid #404040' }}>
          {/* Room Analysis header */}
          <h2 className="mb-4 text-xl font-bold" style={{ color: '#FFFFFF' }}>
            <div className="h-7 w-48 animate-pulse rounded" style={{ backgroundColor: '#2D2D2D' }} />
          </h2>

          {/* Video player skeleton */}
          <div className="rounded-2xl p-3" style={{ backgroundColor: '#1A1A1A', border: '1px solid #404040' }}>
            <div className="w-full animate-pulse rounded-lg" style={{ aspectRatio: '16/9', backgroundColor: '#353535' }} />
          </div>

          {/* Mood skeleton */}
          <div className="rounded-2xl border border-black bg-white p-4 shadow-sm" style={{ backgroundColor: '#2D2D2D', border: '1px solid #404040' }}>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-5 w-5 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
              <div className="h-6 w-20 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
            </div>
            <div className="h-4 w-full animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
          </div>

          {/* Noise Level skeleton */}
          <div className="rounded-2xl border border-black bg-white p-4 shadow-sm" style={{ backgroundColor: '#2D2D2D', border: '1px solid #404040' }}>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-6 w-28 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
            </div>
            <div className="h-6 w-24 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
          </div>

          {/* Suggestions skeleton */}
          <div className="rounded-2xl border border-black bg-white p-4 shadow-sm" style={{ backgroundColor: '#2D2D2D', border: '1px solid #404040' }}>
            <div className="mb-3 flex items-center gap-2">
              <div className="h-5 w-5 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
              <div className="h-6 w-28 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
            </div>
            <ul className="pt-1 list-none">
              {[1, 2, 3].map((idx) => (
                <li key={idx} className="mb-2 flex items-start gap-4">
                  <div className="mt-1 h-5 w-5 shrink-0 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
                  <div className="flex-1 h-4 w-full animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
                </li>
              ))}
            </ul>
          </div>

          {/* Transcription skeleton */}
          <div className="rounded-2xl border border-black bg-white p-4 shadow-sm" style={{ backgroundColor: '#2D2D2D', border: '1px solid #404040' }}>
            <div className="mb-2 flex items-center gap-2">
              <div className="h-5 w-5 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
              <div className="h-6 w-32 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
              <div className="h-4 w-full animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
              <div className="h-4 w-4/5 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
            </div>
          </div>

          {/* Voice Summary skeleton */}
          <div className="rounded-2xl border border-black bg-white p-4 shadow-sm" style={{ backgroundColor: '#2D2D2D', border: '1px solid #404040' }}>
            <div className="mb-2 h-6 w-32 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
            <div className="mb-3 h-12 w-full animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
            <div className="mb-4 flex justify-between">
              <div className="h-4 w-12 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
              <div className="h-4 w-12 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
            </div>
            <div className="flex justify-center">
              <div className="h-10 w-10 animate-pulse rounded-full" style={{ backgroundColor: '#353535' }} />
            </div>
          </div>

          {/* Footer skeleton */}
          <div className="mt-4 border-t border-black pt-3" style={{ borderColor: '#404040' }}>
            <div className="h-3 w-48 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};


'use client';

import { BottomNav } from './BottomNav';

export const AnalysisSkeleton = () => {
  return (
    <div className="mx-auto flex min-h-[100svh] max-w-[480px] flex-col font-sans" style={{ backgroundColor: '#1A1A1A' }}>
      <header className="w-full px-4 pt-6 pb-4">
        {/* Title skeleton */}
        <div className="h-7 w-48 animate-pulse rounded" style={{ backgroundColor: '#2D2D2D' }} />
        {/* Date skeleton */}
        <div className="mt-1 h-4 w-32 animate-pulse rounded" style={{ backgroundColor: '#2D2D2D' }} />
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-24">
        <div className="w-full rounded-2xl border border-black bg-white p-4" style={{ backgroundColor: '#2D2D2D', border: '1px solid #404040', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)' }}>
          {/* Room Analysis header */}
          <div className="mb-4 h-7 w-40 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />

          {/* Video player skeleton */}
          <div className="mb-4 rounded-2xl p-3" style={{ backgroundColor: '#1A1A1A', border: '1px solid #404040' }}>
            <div className="w-full animate-pulse rounded-lg" style={{ aspectRatio: '16/9', backgroundColor: '#353535' }} />
          </div>

          {/* Voice Summary skeleton */}
          <div className="mb-4 rounded-2xl border border-black bg-white p-4" style={{ backgroundColor: '#2D2D2D', border: '1px solid #404040', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)' }}>
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

          {/* Mood skeleton */}
          <div className="mb-4 rounded-2xl border border-black bg-white p-4" style={{ backgroundColor: '#2D2D2D', border: '1px solid #404040', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)' }}>
            <div className="mb-2 h-6 w-20 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
            <div className="h-4 w-full animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
          </div>

          {/* Analytics grid skeleton */}
          <div className="mb-4 grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="border border-gray-400 bg-gray-100 p-3" style={{ backgroundColor: '#353535', border: '1px solid #404040' }}>
                <div className="h-3 w-20 animate-pulse rounded" style={{ backgroundColor: '#2D2D2D' }} />
                <div className="mt-1 h-8 w-16 animate-pulse rounded" style={{ backgroundColor: '#2D2D2D' }} />
              </div>
            ))}
          </div>

          {/* Recommended Targets skeleton */}
          <div className="mb-4">
            <div className="mb-2 h-5 w-48 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
            <ul className="list-none space-y-1">
              {[1, 2].map((idx) => (
                <li key={idx} className="h-4 w-full animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
              ))}
            </ul>
          </div>

          {/* Do Not Approach skeleton */}
          <div className="mb-4">
            <div className="mb-2 h-5 w-32 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
            <ul className="list-none space-y-1">
              {[1].map((idx) => (
                <li key={idx} className="h-4 w-full animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
              ))}
            </ul>
          </div>

          {/* Suggestions skeleton */}
          <div className="mb-4 rounded-2xl border border-black bg-white p-4" style={{ backgroundColor: '#2D2D2D', border: '1px solid #404040', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)' }}>
            <div className="mb-3 h-6 w-28 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
            <ul className="list-none space-y-2">
              {[1, 2, 3].map((idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="h-5 w-5 shrink-0 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-4 w-full animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
                    <div className="h-4 w-5/6 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Transcription skeleton */}
          <div className="mb-4 rounded-2xl border border-black bg-white p-4" style={{ backgroundColor: '#2D2D2D', border: '1px solid #404040', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)' }}>
            <div className="mb-2 h-6 w-32 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
              <div className="h-4 w-full animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
              <div className="h-4 w-4/5 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
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


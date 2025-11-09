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
        <div className="space-y-6">
          {/* Video player skeleton */}
          <div className="rounded-xl p-3" style={{ backgroundColor: '#2D2D2D', border: '1px solid #404040', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)' }}>
            <div className="w-full animate-pulse rounded-lg" style={{ aspectRatio: '9/16', backgroundColor: '#353535' }} />
          </div>

          {/* Mood skeleton */}
          <div className="rounded-xl p-4" style={{ backgroundColor: '#2D2D2D', border: '1px solid #404040', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)' }}>
            <div className="mb-2 h-6 w-20 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
              <div className="h-4 w-5/6 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
              <div className="h-4 w-4/6 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
            </div>
          </div>

          {/* Noise Level skeleton */}
          <div className="rounded-xl p-4" style={{ backgroundColor: '#2D2D2D', border: '1px solid #404040', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)' }}>
            <div className="mb-2 h-6 w-24 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
            <div className="h-8 w-32 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
          </div>

          {/* Suggestions skeleton */}
          <div className="rounded-xl p-4" style={{ backgroundColor: '#2D2D2D', border: '1px solid #404040', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)' }}>
            <div className="mb-3 h-6 w-28 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
            <ul className="space-y-2.5">
              {[1, 2, 3].map((idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1.5 h-5 w-5 shrink-0 animate-pulse rounded-full" style={{ backgroundColor: '#353535' }} />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-4 w-full animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
                    <div className="h-4 w-5/6 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Transcription skeleton */}
          <div className="rounded-xl p-4" style={{ backgroundColor: '#2D2D2D', border: '1px solid #404040', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)' }}>
            <div className="mb-2 h-6 w-32 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
              <div className="h-4 w-full animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
              <div className="h-4 w-4/5 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
            </div>
          </div>

          {/* Analytics skeleton */}
          <div className="rounded-xl p-4" style={{ backgroundColor: '#2D2D2D', border: '1px solid #404040', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)' }}>
            <div className="mb-3 h-6 w-24 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((idx) => (
                <div key={idx}>
                  <div className="h-3 w-20 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
                  <div className="mt-1 h-8 w-16 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Targets skeleton */}
          <div className="rounded-xl p-4" style={{ backgroundColor: '#2D2D2D', border: '1px solid #4CAF50', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)' }}>
            <div className="mb-2 h-6 w-48 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
            <ul className="space-y-2">
              {[1, 2].map((idx) => (
                <li key={idx} className="space-y-1">
                  <div className="h-4 w-full animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
                  <div className="h-4 w-5/6 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
                </li>
              ))}
            </ul>
          </div>

          {/* Do Not Approach skeleton */}
          <div className="rounded-xl p-4" style={{ backgroundColor: '#2D2D2D', border: '1px solid #EF5350', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)' }}>
            <div className="mb-2 h-6 w-32 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
            <ul className="space-y-2">
              {[1].map((idx) => (
                <li key={idx} className="space-y-1">
                  <div className="h-4 w-full animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
                  <div className="h-4 w-4/5 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};


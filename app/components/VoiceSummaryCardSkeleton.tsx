'use client';

export const VoiceSummaryCardSkeleton = () => {
  return (
    <div className="rounded-2xl border border-black bg-white p-4 shadow-sm" style={{ backgroundColor: '#2D2D2D', border: '1px solid #404040' }}>
      <div className="mb-2 flex items-center gap-2">
        <div className="h-5 w-5 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
        <div className="h-6 w-32 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
      </div>
      
      {/* Waveform skeleton */}
      <div className="mb-3 mt-2 flex h-12 items-end justify-center gap-0.5">
        {Array.from({ length: 120 }).map((_, index) => {
          const randomHeight = Math.random() * 0.3 + 0.1;
          const barHeight = Math.max(4, randomHeight * 100);
          return (
            <div
              key={index}
              className="w-1 animate-pulse rounded-sm"
              style={{
                height: `${barHeight}%`,
                backgroundColor: '#353535',
                minHeight: '4px',
              }}
            />
          );
        })}
      </div>

      {/* Time Display skeleton */}
      <div className="mb-4 flex items-center justify-between text-sm">
        <div className="h-4 w-12 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
        <div className="h-4 w-12 animate-pulse rounded" style={{ backgroundColor: '#353535' }} />
      </div>

      {/* Controls skeleton */}
      <div className="flex items-center justify-center gap-3">
        {/* Skip Backward */}
        <div className="h-8 w-8 animate-pulse rounded-full" style={{ backgroundColor: '#353535' }} />
        
        {/* Rewind 10s */}
        <div className="h-10 w-10 animate-pulse rounded-full" style={{ backgroundColor: '#353535' }} />
        
        {/* Play/Pause */}
        <div className="h-14 w-14 animate-pulse rounded-full" style={{ backgroundColor: '#353535' }} />
        
        {/* Fast Forward 10s */}
        <div className="h-10 w-10 animate-pulse rounded-full" style={{ backgroundColor: '#353535' }} />
        
        {/* Skip Forward */}
        <div className="h-8 w-8 animate-pulse rounded-full" style={{ backgroundColor: '#353535' }} />
      </div>
    </div>
  );
};


'use client';

import { useEffect, useState, useId } from 'react';
import { useRouter } from 'next/navigation';
import { BottomNav } from '../components/BottomNav';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function WarningsPage() {
  const router = useRouter();
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const checkboxId = useId();

    // Ensure preference resets when the server restarts, then honor it
    useEffect(() => {
      if (typeof window === 'undefined') return;
      (async () => {
        try {
          const res = await fetch('/api/instance', { cache: 'no-store' });
          const data = await res.json();
          const instanceId = data?.instanceId as string | undefined;
          const storedId = localStorage.getItem('rr:serverInstanceId');
          if (instanceId && storedId !== instanceId) {
            localStorage.removeItem('rr:hideWarnings');
            localStorage.setItem('rr:serverInstanceId', instanceId);
          }
        } catch {
          // ignore network errors; fallback to existing preference
        }
        const hideWarnings = localStorage.getItem('rr:hideWarnings');
        if (hideWarnings === '1') {
          router.replace('/record');
        }
      })();
    }, [router]);

  const handleStartRecording = () => {
    if (dontShowAgain) {
      localStorage.setItem('rr:hideWarnings', '1');
    }
    router.push('/record');
  };

  return (
    <div className="relative mx-auto flex min-h-[100svh] max-w-[480px] flex-col font-sans" style={{ backgroundColor: '#1A1A1A' }}>
      <header className="w-full px-4 pt-6 pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="rounded-full p-2 transition-opacity hover:opacity-80"
            aria-label="Go back"
            style={{ color: '#B0B0B0' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold" style={{ color: '#FFFFFF' }}>Warnings & Guidelines</h1>
        </div>
      </header>

        <main className="flex-1 overflow-y-auto px-4 pb-24 flex flex-col items-center">
          {/* How Room Reader Works Card */}
          <section className="w-full rounded-2xl border border-black bg-white p-6 shadow-sm" style={{ backgroundColor: '#2D2D2D', border: '1px solid #404040' }}>
            <ol className="space-y-8">
              <li className="flex flex-col items-center text-center">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" style={{ color: '#E0E0E0' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-xl font-semibold" style={{ color: '#FFFFFF' }}>Record the Room</h3>
                  </div>
                  <p className="mt-3 text-sm" style={{ color: '#B0B0B0' }}>
                    Record a video of the room for 1-3 seconds.
                  </p>
                </div>
              </li>

              <li className="flex flex-col items-center text-center">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" style={{ color: '#E0E0E0' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className="text-xl font-semibold" style={{ color: '#FFFFFF' }}>AI Anaylsis</h3>
                  </div>
                  <p className="mt-3 text-sm" style={{ color: '#B0B0B0' }}>
                    Our AI reads emotions, noise level, and more.
                  </p>
                </div>
              </li>

              <li className="flex flex-col items-center text-center">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" style={{ color: '#E0E0E0' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <h3 className="text-xl font-semibold" style={{ color: '#FFFFFF' }}>Get Insights</h3>
                  </div>
                  <p className="mt-3 text-sm" style={{ color: '#B0B0B0' }}>
                    Receive suggestions on who to approach and when.
                  </p>
                </div>
              </li>
            </ol>

            {/* Warning Box */}
            <div className="mt-12 mx-auto max-w-[70%] rounded-xl p-3 text-center" style={{ border: '1px solid #EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
              <div className="mb-2 flex items-center justify-center gap-2 text-lg font-semibold" style={{ color: '#EF4444' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#EF4444' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                Warning
              </div>
              <p className="text-sm" style={{ color: '#EF4444' }}>
                Only film in public areas or areas where you have permission to record.
              </p>
            </div>
          </section>

        {/* Don't Show Again Checkbox */}
        <div className="mt-9 flex items-center justify-center">
          <Checkbox
            id={checkboxId}
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
          >
            Don't show this again
          </Checkbox>
        </div>

        {/* Start Recording Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleStartRecording}
            className="rounded-full px-5 py-2 text-sm font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: '#3ECF8E', color: '#1A1A1A' }}
            aria-label="Start recording"
          >
            Start Recording
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}


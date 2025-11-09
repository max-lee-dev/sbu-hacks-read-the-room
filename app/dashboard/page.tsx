'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnalysisResult } from '../lib/types';
import { SavedAnalyses } from '../components/SavedAnalyses';
import { BottomNav } from '../components/BottomNav';

type Category = 'recent' | 'pinned';

export default function DashboardPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<Category>('recent');

  const handleSelect = (result: AnalysisResult) => {
    router.push(`/dashboard/${result.recordingId}`);
  };

  return (
    <div className="mx-auto flex min-h-[100svh] max-w-[480px] flex-col font-sans" style={{ backgroundColor: '#1A1A1A' }}>
      <header className="w-full px-4 pt-6 pb-4">
        <div className="mb-4 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            style={{ color: '#B0B0B0' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="text-xl font-bold" style={{ color: '#FFFFFF' }}>Daily share</h1>
          <div className="ml-auto flex items-center gap-3">
            <button
              className="transition-opacity hover:opacity-80"
              style={{ color: '#B0B0B0' }}
              aria-label="Search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <button
              className="transition-opacity hover:opacity-80"
              style={{ color: '#B0B0B0' }}
              aria-label="Filter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveCategory('recent')}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${activeCategory === 'recent'
              ? 'text-[#1A1A1A]'
              : 'text-[#B0B0B0] hover:opacity-80'
              }`}
            style={{
              backgroundColor: activeCategory === 'recent' ? '#FFB380' : '#2D2D2D',
            }}
          >
            Recent
          </button>
          <button
            onClick={() => setActiveCategory('pinned')}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${activeCategory === 'pinned'
              ? 'text-[#1A1A1A]'
              : 'text-[#B0B0B0] hover:opacity-80'
              }`}
            style={{
              backgroundColor: activeCategory === 'pinned' ? '#FFB380' : '#2D2D2D',
            }}
          >
            Pinned
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-24">
        <SavedAnalyses onSelect={handleSelect} category={activeCategory} />
      </main>

      <BottomNav />
    </div>
  );
}


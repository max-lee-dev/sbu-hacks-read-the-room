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
    <div className="mx-auto flex min-h-[100svh] max-w-[480px] flex-col bg-white">
      <header className="w-full border-b border-black p-4">
        <div className="mb-4 flex items-center gap-2">
          <h1 className="text-xl font-bold">Daily share</h1>
          <div className="ml-auto flex items-center gap-2">
            <button
              className="border border-black bg-white p-2"
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
              className="border border-black bg-white p-2"
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
            className={`border border-black px-4 py-1.5 text-sm font-bold ${activeCategory === 'recent' ? 'bg-black text-white' : 'bg-white'
              }`}
          >
            Recent
          </button>
          <button
            onClick={() => setActiveCategory('pinned')}
            className={`border border-black px-4 py-1.5 text-sm font-bold ${activeCategory === 'pinned' ? 'bg-black text-white' : 'bg-white'
              }`}
          >
            Pinned
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-24">
        <SavedAnalyses onSelect={handleSelect} category={activeCategory} />
      </main>

      <BottomNav />
    </div>
  );
}


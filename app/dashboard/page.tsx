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
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelect = (result: AnalysisResult) => {
    router.push(`/dashboard/${result.recordingId}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="relative mx-auto flex min-h-[100svh] max-w-[480px] flex-col font-sans" style={{ backgroundColor: '#1A1A1A' }}>
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
          <h1 className="text-xl font-bold" style={{ color: '#FFFFFF' }}>Video Library</h1>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="relative flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 h-5 w-5"
              style={{ color: '#808080' }}
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
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search analyses..."
              className="w-full rounded-xl py-2.5 pl-10 pr-10 text-sm"
              style={{
                backgroundColor: '#2D2D2D',
                color: '#FFFFFF',
                border: '1px solid #404040',
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  handleClearSearch();
                }
              }}
              aria-label="Search analyses"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 rounded-full p-1 transition-opacity hover:opacity-80"
                style={{ color: '#808080' }}
                aria-label="Clear search"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClearSearch();
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
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
              backgroundColor: activeCategory === 'recent' ? '#3ECF8E' : '#2D2D2D',
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
              backgroundColor: activeCategory === 'pinned' ? '#3ECF8E' : '#2D2D2D',
            }}
          >
            Pinned
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-24">
        <SavedAnalyses onSelect={handleSelect} category={activeCategory} searchQuery={searchQuery} />
      </main>

      <BottomNav />
    </div>
  );
}

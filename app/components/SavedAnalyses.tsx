'use client';

import { useState, useEffect, useMemo } from 'react';
import { AnalysisResult } from '../lib/types';
import { listSavedAnalyses, deleteAnalysis, getVideoInfo, togglePinned, getPinnedIds } from '../lib/storage';

type Category = 'recent' | 'pinned';

type Props = {
  onSelect: (result: AnalysisResult) => void;
  category?: Category;
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatLikeCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

export const SavedAnalyses = ({ onSelect, category = 'recent' }: Props) => {
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([]);
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = listSavedAnalyses();
    setAnalyses(saved);
    setPinnedIds(getPinnedIds());
  }, []);

  const handleTogglePinned = (recordingId: string) => {
    togglePinned(recordingId);
    setPinnedIds(getPinnedIds());
    setAnalyses(listSavedAnalyses());
  };

  const filteredAnalyses = useMemo(() => {
    let filtered = [...analyses];

    if (category === 'recent') {
      filtered.sort((a, b) => b.createdAt - a.createdAt);
    } else if (category === 'pinned') {
      filtered = filtered.filter((a) => pinnedIds.has(a.recordingId));
      filtered.sort((a, b) => b.createdAt - a.createdAt);
    }

    return filtered;
  }, [analyses, category, pinnedIds]);

  const handleSelect = (result: AnalysisResult) => {
    onSelect(result);
  };



  const handleDelete = (e: React.MouseEvent, recordingId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this analysis?')) {
      deleteAnalysis(recordingId);
      setAnalyses(listSavedAnalyses());
    }
  };

  if (filteredAnalyses.length === 0) {
    return (
      <div className="w-full rounded-2xl p-8 text-center" style={{ backgroundColor: '#2D2D2D' }}>
        <p style={{ color: '#B0B0B0' }}>No saved analyses yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {filteredAnalyses.map((result) => {
        const { insights, summarized } = result;
        const videoUrl = result.video?.publicUrl || getVideoInfo(result.recordingId)?.publicUrl;

        const userName = insights.setting || 'User';

        const likeCount = insights.recommendedTargets.length + insights.peopleCount;

        const displayName = userName.charAt(0).toUpperCase() + userName.slice(1);

        return (
          <div
            key={result.recordingId}
            className="cursor-pointer rounded-2xl p-4 transition-all"
            style={{
              backgroundColor: '#2D2D2D',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)',
            }}
            onClick={() => handleSelect(result)}
          >
            {/* User info */}
            <div className="mb-3 flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white"
                style={{
                  background: 'linear-gradient(135deg, #4A7BA7 0%, #D98BA6 50%, #E8B4A0 100%)',
                }}
              >
                {getInitials(displayName)}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold" style={{ color: '#FFFFFF' }}>
                  {displayName}
                </h3>
                <p className="text-xs" style={{ color: '#B0B0B0' }}>
                  {summarized.mood.split('.')[0] || 'Shared a moment'}
                </p>
              </div>
              <button
                onClick={(e) => handleDelete(e, result.recordingId)}
                className="rounded-full p-1.5 transition-colors hover:opacity-80"
                style={{ color: '#808080' }}
                aria-label="Delete analysis"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Video thumbnail */}
            <div className="relative mb-3 w-full overflow-hidden rounded-xl" style={{ backgroundColor: '#353535' }}>
              {videoUrl ? (
                <div className="relative aspect-[16/9] w-full">
                  <video
                    src={videoUrl}
                    className="h-full w-full object-cover"
                    preload="metadata"
                  />
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full backdrop-blur-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        style={{ color: '#1A1A1A' }}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  {/* Flag icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePinned(result.recordingId);
                    }}
                    className="absolute right-3 top-3 rounded-full p-1.5 backdrop-blur-sm transition-opacity hover:opacity-80"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                    aria-label={pinnedIds.has(result.recordingId) ? 'Unpin' : 'Pin'}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      style={{ color: pinnedIds.has(result.recordingId) ? '#FFB380' : '#FF6B6B' }}
                      fill={pinnedIds.has(result.recordingId) ? 'currentColor' : 'none'}
                      viewBox="0 0 24 24"
                      stroke={pinnedIds.has(result.recordingId) ? 'none' : 'currentColor'}
                      strokeWidth={pinnedIds.has(result.recordingId) ? 0 : 2}
                    >
                      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div
                  className="flex aspect-[9/16] w-full items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #4A7BA7 0%, #D98BA6 50%, #E8B4A0 100%)',
                  }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12"
                      style={{ color: 'rgba(255, 255, 255, 0.6)' }}
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
                    <p className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>No video</p>
                  </div>
                </div>
              )}
            </div>

            {/* Interaction bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    style={{ color: '#FF6B6B' }}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span className="text-sm font-medium" style={{ color: '#FFFFFF' }}>
                    {formatLikeCount(likeCount)}
                  </span>
                </div>
                {/* User avatars */}
                <div className="flex -space-x-2">
                  {Array.from({ length: Math.min(3, insights.peopleCount) }).map((_, i) => (
                    <div
                      key={i}
                      className="h-6 w-6 rounded-full border-2"
                      style={{
                        borderColor: '#2D2D2D',
                        background: 'linear-gradient(135deg, #4A7BA7 0%, #D98BA6 50%, #E8B4A0 100%)',
                      }}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Share functionality
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full transition-opacity hover:opacity-80"
                style={{ backgroundColor: '#FFB380' }}
                aria-label="Share"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  style={{ color: '#1A1A1A' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};


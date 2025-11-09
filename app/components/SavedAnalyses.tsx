'use client';

import { useState, useEffect, useMemo } from 'react';
import { AnalysisResult } from '../lib/types';
import { listSavedAnalyses, deleteAnalysis, getVideoInfo, togglePinned, getPinnedIds } from '../lib/storage';

type Category = 'recent' | 'pinned';

type Props = {
  onSelect: (result: AnalysisResult) => void;
  category?: Category;
  searchQuery?: string;
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

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  return date.toLocaleString('en-US', options);
};

const searchInAnalysis = (result: AnalysisResult, query: string): boolean => {
  if (!query.trim()) return true;

  const lowerQuery = query.toLowerCase().trim();

  // Helper function to check if a string matches the query
  const matches = (text: string | number | null | undefined): boolean => {
    if (text === null || text === undefined) return false;
    return String(text).toLowerCase().includes(lowerQuery);
  };

  // Search in basic fields
  if (
    matches(result.recordingId) ||
    matches(result.model) ||
    matches(result.createdAt) ||
    matches(result.rawText) ||
    matches(result.rules)
  ) {
    return true;
  }

  // Search in insights
  const { insights } = result;
  if (
    matches(insights.setting) ||
    matches(insights.peopleCount) ||
    matches(insights.noiseLevel)
  ) {
    return true;
  }

  // Search in people array
  if (insights.people) {
    for (const person of insights.people) {
      if (
        matches(person.personId) ||
        matches(person.clothing_color) ||
        matches(person.location) ||
        person.action.some((action) => matches(action))
      ) {
        return true;
      }
    }
  }

  // Search in recommendedTargets
  if (insights.recommendedTargets) {
    for (const target of insights.recommendedTargets) {
      if (matches(target.personId) || matches(target.reason)) {
        return true;
      }
    }
  }

  // Search in doNotApproach
  if (insights.doNotApproach) {
    for (const item of insights.doNotApproach) {
      if (matches(item.personId) || matches(item.reason)) {
        return true;
      }
    }
  }

  // Search in summarized fields
  const { summarized } = result;
  if (
    matches(summarized.mood) ||
    matches(summarized.noiseLevel) ||
    matches(summarized.transcription)
  ) {
    return true;
  }

  // Search in suggestions
  if (summarized.suggestions) {
    for (const suggestion of summarized.suggestions) {
      if (matches(suggestion.text)) {
        return true;
      }
    }
  }

  // Search in perFrame data
  if (result.perFrame) {
    for (const frame of result.perFrame) {
      if (matches(frame.t)) {
        return true;
      }
      if (frame.people) {
        for (const person of frame.people) {
          if (
            matches(person.id) ||
            matches(person.emotion) ||
            matches(person.availability) ||
            matches(person.engagement) ||
            matches(person.confidence)
          ) {
            return true;
          }
        }
      }
    }
  }

  return false;
};

export const SavedAnalyses = ({ onSelect, category = 'recent', searchQuery = '' }: Props) => {
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

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((result) => searchInAnalysis(result, searchQuery));
    }

    // Apply category filter
    if (category === 'recent') {
      filtered.sort((a, b) => b.createdAt - a.createdAt);
    } else if (category === 'pinned') {
      filtered = filtered.filter((a) => pinnedIds.has(a.recordingId));
      filtered.sort((a, b) => b.createdAt - a.createdAt);
    }

    return filtered;
  }, [analyses, category, pinnedIds, searchQuery]);

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
        <p style={{ color: '#B0B0B0' }}>
          {searchQuery.trim()
            ? `No analyses found matching "${searchQuery}".`
            : category === 'pinned'
              ? 'No pinned analyses yet.'
              : 'No saved analyses yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {filteredAnalyses.map((result) => {
        const { insights, summarized } = result;
        const videoUrl = result.video?.publicUrl || getVideoInfo(result.recordingId)?.publicUrl;

        const userName = insights.setting || 'User';

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
              <div className="flex-1">
                <h3 className="pl-2 text-lg font-semibold" style={{ color: '#FFFFFF' }}>
                  {displayName}
                </h3>
                <p className="pl-2 text-xs" style={{ color: '#B0B0B0' }}>
                  {formatDate(result.createdAt)}
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
            <div className="relative mb-3 w-full overflow-hidden rounded-2xl" style={{ backgroundColor: '#353535' }}>
              {videoUrl ? (
                <div className="relative aspect-[16/9] w-full">
                  <video
                    src={videoUrl}
                    className="h-full w-full object-cover"
                    preload="metadata"
                  />
                  {/* Flag icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTogglePinned(result.recordingId);
                    }}
                    className="absolute right-3 top-3 rounded-full p-1.5 backdrop-blur-sm transition-opacity hover:opacity-80"
                    aria-label={pinnedIds.has(result.recordingId) ? 'Unpin' : 'Pin'}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      style={{ color: pinnedIds.has(result.recordingId) ? '#3ECF8E' : '#FF6B6B' }}
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
          </div>
        );
      })}
    </div>
  );
};


'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AnalysisResult } from '@/app/lib/types';
import { getAnalysis, getVideoInfo } from '@/app/lib/storage';
import { BottomNav } from '@/app/components/BottomNav';

export default function AnalysisDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const result = getAnalysis(id);
    if (result) {
      setAnalysis(result);
      const embeddedUrl = result.video?.publicUrl || null;
      if (embeddedUrl) {
        setVideoUrl(embeddedUrl);
      } else {
        const vi = getVideoInfo(id);
        setVideoUrl(vi?.publicUrl || null);
      }
    } else {
      // If analysis not found, redirect to dashboard
      router.push('/dashboard');
    }
    setLoading(false);
  }, [id, router]);

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[100svh] max-w-[480px] flex-col font-sans" style={{ backgroundColor: '#1A1A1A' }}>
        <div className="flex flex-1 items-center justify-center">
          <p style={{ color: '#B0B0B0' }}>Loading...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="mx-auto flex min-h-[100svh] max-w-[480px] flex-col font-sans" style={{ backgroundColor: '#1A1A1A' }}>
        <div className="flex flex-1 items-center justify-center">
          <p style={{ color: '#B0B0B0' }}>Analysis not found</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  const { insights, summarized } = analysis;

  return (
    <div className="mx-auto flex min-h-[100svh] max-w-[480px] flex-col font-sans" style={{ backgroundColor: '#1A1A1A' }}>
      <header className="w-full px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold capitalize" style={{ color: '#FFFFFF' }}>{insights.setting}</h1>
        <p className="mt-1 text-xs" style={{ color: '#B0B0B0' }}>
          {new Date(analysis.createdAt).toLocaleDateString([], {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-24">
        <div className="space-y-6">
          {/* Video player */}
          {videoUrl && (
            <div className="rounded-xl p-3" style={{ backgroundColor: '#2D2D2D', border: '1px solid #404040', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)' }}>
              <video
                key={videoUrl}
                controls
                playsInline
                className="w-full rounded-lg"
                src={videoUrl}
              />
            </div>
          )}

          {/* Mood */}
          {summarized.mood && (
            <div className="rounded-xl p-4" style={{ backgroundColor: '#2D2D2D', border: '1px solid #404040', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)' }}>
              <h2 className="mb-2 text-lg font-semibold" style={{ color: '#FFFFFF' }}>Mood</h2>
              <p className="text-sm leading-relaxed" style={{ color: '#B0B0B0' }}>
                {summarized.mood}
              </p>
            </div>
          )}

          {/* Noise Level */}
          {summarized.noiseLevel && (
            <div className="rounded-xl p-4" style={{ backgroundColor: '#2D2D2D', border: '1px solid #404040', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)' }}>
              <h2 className="mb-2 text-lg font-semibold" style={{ color: '#FFFFFF' }}>Noise Level</h2>
              <p className="text-2xl font-bold capitalize" style={{ color: '#FFFFFF' }}>
                {summarized.noiseLevel}
              </p>
            </div>
          )}

          {/* Suggestions */}
          {summarized.suggestions && summarized.suggestions.length > 0 && (
            <div className="rounded-xl p-4" style={{ backgroundColor: '#2D2D2D', border: '1px solid #404040', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)' }}>
              <h2 className="mb-3 text-lg font-semibold" style={{ color: '#FFFFFF' }}>Suggestions</h2>
              <ul className="space-y-2.5">
                {summarized.suggestions.map((suggestion, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-sm leading-relaxed"
                    style={{ color: '#B0B0B0' }}
                  >
                    <span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-medium" style={{ backgroundColor: '#FFB380', color: '#1A1A1A' }}>
                      {idx + 1}
                    </span>
                    <span className="flex-1">{suggestion.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Transcription */}
          {summarized.transcription && (
            <div className="rounded-xl p-4" style={{ backgroundColor: '#2D2D2D', border: '1px solid #404040', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)' }}>
              <h2 className="mb-2 text-lg font-semibold" style={{ color: '#FFFFFF' }}>Transcription</h2>
              <p className="text-sm leading-relaxed" style={{ color: '#B0B0B0' }}>
                {summarized.transcription}
              </p>
            </div>
          )}

          {/* Additional Analytics */}
          <div className="rounded-xl p-4" style={{ backgroundColor: '#2D2D2D', border: '1px solid #404040', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)' }}>
            <h2 className="mb-3 text-lg font-semibold" style={{ color: '#FFFFFF' }}>Analytics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs" style={{ color: '#808080' }}>People Count</div>
                <div className="mt-1 text-2xl font-bold" style={{ color: '#FFFFFF' }}>{insights.peopleCount}</div>
              </div>
              <div>
                <div className="text-xs" style={{ color: '#808080' }}>Approachable</div>
                <div className="mt-1 text-2xl font-bold" style={{ color: '#4CAF50' }}>
                  {insights.recommendedTargets.length}
                </div>
              </div>
              <div>
                <div className="text-xs" style={{ color: '#808080' }}>Avoid</div>
                <div className="mt-1 text-2xl font-bold" style={{ color: '#EF5350' }}>
                  {insights.doNotApproach.length}
                </div>
              </div>
              <div>
                <div className="text-xs" style={{ color: '#808080' }}>Model</div>
                <div className="mt-1 text-sm font-medium" style={{ color: '#B0B0B0' }}>{analysis.model}</div>
              </div>
            </div>
          </div>

          {/* Recommended Targets */}
          {insights.recommendedTargets.length > 0 && (
            <div className="rounded-xl p-4" style={{ backgroundColor: '#2D2D2D', border: '1px solid #4CAF50', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)' }}>
              <h2 className="mb-2 text-lg font-semibold" style={{ color: '#4CAF50' }}>
                Recommended to Approach
              </h2>
              <ul className="space-y-2">
                {insights.recommendedTargets.map((target, idx) => (
                  <li
                    key={idx}
                    className="text-sm"
                    style={{ color: '#B0B0B0' }}
                  >
                    <span className="font-medium" style={{ color: '#FFFFFF' }}>Person {target.personId}</span>: {target.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Do Not Approach */}
          {insights.doNotApproach.length > 0 && (
            <div className="rounded-xl p-4" style={{ backgroundColor: '#2D2D2D', border: '1px solid #EF5350', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)' }}>
              <h2 className="mb-2 text-lg font-semibold" style={{ color: '#EF5350' }}>
                Avoid Approaching
              </h2>
              <ul className="space-y-2">
                {insights.doNotApproach.map((target, idx) => (
                  <li
                    key={idx}
                    className="text-sm"
                    style={{ color: '#B0B0B0' }}
                  >
                    <span className="font-medium" style={{ color: '#FFFFFF' }}>Person {target.personId}</span>: {target.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
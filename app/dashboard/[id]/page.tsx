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
      <div className="mx-auto flex min-h-[100svh] max-w-[480px] flex-col bg-white">
        <div className="flex flex-1 items-center justify-center">
          <p>Loading...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="mx-auto flex min-h-[100svh] max-w-[480px] flex-col bg-white">
        <div className="flex flex-1 items-center justify-center">
          <p>Analysis not found</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  const { insights, summarized } = analysis;

  return (
    <div className="mx-auto flex min-h-[100svh] max-w-[480px] flex-col bg-white">
      <header className="w-full border-b border-black p-4">
        <h1 className="text-xl font-bold">{insights.setting}</h1>
        <p className="mt-1 text-xs">
          {new Date(analysis.createdAt).toLocaleDateString([], {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="space-y-4">
          {/* Video player */}
          {videoUrl && (
            <div className="border border-black bg-gray-100 p-2">
              <video
                key={videoUrl}
                controls
                playsInline
                className="w-full"
                src={videoUrl}
              />
            </div>
          )}
          {/* Mood */}
          {summarized.mood && (
            <div className="border border-black bg-white p-4">
              <h2 className="mb-2 text-lg font-bold">Mood</h2>
              <p className="text-sm">{summarized.mood}</p>
            </div>
          )}

          {/* Noise Level */}
          {summarized.noiseLevel && (
            <div className="border border-black bg-white p-4">
              <h2 className="mb-2 text-lg font-bold">Noise Level</h2>
              <p className="text-2xl font-bold">{summarized.noiseLevel}</p>
            </div>
          )}

          {/* Suggestions */}
          {summarized.suggestions && summarized.suggestions.length > 0 && (
            <div className="border border-black bg-white p-4">
              <h2 className="mb-3 text-lg font-bold">Suggestions</h2>
              <ul className="list-none">
                {summarized.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="mb-2 flex items-start gap-2 text-sm">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center border border-black bg-black text-xs font-bold text-white">
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
            <div className="border border-black bg-white p-4">
              <h2 className="mb-2 text-lg font-bold">Transcription</h2>
              <p className="text-sm">{summarized.transcription}</p>
            </div>
          )}

          {/* Additional Analytics */}
          <div className="border border-black bg-white p-4">
            <h2 className="mb-3 text-lg font-bold">Analytics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs">People Count</div>
                <div className="mt-1 text-2xl font-bold">{insights.peopleCount}</div>
              </div>
              <div>
                <div className="text-xs">Approachable</div>
                <div className="mt-1 text-2xl font-bold">{insights.recommendedTargets.length}</div>
              </div>
              <div>
                <div className="text-xs">Avoid</div>
                <div className="mt-1 text-2xl font-bold">{insights.doNotApproach.length}</div>
              </div>
              <div>
                <div className="text-xs">Model</div>
                <div className="mt-1 text-sm font-bold">{analysis.model}</div>
              </div>
            </div>
          </div>

          {/* Recommended Targets */}
          {insights.recommendedTargets.length > 0 && (
            <div className="border border-black bg-white p-4">
              <h2 className="mb-2 text-lg font-bold">Recommended to Approach</h2>
              <ul className="list-none">
                {insights.recommendedTargets.map((target, idx) => (
                  <li key={idx} className="mb-1 text-sm">
                    <span className="font-bold">Person {target.personId}</span>: {target.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Do Not Approach */}
          {insights.doNotApproach.length > 0 && (
            <div className="border border-black bg-white p-4">
              <h2 className="mb-2 text-lg font-bold">Avoid Approaching</h2>
              <ul className="list-none">
                {insights.doNotApproach.map((target, idx) => (
                  <li key={idx} className="mb-1 text-sm">
                    <span className="font-bold">Person {target.personId}</span>: {target.reason}
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


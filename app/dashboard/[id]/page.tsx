'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AnalysisResult } from '@/app/lib/types';
import { getAnalysis, getVideoInfo } from '@/app/lib/storage';
import { BottomNav } from '@/app/components/BottomNav';
import { RulesCitation } from '@/app/components/RulesCitation';

export default function AnalysisDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

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

  useEffect(() => {
    if (!analysis?.summarized?.transcription) return;

    // If audio already exists in result, use it
    if (analysis.audio?.blobUrl) {
      setAudioUrl(analysis.audio.blobUrl);
      return;
    }

    // Otherwise fetch audio for saved analyses
    let active = true;
    let tempUrl: string | null = null;

    const fetchAudio = async () => {
      try {
        const res = await fetch('/api/audio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: analysis.summarized.transcription }),
        });

        if (!res.ok || !active) return;

        const blob = await res.blob();
        tempUrl = URL.createObjectURL(blob);
        if (active) {
          setAudioUrl(tempUrl);
        }
      } catch (error) {
        console.error('Failed to fetch audio:', error);
      }
    };

    fetchAudio();

    return () => {
      active = false;
      if (tempUrl) {
        URL.revokeObjectURL(tempUrl);
      }
    };
  }, [analysis]);

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[100svh] max-w-[480px] flex-col bg-white">
        <div className="flex flex-1 items-center justify-center">
          <p className="text-black">Loading...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="mx-auto flex min-h-[100svh] max-w-[480px] flex-col bg-white">
        <div className="flex flex-1 items-center justify-center">
          <p className="text-black">Analysis not found</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  const { insights, summarized } = analysis;

  return (
    <div className="mx-auto flex min-h-[100svh] max-w-[480px] flex-col bg-white">
      <header className="w-full border-b border-black p-4">
        <h1 className="text-xl font-bold text-black">{insights.setting}</h1>
        <p className="mt-1 text-xs text-black">
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
            <div className="rounded-lg border border-black bg-gray-100 p-2">
              <video
                key={videoUrl}
                controls
                playsInline
                className="w-full rounded-md"
                src={videoUrl}
              />
            </div>
          )}

          {/* Voice Summary */}
          {audioUrl && (
            <div className="rounded-lg border border-black bg-white p-4">
              <h2 className="mb-2 text-lg font-bold text-black">Voice Summary</h2>
              <audio controls className="w-full" src={audioUrl} />
            </div>
          )}

          {/* Mood */}
          {summarized.mood && (
            <div className="rounded-lg border border-black bg-white p-4">
              <h2 className="mb-2 text-lg font-bold text-black">Mood</h2>
              <p className="text-sm text-black">{summarized.mood}</p>
            </div>
          )}

          {/* Noise Level */}
          {summarized.noiseLevel && (
            <div className="rounded-lg border border-black bg-white p-4">
              <h2 className="mb-2 text-lg font-bold text-black">Noise Level</h2>
              <p className="text-2xl font-bold text-black">{summarized.noiseLevel}</p>
            </div>
          )}

          {/* Suggestions */}
          {summarized.suggestions && summarized.suggestions.length > 0 && (
            <div className="rounded-lg border border-black bg-white p-4">
              <h2 className="mb-3 text-lg font-bold text-black">Suggestions</h2>
              <ul className="list-none">
                {summarized.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="mb-2 flex items-start gap-2 text-sm text-black">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-black bg-black text-xs font-bold text-white">
                      {idx + 1}
                    </span>
                    <span className="flex-1 text-black">{suggestion.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Transcription */}
          {summarized.transcription && (
            <div className="rounded-lg border border-black bg-white p-4">
              <h2 className="mb-2 text-lg font-bold text-black">Transcription</h2>
              <p className="text-sm text-black">{summarized.transcription}</p>
            </div>
          )}

          {/* Rules Citation */}
          {analysis.rules && <RulesCitation rules={analysis.rules} />}

          {/* Additional Analytics */}
          <div className="rounded-lg border border-black bg-white p-4">
            <h2 className="mb-3 text-lg font-bold text-black">Analytics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-black">People Count</div>
                <div className="mt-1 text-2xl font-bold text-black">{insights.peopleCount}</div>
              </div>
              <div>
                <div className="text-xs text-black">Approachable</div>
                <div className="mt-1 text-2xl font-bold text-black">{insights.recommendedTargets.length}</div>
              </div>
              <div>
                <div className="text-xs text-black">Avoid</div>
                <div className="mt-1 text-2xl font-bold text-black">{insights.doNotApproach.length}</div>
              </div>
              <div>
                <div className="text-xs text-black">Model</div>
                <div className="mt-1 text-sm font-bold text-black">{analysis.model}</div>
              </div>
            </div>
          </div>

          {/* Recommended Targets */}
          {insights.recommendedTargets.length > 0 && (
            <div className="rounded-lg border border-black bg-white p-4">
              <h2 className="mb-2 text-lg font-bold text-black">Recommended to Approach</h2>
              <ul className="list-none">
                {insights.recommendedTargets.map((target, idx) => (
                  <li key={idx} className="mb-1 text-sm text-black">
                    <span className="font-bold text-black">Person {target.personId}</span>: <span className="text-black">{target.reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Do Not Approach */}
          {insights.doNotApproach.length > 0 && (
            <div className="rounded-lg border border-black bg-white p-4">
              <h2 className="mb-2 text-lg font-bold text-black">Avoid Approaching</h2>
              <ul className="list-none">
                {insights.doNotApproach.map((target, idx) => (
                  <li key={idx} className="mb-1 text-sm text-black">
                    <span className="font-bold text-black">Person {target.personId}</span>: <span className="text-black">{target.reason}</span>
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


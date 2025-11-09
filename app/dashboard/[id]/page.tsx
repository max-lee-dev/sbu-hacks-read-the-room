'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AnalysisResult } from '@/app/lib/types';
import { getAnalysis, getVideoInfo } from '@/app/lib/storage';
import { BottomNav } from '@/app/components/BottomNav';
import { RulesCitation } from '@/app/components/RulesCitation';
import { MoodCard } from '@/app/components/MoodCard';
import { NoiseCard } from '@/app/components/NoiseCard';
import { SuggestionsCard } from '@/app/components/SuggestionsCard';
import { TranscriptionCard } from '@/app/components/TranscriptionCard';
import { VoiceSummaryCard } from '@/app/components/VoiceSummaryCard';

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
            <div className="rounded-lg border border-black bg-gray-100 overflow-hidden">
              <video
                key={videoUrl}
                controls
                playsInline
                className="w-full h-auto rounded-lg"
                src={videoUrl}
              />
            </div>
          )}

          {audioUrl && <VoiceSummaryCard audioUrl={audioUrl} />}
          <MoodCard mood={summarized.mood || ''} />
          <NoiseCard noiseLevel={summarized.noiseLevel} />
          <SuggestionsCard suggestions={summarized.suggestions || []} />
          <TranscriptionCard transcription={summarized.transcription || ''} />

          {/* Rules Citation */}
          {analysis.rules && <RulesCitation rules={analysis.rules} />}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
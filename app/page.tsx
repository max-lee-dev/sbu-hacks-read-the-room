'use client';

import { useState, useEffect } from 'react';
import { Recorder } from './components/Recorder';
import { AnalysisPanel } from './components/AnalysisPanel';
import { getAnalysis } from './lib/storage';
import { AnalysisResult } from './lib/types';

export default function Home() {
  const [lastRecordingId, setLastRecordingId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleAnalyzed = (recordingId: string) => {
    setLastRecordingId(recordingId);
    const result = getAnalysis(recordingId);
    if (result) {
      setAnalysis(result);
    }
  };

  useEffect(() => {
    if (lastRecordingId) {
      const result = getAnalysis(lastRecordingId);
      if (result) {
        setAnalysis(result);
      }
    }
  }, [lastRecordingId]);

  return (
    <div className="mx-auto flex min-h-[100svh] max-w-[480px] flex-col bg-zinc-50 font-sans dark:bg-black">
      <header className="w-full px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold">Room Reader</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Point your camera at the room, tap Start to record, then Analyze to get social awareness
          guidance.
        </p>
      </header>

      <main className="flex-1 px-4 pb-6">
        <Recorder onAnalyzed={handleAnalyzed} />
        {analysis && <AnalysisPanel result={analysis} />}
      </main>
    </div>
  );
}

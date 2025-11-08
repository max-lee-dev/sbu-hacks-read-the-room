'use client';

import { useRecorder } from '../hooks/useRecorder';
import { useAnalysis } from '../hooks/useAnalysis';

type Props = {
  onAnalyzed?: (recordingId: string) => void;
};

export const Recorder = ({ onAnalyzed }: Props) => {
  const {
    isRecording,
    previewRef,
    frames,
    noiseLevel,
    elapsedLabel,
    recordingId,
    meta,
    start,
    stop,
    reset,
  } = useRecorder({ fps: 1 });

  const { analyze, loading, error } = useAnalysis();

  console.log('[Recorder] Render state:', {
    isRecording,
    framesCount: frames.length,
    recordingId,
    hasMeta: !!meta,
  });

  const handleStart = async () => {
    console.log('[Recorder] handleStart clicked');
    try {
      await start();
      console.log('[Recorder] Start successful');
    } catch (err: any) {
      console.error('[Recorder] Failed to start recording:', err);
      alert('Failed to start recording. Please check camera permissions.');
    }
  };

  const handleStop = () => {
    console.log('[Recorder] handleStop clicked, current frames:', frames.length);
    stop();
    console.log('[Recorder] Stop called, frames after stop:', frames.length);
  };

  const handleAnalyze = async () => {
    if (!frames.length || !recordingId || !meta) return;

    const result = await analyze(recordingId, frames, meta, { maxFrames: 20 });
    if (result && onAnalyzed) {
      onAnalyzed(recordingId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="relative w-full">
        <video
          ref={previewRef}
          playsInline
          muted
          autoPlay
          className="h-auto w-full rounded-xl bg-black object-cover"
          style={{ aspectRatio: '9/16', maxHeight: '70vh' }}
          aria-label="Camera preview"
        />
        {isRecording && (
          <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-sm text-white">
            <span
              className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500"
              aria-hidden="true"
            />
            <span>Recording… {elapsedLabel}</span>
            {noiseLevel && (
              <span className="ml-2 text-xs opacity-80">Noise: {noiseLevel}</span>
            )}
          </div>
        )}
      </div>

      {frames.length > 0 && !isRecording && (
        <div className="w-full">
          <div className="mb-2 text-sm text-zinc-600 dark:text-zinc-300">
            Captured {frames.length} frame{frames.length !== 1 ? 's' : ''}
          </div>
          <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2">
            {frames.slice(0, 12).map((frame) => (
              <img
                key={frame.id}
                src={frame.dataUrl}
                alt={`Frame at ${frame.t}ms`}
                className="h-24 w-auto snap-start rounded-md border border-zinc-200 dark:border-zinc-800"
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex w-full flex-col gap-3">
        <button
          className="w-full rounded-full bg-zinc-900 px-6 py-4 text-lg font-medium text-white transition-colors hover:bg-zinc-800 active:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-black dark:hover:bg-zinc-100 dark:active:bg-zinc-200"
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          tabIndex={0}
          onClick={isRecording ? handleStop : handleStart}
          onKeyDown={(e) => handleKeyDown(e, isRecording ? handleStop : handleStart)}
          disabled={loading}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>

        <button
          className="w-full rounded-full border-2 border-zinc-300 bg-white px-6 py-4 text-lg font-medium text-zinc-900 transition-colors hover:bg-zinc-50 active:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 dark:active:bg-zinc-700"
          aria-label="Analyze recording"
          tabIndex={0}
          onClick={handleAnalyze}
          onKeyDown={(e) => handleKeyDown(e, handleAnalyze)}
          disabled={isRecording || frames.length === 0 || loading}
        >
          {loading ? 'Analyzing…' : 'Analyze Recording'}
        </button>

        {frames.length > 0 && !isRecording && (
          <button
            className="w-full rounded-full border border-zinc-300 bg-transparent px-6 py-3 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 active:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:active:bg-zinc-700"
            aria-label="Reset recording"
            tabIndex={0}
            onClick={reset}
            onKeyDown={(e) => handleKeyDown(e, reset)}
            disabled={loading}
          >
            Reset
          </button>
        )}
      </div>

      {error && (
        <div className="w-full rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
          {error}
        </div>
      )}
    </div>
  );
};


'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useRecorder } from '../hooks/useRecorder';
import { useAnalysis } from '../hooks/useAnalysis';
import { uploadRecordingVideo } from '../lib/videos';
import { persistVideoInfo } from '../lib/storage';

type Props = {
  onAnalyzed?: (recordingId: string) => void;
};

export const Recorder = ({ onAnalyzed }: Props) => {
  const router = useRouter();
  const {
    isRecording,
    previewRef,
    frames,
    blob,
    noiseLevel,
    elapsedLabel,
    recordingId,
    meta,
    start,
    stop,
    reset,
  } = useRecorder({ fps: 1 });

  const { analyze, loading, error } = useAnalysis();
  const hasAutoAnalyzedRef = useRef<string | null>(null);
  const uploadedRef = useRef<string | null>(null);

  // Automatically analyze when recording stops
  useEffect(() => {
    if (
      !isRecording &&
      frames.length > 0 &&
      recordingId &&
      meta &&
      hasAutoAnalyzedRef.current !== recordingId
    ) {
      console.log('[Recorder] Auto-analyzing recording:', recordingId);
      hasAutoAnalyzedRef.current = recordingId;
      analyze(recordingId, frames, meta, { maxFrames: 20 }).then((result) => {
        if (result) {
          if (onAnalyzed) {
            onAnalyzed(recordingId);
          }
          // Redirect to dashboard detail page
          router.push(`/dashboard/${recordingId}`);
        }
      });
    }
  }, [isRecording, frames.length, recordingId, meta, analyze, onAnalyzed, router]);

  // Reset auto-analyze flag when starting a new recording
  useEffect(() => {
    if (isRecording) {
      hasAutoAnalyzedRef.current = null;
    }
  }, [isRecording]);

  // Upload the recorded video blob to Supabase when available
  useEffect(() => {
    if (!blob || !recordingId) return;
    if (uploadedRef.current === recordingId) return;
    uploadedRef.current = recordingId;

    uploadRecordingVideo(recordingId, blob, blob.type)
      .then(({ path, publicUrl }) => {
        persistVideoInfo(recordingId, {
          path,
          publicUrl,
          contentType: blob.type,
          size: blob.size,
        });
      })
      .catch((err) => {
        console.error('[Recorder] Video upload failed:', err);
        uploadedRef.current = null; // allow retry
      });
  }, [blob, recordingId]);

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
    if (result) {
      if (onAnalyzed) {
        onAnalyzed(recordingId);
      }
      // Redirect to dashboard detail page
      router.push(`/dashboard/${recordingId}`);
    }
  };

  const handleReset = () => {
    hasAutoAnalyzedRef.current = null;
    reset();
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="relative w-full border border-black">
        <video
          ref={previewRef}
          playsInline
          muted
          autoPlay
          className="h-auto w-full bg-black"
          style={{ aspectRatio: '9/16', maxHeight: '70vh' }}
          aria-label="Camera preview"
        />
        {isRecording && (
          <div className="absolute left-2 top-2 border border-white bg-black p-2 text-sm text-white">
            <span>Recording {elapsedLabel}</span>
            {noiseLevel && (
              <span className="ml-2">Noise: {noiseLevel}</span>
            )}
          </div>
        )}
      </div>

      {frames.length > 0 && !isRecording && (
        <div className="w-full">
          <div className="mb-2 text-sm">
            Captured {frames.length} frame{frames.length !== 1 ? 's' : ''}
          </div>
          <div className="flex gap-2 overflow-x-auto border border-gray-300 p-2">
            {frames.slice(0, 12).map((frame) => (
              <img
                key={frame.id}
                src={frame.dataUrl}
                alt={`Frame at ${frame.t}ms`}
                className="h-24 w-auto border border-black"
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex w-full flex-col gap-2">
        <button
          className="w-full border border-black bg-black p-4 text-lg text-white disabled:bg-gray-400"
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          tabIndex={0}
          onClick={isRecording ? handleStop : handleStart}
          onKeyDown={(e) => handleKeyDown(e, isRecording ? handleStop : handleStart)}
          disabled={loading}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>

        <button
          className="w-full border border-black bg-white p-4 text-lg disabled:bg-gray-200"
          aria-label="Analyze recording"
          tabIndex={0}
          onClick={handleAnalyze}
          onKeyDown={(e) => handleKeyDown(e, handleAnalyze)}
          disabled={isRecording || frames.length === 0 || loading}
        >
          {loading ? 'Analyzing...' : 'Analyze Recording'}
        </button>

        {frames.length > 0 && !isRecording && (
          <button
            className="w-full border border-black bg-white p-3 text-sm disabled:bg-gray-200"
            aria-label="Reset recording"
            tabIndex={0}
            onClick={handleReset}
            onKeyDown={(e) => handleKeyDown(e, handleReset)}
            disabled={loading}
          >
            Reset
          </button>
        )}
      </div>

      {error && (
        <div className="w-full border border-red-500 bg-red-100 p-3 text-sm text-red-900">
          {error}
        </div>
      )}
    </div>
  );
};


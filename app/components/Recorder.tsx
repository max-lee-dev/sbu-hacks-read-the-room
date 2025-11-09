'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRecorder } from '../hooks/useRecorder';
import { useAnalysis } from '../hooks/useAnalysis';
import { uploadRecordingVideo } from '../lib/videos';
import { persistVideoInfo } from '../lib/storage';
import { AnalysisSkeleton } from './AnalysisSkeleton';

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
  const [showSkeleton, setShowSkeleton] = useState(false);

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
      setShowSkeleton(true);
      analyze(recordingId, frames, meta, { maxFrames: 20 })
        .then((result) => {
          setShowSkeleton(false);
          if (result) {
            if (onAnalyzed) {
              onAnalyzed(recordingId);
            }
            // Redirect to dashboard detail page
            router.push(`/dashboard/${recordingId}`);
          }
        })
        .catch((err) => {
          console.error('[Recorder] Analysis failed:', err);
          setShowSkeleton(false);
        });
    }
  }, [isRecording, frames.length, recordingId, meta, analyze, onAnalyzed, router]);

  // Reset auto-analyze flag when starting a new recording
  useEffect(() => {
    if (isRecording) {
      hasAutoAnalyzedRef.current = null;
      setShowSkeleton(false);
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

  const handleReset = () => {
    hasAutoAnalyzedRef.current = null;
    setShowSkeleton(false);
    reset();
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  if (showSkeleton) {
    return <AnalysisSkeleton />;
  }

  return (
    <div className="pt-20 flex w-full flex-col gap-6">
      <div className="relative w-full overflow-hidden rounded-3xl" style={{ border: '1px solid #333' }}>
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
          <div className="absolute left-3 top-3 rounded-md px-3 py-1.5 text-xs font-medium" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', color: '#FFFFFF' }}>
            <span>Recording {elapsedLabel}</span>
            {noiseLevel && (
              <span className="ml-2">Noise: {noiseLevel}</span>
            )}
          </div>
        )}
      </div>

      <div className="flex w-full flex-col items-center gap-4">
        <button
          className="flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            width: isRecording ? '64px' : '80px',
            height: isRecording ? '64px' : '80px',
            borderRadius: isRecording ? '8px' : '50%',
            backgroundColor: isRecording ? '#EF4444' : '#EF4444',
            border: '4px solid #FFFFFF',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
          }}
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          tabIndex={0}
          onClick={isRecording ? handleStop : handleStart}
          onKeyDown={(e) => handleKeyDown(e, isRecording ? handleStop : handleStart)}
          disabled={loading}
        >
          {isRecording ? (
            <div style={{ width: '24px', height: '24px', backgroundColor: '#FFFFFF', borderRadius: '2px' }} />
          ) : (
            <div style={{ width: '24px', height: '24px', backgroundColor: '#FFFFFF', borderRadius: '50%' }} />
          )}
        </button>

        {frames.length > 0 && !isRecording && (
          <button
            className="rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
            style={{
              backgroundColor: '#333',
              color: '#FFFFFF',
              border: '1px solid #444'
            }}
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
        <div className="w-full rounded-2xl p-3 text-sm" style={{ border: '1px solid #EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
          {error}
        </div>
      )}
    </div>
  );
};


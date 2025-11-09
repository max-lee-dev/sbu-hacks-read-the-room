'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CameraRecorder } from '../lib/camera/CameraRecorder';
import { Frame, RecordingMeta } from '../lib/types';
import { persistRecordingMeta } from '../lib/storage';

type UseRecorderOptions = {
  fps?: number;
  quality?: number;
  maxDurationMs?: number;
  videoConstraints?: MediaTrackConstraints;
};

export const useRecorder = (options?: UseRecorderOptions) => {
  const recorderRef = useRef<CameraRecorder | null>(null);
  const previewRef = useRef<HTMLVideoElement | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [noiseLevel, setNoiseLevel] = useState<'low' | 'medium' | 'high' | undefined>(undefined);
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [meta, setMeta] = useState<RecordingMeta | null>(null);

  useEffect(() => {
    if (!recorderRef.current) {
      recorderRef.current = new CameraRecorder({
        fps: options?.fps ?? 1,
        quality: options?.quality ?? 0.5,
        maxDurationMs: options?.maxDurationMs ?? 60000,
        videoConstraints: options?.videoConstraints ?? {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      recorderRef.current.on('onFrame', (frame) => {
        console.log('[useRecorder] onFrame received:', {
          frameId: frame.id,
          t: frame.t,
        });
        setFrames((prev) => {
          const updated = [...prev, frame];
          console.log('[useRecorder] Frame state updated, total:', updated.length);
          return updated;
        });
      });

      recorderRef.current.on('onNoise', (level) => {
        console.log('[useRecorder] onNoise received:', level);
        setNoiseLevel(level);
      });

      recorderRef.current.on('onStop', (recordingMeta) => {
        console.log('[useRecorder] onStop received:', {
          recordingId: recordingMeta.id,
          frameCount: recordingMeta.frameCount,
        });
        setMeta(recordingMeta);
        persistRecordingMeta(recordingMeta);
        // Ensure blob is captured after MediaRecorder.onstop sets it
        const state = recorderRef.current?.getState();
        if (state?.blob) {
          console.log('[useRecorder] Blob available on onStop, size:', state.blob.size);
          setBlob(state.blob);
        } else {
          console.log('[useRecorder] Blob not yet available on onStop');
        }
      });
    }

    return () => {
      recorderRef.current?.reset();
    };
  }, []);

  useEffect(() => {
    if (!isRecording) return;

    const interval = window.setInterval(() => {
      const elapsed = recorderRef.current?.getElapsedMs() || 0;
      setElapsedMs(elapsed);
    }, 250);

    return () => window.clearInterval(interval);
  }, [isRecording]);

  const start = useCallback(async () => {
    console.log('[useRecorder] start called', { hasPreview: !!previewRef.current, isRecording });
    if (!previewRef.current || isRecording) return;

    try {
      console.log('[useRecorder] Calling CameraRecorder.start()');
      await recorderRef.current?.start(previewRef.current);
      setIsRecording(true);
      setElapsedMs(0);
      setFrames([]);
      setBlob(null);
      setNoiseLevel(undefined);
      const id = recorderRef.current?.getRecordingId() || null;
      setRecordingId(id);
      console.log('[useRecorder] Recording started, ID:', id);
    } catch (error) {
      console.error('[useRecorder] Failed to start recording:', error);
      throw error;
    }
  }, [isRecording]);

  const stop = useCallback(() => {
    console.log('[useRecorder] stop called', { isRecording, currentFrames: frames.length });
    if (!isRecording) return;

    recorderRef.current?.stop();
    setIsRecording(false);

    const state = recorderRef.current?.getState();
    console.log('[useRecorder] After stop, state:', {
      framesInState: state?.frames.length,
      hasBlob: !!state?.blob,
      currentFramesState: frames.length,
    });
    if (state?.blob) {
      setBlob(state.blob);
    }
  }, [isRecording, frames.length]);

  const reset = useCallback(() => {
    recorderRef.current?.reset();
    setIsRecording(false);
    setElapsedMs(0);
    setFrames([]);
    setBlob(null);
    setNoiseLevel(undefined);
    setRecordingId(null);
    setMeta(null);
  }, []);

  const elapsedLabel = useMemo(() => {
    const totalSeconds = Math.floor(elapsedMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds].map((v) => String(v).padStart(2, '0')).join(':');
  }, [elapsedMs]);

  return {
    isRecording,
    previewRef,
    frames,
    blob,
    noiseLevel,
    elapsedMs,
    elapsedLabel,
    recordingId,
    meta,
    start,
    stop,
    reset,
  };
};


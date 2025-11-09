'use client';

import { useCallback, useState } from 'react';
import { SocialAnalysisClient } from '../lib/analysis/SocialAnalysisClient';
import { AnalysisResult, Frame, RecordingMeta } from '../lib/types';
import { getVideoInfo, persistAnalysis, persistVideoInfo } from '../lib/storage';
import { uploadRecordingThumbnail } from '../lib/videos';

type AnalyzeOptions = {
  maxFrames?: number;
  model?: string;
};

export const useAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useState(() => new SocialAnalysisClient())[0];

  const analyze = useCallback(
    async (
      recordingId: string,
      frames: Frame[],
      meta: RecordingMeta,
      options?: AnalyzeOptions
    ) => {
      if (frames.length === 0) {
        setError('No frames to analyze');
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const analysisResult = await clientRef.analyze(recordingId, frames, meta, options);
        let videoInfo = getVideoInfo(recordingId) ?? analysisResult.video;

        // Upload thumbnail from first frame if available
        const firstFrame = frames[0]?.dataUrl;
        if (firstFrame) {
          try {
            const thumbnailResult = await uploadRecordingThumbnail(recordingId, firstFrame);
            videoInfo = {
              ...(videoInfo || { path: '' }),
              thumbnailPath: thumbnailResult.path,
              thumbnailPublicUrl: thumbnailResult.publicUrl,
            };
            persistVideoInfo(recordingId, videoInfo);
          } catch (thumbnailError) {
            console.error('Failed to upload thumbnail:', thumbnailError);
            // Continue without thumbnail if upload fails
          }
        }

        const enriched: AnalysisResult = {
          ...analysisResult,
          video: videoInfo,
        };
        setResult(enriched);
        persistAnalysis(enriched);
        return enriched;
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to analyze recording';
        setError(errorMessage);
        console.error('Analysis error:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [clientRef]
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    analyze,
    loading,
    result,
    error,
    reset,
  };
};


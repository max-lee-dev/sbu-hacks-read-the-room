import { AnalysisResult, Frame, RecordingMeta } from '../types';

type AnalyzeOptions = {
  maxFrames?: number;
  model?: string;
};

const pickSample = (frames: Frame[], max: number): Frame[] => {
  if (frames.length <= max) return frames;
  const step = frames.length / max;
  const sampled: Frame[] = [];
  for (let i = 0; i < max; i++) {
    sampled.push(frames[Math.floor(i * step)]);
  }
  return sampled;
};

export class SocialAnalysisClient {
  async analyze(
    recordingId: string,
    frames: Frame[],
    meta: RecordingMeta,
    options?: AnalyzeOptions
  ): Promise<AnalysisResult> {
    const maxFrames = options?.maxFrames ?? 20;
    const sample = pickSample(frames, maxFrames);

    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recordingId,
        frames: sample.map((f) => ({
          t: f.t,
          dataUrl: f.dataUrl,
        })),
        noiseLevel: meta.noiseLevel,
        model: options?.model,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return (await response.json()) as AnalysisResult;
  }
}


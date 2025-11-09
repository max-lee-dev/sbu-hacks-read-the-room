'use client';

import { AnalysisResult, RecordingMeta, VideoInfo } from './types';

const NS = 'autism.roomreader';
const k = (suffix: string) => `${NS}.${suffix}`;

export const storageKeys = {
  recordingMeta: (id: string) => k(`recording.${id}.meta`),
  analysis: (id: string) => k(`recording.${id}.analysis`),
  video: (id: string) => k(`recording.${id}.video`),
  pinnedIds: () => k('pinned.ids'),
};

export const saveJSON = <T,>(key: string, value: T) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
};

export const loadJSON = <T,>(key: string): T | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const persistRecordingMeta = (meta: RecordingMeta) => {
  saveJSON<RecordingMeta>(storageKeys.recordingMeta(meta.id), meta);
};

export const getRecordingMeta = (id: string) =>
  loadJSON<RecordingMeta>(storageKeys.recordingMeta(id));

export const persistAnalysis = (result: AnalysisResult) => {
  saveJSON<AnalysisResult>(storageKeys.analysis(result.recordingId), result);
};

export const getAnalysis = (recordingId: string) =>
  loadJSON<AnalysisResult>(storageKeys.analysis(recordingId));

export const listSavedAnalyses = (): AnalysisResult[] => {
  if (typeof window === 'undefined') return [];

  const analyses: AnalysisResult[] = [];
  const prefix = `${NS}.recording.`;
  const suffix = '.analysis';

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;

    if (key.startsWith(prefix) && key.endsWith(suffix)) {
      const analysis = loadJSON<AnalysisResult>(key);
      if (analysis) {
        analyses.push(analysis);
      }
    }
  }

  return analyses.sort((a, b) => b.createdAt - a.createdAt);
};

export const deleteAnalysis = (recordingId: string) => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(storageKeys.analysis(recordingId));
  localStorage.removeItem(storageKeys.video(recordingId));
};

export const persistVideoInfo = (recordingId: string, info: VideoInfo) => {
  saveJSON<VideoInfo>(storageKeys.video(recordingId), info);
};

export const getVideoInfo = (recordingId: string) =>
  loadJSON<VideoInfo>(storageKeys.video(recordingId));

export const getPinnedIds = (): Set<string> => {
  const ids = loadJSON<string[]>(storageKeys.pinnedIds());
  return new Set(ids || []);
};

export const togglePinned = (recordingId: string): boolean => {
  if (typeof window === 'undefined') return false;
  const pinnedIds = getPinnedIds();
  const isPinned = pinnedIds.has(recordingId);

  if (isPinned) {
    pinnedIds.delete(recordingId);
  } else {
    pinnedIds.add(recordingId);
  }

  saveJSON<string[]>(storageKeys.pinnedIds(), Array.from(pinnedIds));
  return !isPinned;
};

export const isPinned = (recordingId: string): boolean => {
  return getPinnedIds().has(recordingId);
};


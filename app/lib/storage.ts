'use client';

import { AnalysisResult, RecordingMeta } from './types';

const NS = 'autism.roomreader';
const k = (suffix: string) => `${NS}.${suffix}`;

export const storageKeys = {
  recordingMeta: (id: string) => k(`recording.${id}.meta`),
  analysis: (id: string) => k(`recording.${id}.analysis`),
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


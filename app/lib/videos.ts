'use client';

import { supabase } from './supabase/client';

const guessExt = (contentType?: string) => {
  if (!contentType) return 'webm';
  if (contentType.includes('mp4')) return 'mp4';
  if (contentType.includes('webm')) return 'webm';
  return 'webm';
};

export const uploadRecordingVideo = async (
  recordingId: string,
  blob: Blob,
  contentType?: string
): Promise<{ path: string; publicUrl?: string }> => {
  if (!supabase) {
    throw new Error('Supabase client not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }

  const ext = guessExt(contentType || blob.type);
  const path = `recordings/${recordingId}.${ext}`;
  const bucket = 'videos';

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, blob, { contentType: contentType || blob.type, upsert: false });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { path, publicUrl: data.publicUrl };
};



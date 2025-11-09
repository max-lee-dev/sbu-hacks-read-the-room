'use client';

import { FileText } from 'lucide-react';

type Props = {
  transcription: string;
};

export const TranscriptionCard = ({ transcription }: Props) => {
  if (!transcription) return null;

  return (
    <div className="rounded-lg border border-black bg-white p-4" style={{ backgroundColor: '#2D2D2D', border: '1px solid #404040', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)' }}>
      <div className="mb-2 flex items-center gap-2">
        <FileText className="h-5 w-5 text-black" style={{ color: '#FFFFFF' }} />
        <h2 className="text-lg font-bold text-black" style={{ color: '#FFFFFF' }}>Transcription</h2>
      </div>
      <p className="text-sm text-black" style={{ color: '#B0B0B0' }}>{transcription}</p>
    </div>
  );
};


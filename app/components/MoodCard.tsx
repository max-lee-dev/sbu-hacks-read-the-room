'use client';

import { Smile } from 'lucide-react';

type Props = {
  mood: string;
};

export const MoodCard = ({ mood }: Props) => {
  if (!mood) return null;

  return (
    <div className="rounded-lg border border-black bg-white p-4" style={{ backgroundColor: '#2D2D2D', border: '1px solid #404040', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)' }}>
      <div className="mb-2 flex items-center gap-2">
        <Smile className="h-5 w-5 text-black" style={{ color: '#FFFFFF' }} />
        <h2 className="text-lg font-bold text-black" style={{ color: '#FFFFFF' }}>Mood</h2>
      </div>
      <p className="text-sm text-black" style={{ color: '#B0B0B0' }}>{mood}</p>
    </div>
  );
};


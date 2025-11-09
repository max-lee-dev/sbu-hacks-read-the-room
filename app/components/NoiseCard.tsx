'use client';

import { Volume2 } from 'lucide-react';

type Props = {
  noiseLevel: 'low' | 'medium' | 'high' | null;
};

const capitalizeNoiseLevel = (level: 'low' | 'medium' | 'high' | null): string => {
  if (!level) return '';
  return level.charAt(0).toUpperCase() + level.slice(1);
};

export const NoiseCard = ({ noiseLevel }: Props) => {
  if (!noiseLevel) return null;

  return (
    <div className="rounded-lg border border-black bg-white p-4">
      <div className="mb-2 flex items-center gap-2">
        <Volume2 className="h-5 w-5 text-black" />
        <h2 className="text-lg font-bold text-black">Noise Level</h2>
      </div>
      <p className="text-xl text-black">{capitalizeNoiseLevel(noiseLevel)}</p>
    </div>
  );
};


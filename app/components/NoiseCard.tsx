'use client';


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
    <div className="rounded-2xl border border-[#404040] bg-[#2D2D2D] p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-volume2-icon lucide-volume-2"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" /><path d="M16 9a5 5 0 0 1 0 6" /><path d="M19.364 18.364a9 9 0 0 0 0-12.728" /></svg>
        <h2 className="text-lg font-bold text-white">Noise Level</h2>
      </div>
      <p className="text-md text-[#B0B0B0]">{capitalizeNoiseLevel(noiseLevel)}</p>
    </div>
  );
};


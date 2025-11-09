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
    <div className="rounded-lg border border-black bg-white p-4" style={{ backgroundColor: '#2D2D2D', border: '1px solid #404040', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)' }}>
      <div className="mb-2 flex items-center gap-2">
        <h2 className="text-lg font-bold text-black" style={{ color: '#FFFFFF' }}>Noise Level</h2>
      </div>
      <p className="text-xl text-black" style={{ color: '#FFFFFF' }}>{capitalizeNoiseLevel(noiseLevel)}</p>
    </div>
  );
};


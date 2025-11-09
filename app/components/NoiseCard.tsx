'use client';

type Props = {
  noiseLevel: 'low' | 'medium' | 'high' | null;
};

export const NoiseCard = ({ noiseLevel }: Props) => {
  if (!noiseLevel) return null;

  return (
    <div className="rounded-lg border border-black bg-white p-4">
      <h2 className="mb-2 text-lg font-bold text-black">Noise Level</h2>
      <p className="text-2xl font-bold text-black">{noiseLevel}</p>
    </div>
  );
};


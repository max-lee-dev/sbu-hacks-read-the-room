'use client';

type Props = {
  mood: string;
};

export const MoodCard = ({ mood }: Props) => {
  if (!mood) return null;

  return (
    <div className="rounded-lg border border-black bg-white p-4">
      <h2 className="mb-2 text-lg font-bold text-black">Mood</h2>
      <p className="text-sm text-black">{mood}</p>
    </div>
  );
};


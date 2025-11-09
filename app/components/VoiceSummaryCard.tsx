'use client';

type Props = {
  audioUrl: string;
};

export const VoiceSummaryCard = ({ audioUrl }: Props) => {
  if (!audioUrl) return null;

  return (
    <div className="rounded-lg border border-black bg-white p-4">
      <h2 className="mb-2 text-lg font-bold text-black">Voice Summary</h2>
      <audio controls className="w-full" src={audioUrl} />
    </div>
  );
};


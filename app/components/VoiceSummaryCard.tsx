'use client';

import { Headphones } from 'lucide-react';

type Props = {
  audioUrl: string;
};

export const VoiceSummaryCard = ({ audioUrl }: Props) => {
  if (!audioUrl) return null;

  return (
    <div className="rounded-lg border border-black bg-white p-4">
      <div className="mb-2 flex items-center gap-2">
        <Headphones className="h-5 w-5 text-black" />
        <h2 className="text-lg font-bold text-black">Voice Summary</h2>
      </div>
      <audio controls className="w-full" src={audioUrl} />
    </div>
  );
};

